/** A resolved mapping for a single form field. */
export interface PrefillValue {
  /** ID of the data source that produced this value (e.g. "form", "global"). */
  sourceId: string;
  /** ID of the group within the source (e.g. node ID for form source, group key for global). */
  groupId: string;
  /** Key of the selected field within the group. */
  fieldKey: string;
  /** Human-readable label shown in the prefill row. */
  label: string;
}

/**
 * Maps each form field key to its prefill value, or null when unprefilled.
 * Only fields that have been explicitly configured appear; all others are null.
 */
export type PrefillMapping = Record<string, PrefillValue | null>;
