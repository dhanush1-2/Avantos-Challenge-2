import type { GraphEdge } from "../types/api";

export function directParentsOf(nodeId: string, edges: GraphEdge[]): string[] {
  return edges.filter((e) => e.target === nodeId).map((e) => e.source);
}

// BFS — direct parents come before transitive ones
export function ancestorsOf(nodeId: string, edges: GraphEdge[]): string[] {
  const seen = new Set<string>();
  const queue: string[] = directParentsOf(nodeId, edges);

  for (const id of queue) {
    if (!seen.has(id)) {
      seen.add(id);
      for (const parent of directParentsOf(id, edges)) {
        if (!seen.has(parent)) queue.push(parent);
      }
    }
  }

  return Array.from(seen);
}
