export type FlowNode = {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
};

export type FlowData = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export type Screen = 'query' | 'editor' | 'catalog';
