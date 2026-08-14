"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/errors";
import type { Challenge, ChallengeSubmitRequest } from "@/types/api";
import {
  useAdvanceWarRoomBeatMutation,
  useGetWarRoomStateQuery,
  useRunChallengeTestsMutation,
} from "@/services/api/challengeApi";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[240px] items-center justify-center text-sm text-muted">
      Loading editor…
    </div>
  ),
});

type WorkspaceValue = ChallengeSubmitRequest;

function monacoLanguage(raw: string | undefined): string {
  const lang = (raw || "python").toLowerCase();
  if (lang === "py") return "python";
  if (lang === "js" || lang === "javascript") return "javascript";
  if (lang === "ts" || lang === "typescript") return "typescript";
  return lang;
}

function asFiles(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    if (Array.isArray(value)) {
      const out: Record<string, string> = {};
      for (const item of value) {
        if (!item || typeof item !== "object") continue;
        const rec = item as Record<string, unknown>;
        const path = String(rec.path || rec.name || "");
        if (path) out[path] = String(rec.content ?? "");
      }
      return out;
    }
    return {};
  }
  const out: Record<string, string> = {};
  for (const [path, content] of Object.entries(value as Record<string, unknown>)) {
    out[path] = String(content ?? "");
  }
  return out;
}

function ReadOnlyBlock({
  title,
  body,
  language,
}: {
  title: string;
  body: string;
  language?: string;
}) {
  return (
    <div className="overflow-hidden rounded border border-border-subtle">
      <div className="border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
        <span className="mono-label text-on-surface-variant">{title}</span>
      </div>
      <pre className="max-h-72 overflow-auto p-3 font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-5 text-on-surface">
        {body || "—"}
      </pre>
      {language ? (
        <span className="sr-only">{language}</span>
      ) : null}
    </div>
  );
}

type Finding = {
  file: string;
  start_line: number;
  end_line: number;
  category: string;
  severity: string;
  note: string;
};

const CATEGORIES = ["bug", "edge_case", "style", "security"];
const SEVERITIES = ["low", "medium", "high", "critical"];

