import type { FormDefinition, GraphEdge, GraphNode } from "../types/api";

export interface DataSourceField {
  key: string;
  label: string;
}

export interface DataSourceGroup {
  groupId: string;
  groupLabel: string;
  fields: DataSourceField[];
}

// Passed to every data source so it can walk the DAG if needed
export interface DataSourceContext {
  nodeId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
}

/*
  Implement this interface and call registerDataSource() to add a new prefill source.
  No other changes required — the modal picks it up automatically.
*/
export interface DataSource {
  id: string;
  label: string;
  getGroups(context: DataSourceContext): DataSourceGroup[];
}
