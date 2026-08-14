"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/errors";
import type {
  Challenge,
  ChallengeRunTestsResponse,
  ChallengeSubmitRequest,
  ChallengeTestResult,
  ChallengeVisibleTestCase,
} from "@/types/api";
import { useRunChallengeTestsMutation } from "@/services/api/challengeApi";
import {
  AuditAiPrWorkspace,
  ExplainAiDiffWorkspace,
  InheritedCodebaseWorkspace,
  WarRoomWorkspace,
} from "./experienceWorkspaces";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted">
      Loading editor…
    </div>
  ),
});

const ArchitectCanvas = dynamic(
  () => import("./ArchitectCanvas").then((m) => m.ArchitectCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        Loading canvas…
      </div>
    ),
  },
);

export type WorkspaceValue = ChallengeSubmitRequest;

type ChallengeWorkspaceProps = {
  challenge: Challenge;
  value: WorkspaceValue;
  onChange: (value: WorkspaceValue) => void;
  disabled?: boolean;
};

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean);
}

function monacoLanguage(raw: string | undefined): string {
  const lang = (raw || "python").toLowerCase();
  if (lang === "py") return "python";
  if (lang === "js" || lang === "javascript") return "javascript";
  if (lang === "ts" || lang === "typescript") return "typescript";
  return lang;
}

function asVisibleTestCases(value: unknown): ChallengeVisibleTestCase[] {
  if (!Array.isArray(value)) return [];
  const cases: ChallengeVisibleTestCase[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const c = raw as Record<string, unknown>;
    if (c.is_hidden) continue;
    cases.push({
      id: (c.id as number | string) ?? cases.length,
      order: typeof c.order === "number" ? c.order : cases.length,
      is_hidden: false,
      input: String(c.input ?? ""),
      expected_output: String(c.expected_output ?? ""),
    });
  }
  return cases.sort((a, b) => a.order - b.order);
}

