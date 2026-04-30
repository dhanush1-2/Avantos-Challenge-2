import { describe, it, expect } from "vitest";

describe("getDataSources / registerDataSource", () => {
  it("includes the built-in form and global sources by default", async () => {
    const { getDataSources } = await import("../../datasources/registry");
    const ids = getDataSources().map((s) => s.id);
    expect(ids).toContain("form");
    expect(ids).toContain("global");
  });

  it("includes a newly registered source", async () => {
    const { getDataSources, registerDataSource } = await import("../../datasources/registry");
    registerDataSource({ id: "crm-test-unique", label: "CRM", getGroups: () => [] });
    expect(getDataSources().map((s) => s.id)).toContain("crm-test-unique");
  });

  it("throws when registering a duplicate id", async () => {
    const { registerDataSource } = await import("../../datasources/registry");
    expect(() =>
      registerDataSource({ id: "form", label: "Duplicate", getGroups: () => [] })
    ).toThrow(/already registered/i);
  });

  it("getDataSources returns a copy — mutations don't affect the registry", async () => {
    const { getDataSources } = await import("../../datasources/registry");
    const first = getDataSources();
    first.push({ id: "mutated", label: "Mutated", getGroups: () => [] });
    expect(getDataSources().map((s) => s.id)).not.toContain("mutated");
  });
});
