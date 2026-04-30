import { describe, it, expect } from "vitest";
import { directParentsOf, ancestorsOf } from "../../lib/dag";
import type { GraphEdge } from "../../types/api";

// A → B → D → F
// A → C → E → F
const edges: GraphEdge[] = [
  { source: "A", target: "B" },
  { source: "A", target: "C" },
  { source: "B", target: "D" },
  { source: "C", target: "E" },
  { source: "D", target: "F" },
  { source: "E", target: "F" },
];

describe("directParentsOf", () => {
  it("returns both direct parents of a node with two parents", () => {
    expect(directParentsOf("F", edges)).toEqual(expect.arrayContaining(["D", "E"]));
    expect(directParentsOf("F", edges)).toHaveLength(2);
  });

  it("returns a single parent", () => {
    expect(directParentsOf("B", edges)).toEqual(["A"]);
  });

  it("returns empty for a root node", () => {
    expect(directParentsOf("A", edges)).toEqual([]);
  });

  it("returns empty for an unknown node", () => {
    expect(directParentsOf("Z", edges)).toEqual([]);
  });
});

describe("ancestorsOf", () => {
  it("returns all ancestors of a leaf node", () => {
    const result = ancestorsOf("F", edges);
    expect(result).toEqual(expect.arrayContaining(["A", "B", "C", "D", "E"]));
    expect(result).toHaveLength(5);
  });

  it("does not include the node itself", () => {
    expect(ancestorsOf("F", edges)).not.toContain("F");
  });

  it("BFS ordering — direct parents appear before transitive ones", () => {
    const result = ancestorsOf("F", edges);
    const indexD = result.indexOf("D");
    const indexE = result.indexOf("E");
    const indexA = result.indexOf("A");
    expect(Math.max(indexD, indexE)).toBeLessThan(indexA);
  });

  it("returns only the direct parent for a one-level node", () => {
    expect(ancestorsOf("B", edges)).toEqual(["A"]);
  });

  it("returns empty for a root node", () => {
    expect(ancestorsOf("A", edges)).toEqual([]);
  });

  it("handles an empty edge list", () => {
    expect(ancestorsOf("X", [])).toEqual([]);
  });

  it("deduplicates shared ancestors in a diamond graph", () => {
    const diamond: GraphEdge[] = [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "D" },
      { source: "C", target: "D" },
    ];
    const result = ancestorsOf("D", diamond);
    expect(result).toEqual(expect.arrayContaining(["A", "B", "C"]));
    expect(result).toHaveLength(3);
  });
});
