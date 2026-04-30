import { useState } from "react";
import type { PrefillMapping, PrefillValue } from "../types/prefill";

export function usePrefillMapping(initial?: PrefillMapping) {
  const [mapping, setMapping] = useState<PrefillMapping>(initial ?? {});

  function mapField(fieldKey: string, value: PrefillValue) {
    setMapping((prev) => ({ ...prev, [fieldKey]: value }));
  }

  function clearField(fieldKey: string) {
    setMapping((prev) => ({ ...prev, [fieldKey]: null }));
  }

  function reset() {
    setMapping({});
  }

  return { mapping, mapField, clearField, reset };
}
