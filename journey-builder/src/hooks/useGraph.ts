import { useEffect, useState } from "react";
import { fetchBlueprintGraph } from "../api/graph";
import type { BlueprintGraph } from "../types/api";

export function useGraph(tenantId: string, blueprintId: string) {
  const [graph, setGraph] = useState<BlueprintGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;

    fetchBlueprintGraph(tenantId, blueprintId)
      .then((data) => {
        if (!stale) {
          setGraph(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!stale) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });

    return () => { stale = true; };
  }, [tenantId, blueprintId]);

  return { graph, loading, error };
}
