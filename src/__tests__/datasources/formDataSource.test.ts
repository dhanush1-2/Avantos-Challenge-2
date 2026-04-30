import { describe, it, expect } from "vitest";
import { formDataSource } from "../../datasources/formDataSource";
import type { DataSourceContext } from "../../datasources/types";
import type { FormDefinition, GraphEdge, GraphNode } from "../../types/api";

function makeNode(id: string, componentId: string): GraphNode {
  return {
    id,
    type: "form",
    position: { x: 0, y: 0 },
    data: {
      id: `bp_${id}`,
      component_key: id,
      component_type: "form",
      component_id: componentId,
      name: `Form ${id}`,
      prerequisites: [],
      permitted_roles: [],
      input_mapping: {},
      sla_duration: { number: 0, unit: "minutes" },
      approval_required: false,
      approval_roles: [],
    },
  };
}

function makeForm(id: string, fieldKeys: string[]): FormDefinition {
  return {
    id,
    name: id,
    description: "",
    is_reusable: false,
    dynamic_field_config: {},
    field_schema: {
      type: "object",
      properties: Object.fromEntries(
        fieldKeys.map((k) => [k, { avantos_type: "short-text", type: "string", title: k.toUpperCase() }])
      ),
    },
  };
}

// Chain: A → B → C
const nodeA = makeNode("A", "form-alpha");
const nodeB = makeNode("B", "form-beta");
const nodeC = makeNode("C", "form-alpha");

const formAlpha = makeForm("form-alpha", ["email", "name"]);
const formBeta = makeForm("form-beta", ["status"]);

const edges: GraphEdge[] = [
  { source: "A", target: "B" },
  { source: "B", target: "C" },
];

const ctx: DataSourceContext = {
  nodeId: "C",
  nodes: [nodeA, nodeB, nodeC],
  edges,
  forms: [formAlpha, formBeta],
};

describe("formDataSource", () => {
  it("has id 'form' and a label", () => {
    expect(formDataSource.id).toBe("form");
    expect(formDataSource.label).toBeTruthy();
  });

  it("returns one group per ancestor node", () => {
    const ids = formDataSource.getGroups(ctx).map((g) => g.groupId);
    expect(ids).toContain("A");
    expect(ids).toContain("B");
  });

  it("does not include the node being configured", () => {
    expect(formDataSource.getGroups(ctx).map((g) => g.groupId)).not.toContain("C");
  });

  it("orders groups upstream-first (A before B when configuring C)", () => {
    const ids = formDataSource.getGroups(ctx).map((g) => g.groupId);
    expect(ids.indexOf("A")).toBeLessThan(ids.indexOf("B"));
  });

  it("prepends completed_at before schema fields", () => {
    const groupB = formDataSource.getGroups(ctx).find((g) => g.groupId === "B");
    expect(groupB?.fields[0].key).toBe("completed_at");
  });

  it("includes all schema fields after completed_at", () => {
    const groupB = formDataSource.getGroups(ctx).find((g) => g.groupId === "B");
    const keys = groupB?.fields.map((f) => f.key);
    expect(keys).toEqual(["completed_at", "status"]);
  });

  it("uses schema title as label when available", () => {
    const groupA = formDataSource.getGroups(ctx).find((g) => g.groupId === "A");
    expect(groupA?.fields.find((f) => f.key === "email")?.label).toBe("EMAIL");
  });

  it("returns empty for a root node with no ancestors", () => {
    expect(formDataSource.getGroups({ ...ctx, nodeId: "A" })).toEqual([]);
  });
});
