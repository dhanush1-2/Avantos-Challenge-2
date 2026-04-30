import type { BlueprintGraph } from "../types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function fetchBlueprintGraph(
  tenantId: string,
  blueprintId: string
): Promise<BlueprintGraph> {
  const url = `${BASE_URL}/api/v1/${tenantId}/actions/blueprints/${blueprintId}/graph`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch graph: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<BlueprintGraph>;
}
