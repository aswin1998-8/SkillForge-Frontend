"use client";

import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
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

export function ChallengeWorkspace({
  challenge,
  value,
  onChange,
}: ChallengeWorkspaceProps) {
  const modality = challenge.modality;

  if (modality === "CODING" || modality === "EXPLAIN_CODE") {
    const language =
      (challenge.workspace_config?.language as string | undefined) ||
      "typescript";
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

  const field =
    modality === "RESEARCH"
      ? "research"
      : "text";

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
          value={
            field === "research"
              ? String(
                  (value.research_data as { notes?: string } | undefined)
                    ?.notes ?? "",
                )
              : value.text_answer ?? ""
          }
          onChange={(e) => {
            if (field === "research") {
              onChange({
                ...value,
                research_data: { ...(value.research_data ?? {}), notes: e.target.value },
              });
            } else {
              onChange({ ...value, text_answer: e.target.value });
            }
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
