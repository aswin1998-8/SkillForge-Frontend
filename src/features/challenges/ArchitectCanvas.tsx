"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type ArchitectPayload = {
  nodes: Node[];
  edges: Edge[];
};

type ArchitectCanvasProps = {
  value: ArchitectPayload;
  onChange: (value: ArchitectPayload) => void;
};

export function ArchitectCanvas({ value, onChange }: ArchitectCanvasProps) {
  const nodes = useMemo(() => value.nodes ?? [], [value.nodes]);
  const edges = useMemo(() => value.edges ?? [], [value.edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onChange({
        nodes: applyNodeChanges(changes, nodes),
        edges,
      });
    },
    [edges, nodes, onChange],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onChange({
        nodes,
        edges: applyEdgeChanges(changes, edges),
      });
    },
    [edges, nodes, onChange],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      onChange({
        nodes,
        edges: addEdge(connection, edges),
      });
    },
    [edges, nodes, onChange],
  );

  return (
    <div className="h-full w-full bg-surface-container-lowest">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        colorMode="dark"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1}
          color="#1F2430"
        />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(11,13,16,0.7)"
          style={{ background: "#12151C" }}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}
