"use client";

import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Challenge, ChallengeSubmitRequest } from "@/types/api";

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
};

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean);
}

export function ChallengeWorkspace({
  challenge,
  value,
  onChange,
}: ChallengeWorkspaceProps) {
  const modality = challenge.modality;
  const config = challenge.workspace_config ?? {};

  if (modality === "CODING" || modality === "EXPLAIN_CODE") {
    const language =
      (config.language as string | undefined) || "typescript";
    return (
      <div className="h-[min(560px,70vh)] overflow-hidden rounded border border-border-subtle">
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
          <span className="mono-label text-on-surface-variant">{language}</span>
          <span className="mono-label text-on-surface-variant">Monaco workspace</span>
        </div>
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={language}
          value={value.code ?? ""}
          onChange={(code) => onChange({ ...value, code: code ?? "" })}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
          }}
        />
      </div>
    );
  }

  if (modality === "ARCHITECT") {
    return (
      <div className="h-[min(560px,70vh)] overflow-hidden rounded border border-border-subtle">
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-container-lowest px-3 py-2">
          <span className="mono-label text-on-surface-variant">Architecture canvas</span>
          <span className="mono-label text-on-surface-variant">React Flow</span>
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
          {modality.replaceAll("_", " ")} response
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