export function AuditAiPrWorkspace({
  challenge,
  value,
  onChange,
  disabled,
}: {
  challenge: Challenge;
  value: WorkspaceValue;
  onChange: (value: WorkspaceValue) => void;
  disabled?: boolean;
}) {
  const config = challenge.workspace_config ?? {};
  const pr = (config.pr ?? {}) as Record<string, unknown>;
  const files = asFiles(config.files);
  const issueCount = Number(config.issue_count ?? 0);
  const findings = (Array.isArray(value.metadata?.findings)
    ? value.metadata?.findings
    : []) as Finding[];

  function setFindings(next: Finding[]) {
    onChange({
      ...value,
      metadata: { ...(value.metadata || {}), findings: next },
    });
  }

  return (
    <div className="space-y-4">
      <ReadOnlyBlock
        title={String(pr.title || "AI-generated PR")}
        body={String(pr.description || "")}
      />
      <ReadOnlyBlock title="Diff" body={String(pr.diff || "")} language="diff" />
      {Object.entries(files).map(([path, content]) => (
        <ReadOnlyBlock key={path} title={path} body={content} />
      ))}
      <p className="body-sm text-on-surface-variant">
        There {issueCount === 1 ? "is" : "are"} {issueCount || "several"} planted
        issue{issueCount === 1 ? "" : "s"}. Locate and categorize each one.
      </p>
      <div className="space-y-3">
        {findings.map((finding, idx) => (
          <div
            key={idx}
            className="grid gap-2 rounded border border-border-subtle p-3 sm:grid-cols-2"
          >
            <Input
              placeholder="file"
              value={finding.file}
              disabled={disabled}
              onChange={(e) => {
                const next = [...findings];
                next[idx] = { ...finding, file: e.target.value };
                setFindings(next);
              }}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="start"
                value={finding.start_line || ""}
                disabled={disabled}
                onChange={(e) => {
                  const next = [...findings];
                  next[idx] = {
                    ...finding,
                    start_line: Number(e.target.value) || 0,
                  };
                  setFindings(next);
                }}
              />
              <Input
                type="number"
                placeholder="end"
                value={finding.end_line || ""}
                disabled={disabled}
                onChange={(e) => {
                  const next = [...findings];
                  next[idx] = {
                    ...finding,
                    end_line: Number(e.target.value) || 0,
                  };
                  setFindings(next);
                }}
              />
            </div>
            <select
              className="rounded border border-border-subtle bg-transparent px-2 py-2 text-sm"
              value={finding.category}
              disabled={disabled}
              onChange={(e) => {
                const next = [...findings];
                next[idx] = { ...finding, category: e.target.value };
                setFindings(next);
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="rounded border border-border-subtle bg-transparent px-2 py-2 text-sm"
              value={finding.severity}
              disabled={disabled}
              onChange={(e) => {
                const next = [...findings];
                next[idx] = { ...finding, severity: e.target.value };
                setFindings(next);
              }}
            >
              {SEVERITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Textarea
              className="sm:col-span-2 min-h-[72px]"
              placeholder="What is wrong?"
              value={finding.note}
              disabled={disabled}
              onChange={(e) => {
                const next = [...findings];
                next[idx] = { ...finding, note: e.target.value };
                setFindings(next);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={disabled}
              onClick={() => setFindings(findings.filter((_, i) => i !== idx))}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={() =>
            setFindings([
              ...findings,
              {
                file: Object.keys(files)[0] || "checkout.py",
                start_line: 1,
                end_line: 1,
                category: "bug",
                severity: "high",
                note: "",
              },
            ])
          }
        >
          Add finding
        </Button>
      </div>
    </div>
  );
}

export function ExplainAiDiffWorkspace({
  challenge,
  value,
  onChange,
  disabled,
}: {
  challenge: Challenge;
  value: WorkspaceValue;
  onChange: (value: WorkspaceValue) => void;
  disabled?: boolean;
}) {
  const config = challenge.workspace_config ?? {};
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <ReadOnlyBlock title="Before" body={String(config.before || "")} />
        <ReadOnlyBlock title="After" body={String(config.after || config.diff || "")} />
      </div>
      <Textarea
        className="min-h-[200px] font-mono text-[13px]"
        placeholder="What changed, why it works, and what still doesn't?"
        value={value.text_answer ?? ""}
        disabled={disabled}
        onChange={(e) => onChange({ ...value, text_answer: e.target.value })}
      />
    </div>
  );
}

export function InheritedCodebaseWorkspace({
  challenge,
  value,
  onChange,
  disabled,
}: {
  challenge: Challenge;
  value: WorkspaceValue;
  onChange: (value: WorkspaceValue) => void;
  disabled?: boolean;
}) {
  const config = challenge.workspace_config ?? {};
  const starter = useMemo(() => asFiles(config.files), [config.files]);
  const files = asFiles(value.metadata?.files) ;
  const paths = Object.keys(files).length ? Object.keys(files) : Object.keys(starter);
  const [active, setActive] = useState(paths[0] || "");
  const [runTests, { isLoading, error }] = useRunChallengeTestsMutation();
  const [preview, setPreview] = useState<{
    passed_visible?: boolean;
    test_results?: Array<Record<string, unknown>>;
  } | null>(null);

  useEffect(() => {
    if (!Object.keys(asFiles(value.metadata?.files)).length && Object.keys(starter).length) {
      onChange({
        ...value,
        metadata: { ...(value.metadata || {}), files: starter },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id]);

  const currentFiles = Object.keys(asFiles(value.metadata?.files)).length
    ? asFiles(value.metadata?.files)
    : starter;

  function patchFile(path: string, content: string) {
    onChange({
      ...value,
      metadata: {
        ...(value.metadata || {}),
        files: { ...currentFiles, [path]: content },
      },
    });
  }

  async function handleRun() {
    const result = await runTests({
      challengeId: challenge.id,
      code: "",
      files: currentFiles,
    }).unwrap();
    setPreview(result);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.keys(currentFiles).map((path) => (
          <button
            key={path}
            type="button"
            className={`rounded px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] ${
              path === active
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
            onClick={() => setActive(path)}
          >
            {path}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded border border-border-subtle">
        <MonacoEditor
          height={320}
          theme="vs-dark"
          language={monacoLanguage(config.language as string | undefined)}
          value={currentFiles[active] || ""}
          onChange={(code) => patchFile(active, code ?? "")}
          options={{
            readOnly: Boolean(disabled),
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
      <Button
        type="button"
        variant="secondary"
        disabled={isLoading || disabled}
        onClick={() => void handleRun()}
      >
        {isLoading ? "Running…" : "Run visible tests"}
      </Button>
      {error ? (
        <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
      ) : null}
      {preview?.test_results?.length ? (
        <pre className="max-h-40 overflow-auto rounded border border-border-subtle p-3 text-xs">
          {JSON.stringify(preview.test_results, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

type Beat = {
  id: string;
  type?: string;
  title?: string;
  content?: string;
  prompt?: string;
  locked?: boolean;
};

export function WarRoomWorkspace({
  challenge,
  value,
  onChange,
  disabled,
}: {
  challenge: Challenge;
  value: WorkspaceValue;
  onChange: (value: WorkspaceValue) => void;
  disabled?: boolean;
}) {
  const { data } = useGetWarRoomStateQuery(challenge.id);
  const [advance, { isLoading, error }] = useAdvanceWarRoomBeatMutation();
  const [draft, setDraft] = useState("");
  const beats: Beat[] = (data?.beats as Beat[]) ||
    (((challenge.workspace_config ?? {}).beats as Beat[]) || []).map((b, idx) => ({
      ...b,
      locked: idx > 0,
    }));
  const currentIndex = Number(data?.current_index ?? 0);
  const current = beats[currentIndex];
  const answers = {
    ...(((value.metadata?.war_room as Record<string, unknown> | undefined)?.answers ||
      {}) as Record<string, string>),
    ...((data?.answers as Record<string, string>) || {}),
  };

  useEffect(() => {
    if (!data) return;
    onChange({
      ...value,
      metadata: {
        ...(value.metadata || {}),
        war_room: {
          current_index: data.current_index,
          complete: data.complete,
          answers: data.answers || {},
        },
      },
      text_answer: Object.values(data.answers || {}).join("\n\n"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.current_index, data?.complete]);

  async function handleContinue() {
    if (!current?.id || !draft.trim()) return;
    const next = await advance({
      challengeId: challenge.id,
      beat_id: current.id,
      text: draft,
    }).unwrap();
    setDraft("");
    onChange({
      ...value,
      metadata: {
        ...(value.metadata || {}),
        war_room: {
          current_index: next.current_index,
          complete: next.complete,
          answers: next.answers || {},
        },
      },
      text_answer: Object.values(next.answers || {}).join("\n\n"),
    });
  }

  return (
    <div className="space-y-4">
      {beats.map((beat, idx) => {
        if (beat.locked) {
          return (
            <div
              key={beat.id}
              className="rounded border border-dashed border-outline-variant/40 px-3 py-2 text-sm text-on-surface-variant"
            >
              Locked: {beat.title || beat.id}
            </div>
          );
        }
        return (
          <div key={beat.id} className="space-y-2 rounded border border-border-subtle">
            <div className="border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
              <span className="mono-label text-on-surface-variant">
                {beat.title || beat.type || beat.id}
              </span>
            </div>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap p-3 font-[family-name:var(--font-jetbrains-mono)] text-[12px]">
              {beat.content || ""}
            </pre>
            {answers[beat.id] ? (
              <p className="px-3 pb-3 body-sm text-on-surface-variant">
                Your reply: {answers[beat.id]}
              </p>
            ) : null}
            {idx === currentIndex && !data?.complete ? (
              <div className="space-y-2 p-3">
                <Label>{beat.prompt || "Your response"}</Label>
                <Textarea
                  className="min-h-[140px]"
                  value={draft}
                  disabled={disabled}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <Button
                  type="button"
                  disabled={disabled || isLoading || !draft.trim()}
                  onClick={() => void handleContinue()}
                >
                  {isLoading ? "Saving…" : "Continue"}
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
      {data?.complete ? (
        <p className="body-sm text-success">
          Incident timeline complete. Submit for grading.
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
      ) : null}
    </div>
  );
}
