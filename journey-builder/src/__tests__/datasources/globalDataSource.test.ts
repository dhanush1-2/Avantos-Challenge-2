import { describe, it, expect } from "vitest";
import { globalDataSource } from "../../datasources/globalDataSource";
import type { DataSourceContext } from "../../datasources/types";

const ctx: DataSourceContext = { nodeId: "any", nodes: [], edges: [], forms: [] };

describe("globalDataSource", () => {
  it("has id 'global' and a label", () => {
    expect(globalDataSource.id).toBe("global");
    expect(globalDataSource.label).toBeTruthy();
  });

  it("always returns groups regardless of DAG context", () => {
    expect(globalDataSource.getGroups(ctx).length).toBeGreaterThan(0);
  });

  it("includes an Action Properties group with fields", () => {
    const group = globalDataSource.getGroups(ctx).find((g) => g.groupId === "action_properties");
    expect(group).toBeDefined();
    expect(group!.fields.length).toBeGreaterThan(0);
  });

  it("includes a Client Organisation Properties group with fields", () => {
    const group = globalDataSource.getGroups(ctx).find((g) => g.groupId === "client_org");
    expect(group).toBeDefined();
    expect(group!.fields.length).toBeGreaterThan(0);
  });

  it("returns the same groups regardless of which node is active", () => {
    const a = globalDataSource.getGroups({ ...ctx, nodeId: "node-1" });
    const b = globalDataSource.getGroups({ ...ctx, nodeId: "node-2" });
    expect(a).toEqual(b);
  });
});
