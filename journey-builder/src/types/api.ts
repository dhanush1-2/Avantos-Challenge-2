export interface FieldProperty {
  avantos_type: string;
  title?: string;
  type: string;
  format?: string;
  items?: unknown;
  enum?: unknown;
  uniqueItems?: boolean;
}

export interface FieldSchema {
  type: "object";
  properties: Record<string, FieldProperty>;
  required?: string[];
}

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: FieldSchema;
  ui_schema?: unknown;
  dynamic_field_config: Record<string, unknown>;
}

export interface NodeData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: Record<string, unknown>;
  sla_duration: { number: number; unit: string };
  approval_required: boolean;
  approval_roles: string[];
}

export interface GraphNode {
  id: string;
  type: "form" | "branch" | "trigger" | string;
  position: { x: number; y: number };
  data: NodeData;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface BlueprintGraph {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
  branches: unknown[];
  triggers: unknown[];
}