function TestResultsPanel({
  results,
  passedVisible,
  title,
}: {
  results: ChallengeTestResult[];
  passedVisible?: boolean;
  title: string;
}) {
  if (!results.length) return null;
  return (
    <div className="space-y-2 rounded border border-border-subtle p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="mono-label text-on-surface-variant">{title}</p>
        {passedVisible != null ? (
          <span
            className={`font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-wider ${
              passedVisible ? "text-success" : "text-error"
            }`}
          >
            {passedVisible ? "All visible passed" : "Some failed"}
          </span>
        ) : null}
      </div>
      <ul className="space-y-2">
        {results.map((r, idx) => (
          <li
            key={`${r.case_id ?? idx}`}
            className="rounded border border-outline-variant/30 bg-surface-container-lowest p-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface">
                Case {r.case_id ?? idx + 1}
              </span>
              <span
                className={`font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase ${
                  r.passed ? "text-success" : "text-error"
                }`}
              >
                {r.passed ? "Passed" : "Failed"}
              </span>
            </div>
            <div className="mt-2 space-y-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface-variant">
              {r.input != null && r.input !== "" ? (
                <p>
                  Input: <span className="text-on-surface">{r.input}</span>
                </p>
              ) : null}
              {!r.passed ? (
                <>
                  {r.expected_output != null && r.expected_output !== "" ? (
                    <p>
                      Expected:{" "}
                      <span className="text-on-surface">{r.expected_output}</span>
                    </p>
                  ) : null}
                  {r.actual_output != null && r.actual_output !== "" ? (
                    <p>
                      Actual:{" "}
                      <span className="text-on-surface">{r.actual_output}</span>
                    </p>
                  ) : null}
                  {r.stderr ? (
                    <pre className="max-h-24 overflow-auto whitespace-pre-wrap text-error">
                      {r.stderr}
                    </pre>
                  ) : null}
                </>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExamplesPanel({
  cases,
  hiddenCount,
  results,
}: {
  cases: ChallengeVisibleTestCase[];
  hiddenCount: number;
  results: ChallengeTestResult[] | null;
}) {
  if (!cases.length && hiddenCount <= 0) return null;

  const resultById = new Map(
    (results ?? []).map((r) => [String(r.case_id), r] as const),
  );

  return (
    <div className="space-y-2 rounded border border-border-subtle p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="mono-label text-on-surface-variant">Examples</p>
        {hiddenCount > 0 ? (
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface-variant">
            + {hiddenCount} hidden test{hiddenCount === 1 ? "" : "s"} on submit
          </span>
        ) : null}
      </div>
      {cases.length ? (
        <ul className="space-y-2">
          {cases.map((c, idx) => {
            const result = resultById.get(String(c.id));
            return (
              <li
                key={String(c.id)}
                className="rounded border border-outline-variant/30 bg-surface-container-lowest p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface">
                    Example {idx + 1}
                  </span>
                  {result ? (
                    <span
                      className={`font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase ${
                        result.passed ? "text-success" : "text-error"
                      }`}
                    >
                      {result.passed ? "Passed" : "Failed"}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] leading-5">
                  <div>
                    <p className="text-on-surface-variant">Input</p>
                    <pre className="mt-0.5 max-h-28 overflow-auto whitespace-pre-wrap break-all text-on-surface">
                      {c.input || "—"}
                    </pre>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Expected output</p>
                    <pre className="mt-0.5 max-h-28 overflow-auto whitespace-pre-wrap break-all text-on-surface">
                      {c.expected_output === "" ? '""' : c.expected_output}
                    </pre>
                  </div>
                  {result && !result.passed ? (
                    <div>
                      <p className="text-on-surface-variant">Your output</p>
                      <pre className="mt-0.5 max-h-28 overflow-auto whitespace-pre-wrap break-all text-error">
                        {result.stderr
                          ? result.stderr
                          : result.actual_output === ""
                            ? '""'
                            : (result.actual_output ?? "—")}
                      </pre>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="body-sm text-on-surface-variant">
          No public examples — submit to run hidden tests.
        </p>
      )}
    </div>
  );
}

function CodingWorkspace({
  challenge,
  value,
  onChange,
  disabled,
}: ChallengeWorkspaceProps) {
  const config = challenge.workspace_config ?? {};
  const language = monacoLanguage(config.language as string | undefined);
  const framework =
    typeof config.framework === "string" ? config.framework : null;
  const starter =
    typeof config.starter_code === "string" ? config.starter_code : "";
  const examples = asVisibleTestCases(config.test_cases);
  const hiddenCount =
    typeof config.hidden_test_count === "number" ? config.hidden_test_count : 0;
  const seededRef = useRef(false);
  const [runTests, { isLoading, error }] = useRunChallengeTestsMutation();
  const [preview, setPreview] = useState<ChallengeRunTestsResponse | null>(
    null,
  );

  useEffect(() => {
    if (seededRef.current) return;
    const current = (value.code ?? "").trim();
    if (!current || current === "// Write your solution") {
      if (starter) {
        onChange({ ...value, code: starter });
      }
    }
    seededRef.current = true;
    // Intentionally once per mount when challenge loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id, starter]);

  async function handleRunTests() {
    const res = await runTests({
      challengeId: challenge.id,
      code: value.code ?? "",
    }).unwrap();
    setPreview(res);
  }

  return (
    <div className="space-y-3">
      <p className="body-sm text-on-surface-variant">
        Implement <code className="text-primary">solve(input)</code>
        {framework ? (
          <>
            {" "}
            for <span className="text-on-surface">{framework}</span>
          </>
        ) : null}
        . Match the examples below, then run tests. Submit also runs{" "}
        {hiddenCount > 0 ? `${hiddenCount} hidden` : "any hidden"} case
        {hiddenCount === 1 ? "" : "s"}.
      </p>
      <ExamplesPanel
        cases={examples}
        hiddenCount={hiddenCount}
        results={preview?.test_results ?? null}
      />
      <div className="h-[min(480px,55vh)] min-w-0 overflow-hidden rounded border border-border-subtle sm:h-[min(560px,70vh)]">
        <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
          <span className="mono-label truncate text-on-surface-variant">
            {language}
            {framework ? ` · ${framework}` : ""}
          </span>
          <span className="mono-label hidden text-on-surface-variant sm:inline">
            Monaco workspace
          </span>
        </div>
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={language}
          value={value.code ?? ""}
          onChange={(code) => onChange({ ...value, code: code ?? "" })}
          options={{
            readOnly: Boolean(disabled),
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 12 },
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => void handleRunTests()}
          disabled={isLoading || disabled || !(value.code ?? "").trim()}
        >
          {isLoading ? "Running…" : "Run Tests"}
        </Button>
        {preview ? (
          <span
            className={`font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-wider ${
              preview.passed_visible ? "text-success" : "text-error"
            }`}
          >
            {preview.passed_visible
              ? "All visible passed"
              : "Some visible failed"}
          </span>
        ) : null}
        {error ? (
          <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ChallengeWorkspace({
  challenge,
  value,
  onChange,
  disabled,
}: ChallengeWorkspaceProps) {
  const modality = challenge.modality;
  const config = challenge.workspace_config ?? {};

  if (modality === "CODING") {
    return (
      <CodingWorkspace
        challenge={challenge}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (modality === "AUDIT_AI_PR") {
    return (
      <AuditAiPrWorkspace
        challenge={challenge}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (modality === "EXPLAIN_AI_DIFF") {
    return (
      <ExplainAiDiffWorkspace
        challenge={challenge}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (modality === "INHERITED_CODEBASE") {
    return (
      <InheritedCodebaseWorkspace
        challenge={challenge}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (modality === "WAR_ROOM") {
    return (
      <WarRoomWorkspace
        challenge={challenge}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (modality === "EXPLAIN_CODE") {
    const language = monacoLanguage(config.language as string | undefined);
    return (
      <div className="h-[min(480px,55vh)] min-w-0 overflow-hidden rounded border border-border-subtle sm:h-[min(560px,70vh)]">
        <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
          <span className="mono-label truncate text-on-surface-variant">
            {language}
          </span>
          <span className="mono-label hidden text-on-surface-variant sm:inline">
            Explain the code / behavior
          </span>
        </div>
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={language}
          value={value.code || value.text_answer || ""}
          onChange={(code) =>
            onChange({ ...value, code: code ?? "", text_answer: code ?? "" })
          }
          options={{
            readOnly: Boolean(disabled),
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 12 },
          }}
        />
      </div>
    );
  }

  if (modality === "ARCHITECT") {
    return (
      <div className="h-[min(480px,55vh)] min-w-0 overflow-hidden rounded border border-border-subtle sm:h-[min(560px,70vh)]">
        <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
          <span className="mono-label truncate text-on-surface-variant">
            Architecture canvas
          </span>
          <span className="mono-label hidden text-on-surface-variant sm:inline">
            React Flow
          </span>
        </div>
        <ArchitectCanvas
          value={
            Array.isArray(
              (value.architecture_data as ArchitectPayload | undefined)?.nodes,
            ) &&
            (value.architecture_data as ArchitectPayload).nodes.length > 0
              ? (value.architecture_data as ArchitectPayload)
              : emptyArch
          }
          onChange={(architecture_data) =>
            onChange({ ...value, architecture_data })
          }
        />
      </div>
    );
  }

  if (modality === "DIAGNOSE") {
    const symptoms = asStringList(
      config.symptoms ?? config.symptom_list ?? config.signals,
    );
    const logs = asStringList(config.logs ?? config.log_lines ?? config.evidence);
    const symptomsText =
      typeof config.symptoms === "string" ? config.symptoms : null;
    const logsText = typeof config.logs === "string" ? config.logs : null;

    return (
      <div className="space-y-4">
        <div className="rounded border border-border-subtle">
          <div className="border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
            <span className="mono-label text-on-surface-variant">
              Observed symptoms
            </span>
          </div>
          <div className="space-y-2 p-3 body-sm text-on-surface-variant">
            {symptomsText ? (
              <p className="whitespace-pre-wrap">{symptomsText}</p>
            ) : symptoms.length ? (
              <ul className="list-disc space-y-1 pl-5">
                {symptoms.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <p>Review the scenario for symptoms.</p>
            )}
          </div>
        </div>

        <div className="rounded border border-border-subtle">
          <div className="border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
            <span className="mono-label text-on-surface-variant">Logs</span>
          </div>
          <pre className="max-h-48 overflow-auto p-3 font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-5 text-on-surface">
            {logsText ||
              (logs.length ? logs.join("\n") : "No log excerpts provided.")}
          </pre>
        </div>

        <div className="rounded border border-border-subtle">
          <div className="border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
            <span className="mono-label text-on-surface-variant">
              Your hypothesis
            </span>
          </div>
          <div className="p-3">
            <Textarea
              className="min-h-[200px] border-0 bg-transparent focus-visible:ring-0 font-mono text-[13px]"
              placeholder="What do you think is failing, and why?"
              value={value.text_answer ?? ""}
              onChange={(e) =>
                onChange({ ...value, text_answer: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    );
  }

  if (modality === "RESEARCH") {
    const research = (value.research_data ?? {}) as {
      question?: string;
      findings?: string;
      source?: string;
      synthesis?: string;
      notes?: string;
    };

    function patchResearch(patch: Record<string, string>) {
      onChange({
        ...value,
        research_data: { ...research, ...patch },
      });
    }

    return (
      <div className="rounded border border-border-subtle">
        <div className="border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
          <span className="mono-label text-on-surface-variant">
            Research response
          </span>
        </div>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="research-question">Question</Label>
            <Input
              id="research-question"
              value={research.question ?? ""}
              onChange={(e) => patchResearch({ question: e.target.value })}
              placeholder="What are you investigating?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="research-findings">Findings</Label>
            <Textarea
              id="research-findings"
              className="min-h-[120px] font-mono text-[13px]"
              value={research.findings ?? ""}
              onChange={(e) => patchResearch({ findings: e.target.value })}
              placeholder="Key findings from your research…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="research-source">Source</Label>
            <Input
              id="research-source"
              value={research.source ?? ""}
              onChange={(e) => patchResearch({ source: e.target.value })}
              placeholder="Docs, paper, or URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="research-synthesis">Synthesis</Label>
            <Textarea
              id="research-synthesis"
              className="min-h-[120px] font-mono text-[13px]"
              value={research.synthesis ?? ""}
              onChange={(e) => patchResearch({ synthesis: e.target.value })}
              placeholder="How do these findings answer the challenge?"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-border-subtle">
      <div className="border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
        <span className="mono-label text-on-surface-variant">
          {String(modality).replaceAll("_", " ")} response
        </span>
      </div>
      <div className="p-3">
        <Textarea
          className="min-h-[320px] border-0 bg-transparent focus-visible:ring-0 font-mono text-[13px]"
          placeholder="Write your response…"
          value={value.text_answer ?? ""}
          onChange={(e) => {
            onChange({ ...value, text_answer: e.target.value });
          }}
        />
      </div>
    </div>
  );
}

type ArchitectPayload = {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
    data: { label: string };
    type?: string;
  }>;
  edges: Array<{ id: string; source: string; target: string }>;
};

const emptyArch: ArchitectPayload = {
  nodes: [
    {
      id: "1",
      type: "default",
      position: { x: 80, y: 120 },
      data: { label: "Client" },
    },
    {
      id: "2",
      type: "default",
      position: { x: 320, y: 120 },
      data: { label: "API" },
    },
    {
      id: "3",
      type: "default",
      position: { x: 560, y: 120 },
      data: { label: "Data" },
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
  ],
};

export { TestResultsPanel };
