import { useState } from "react";
import type { FormDefinition, GraphEdge, GraphNode } from "../../types/api";
import type { PrefillMapping, PrefillValue } from "../../types/prefill";
import type { DataSource } from "../../datasources/types";
import { DataElementModal, type DataElementSelection } from "../DataElementModal";
import styles from "./PrefillPanel.module.css";

interface Props {
  node: GraphNode;
  form: FormDefinition;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
  sources: DataSource[];
  mapping: PrefillMapping;
  onMap: (fieldKey: string, value: PrefillValue) => void;
  onClear: (fieldKey: string) => void;
}

export function PrefillPanel({ node, form, nodes, edges, forms, sources, mapping, onMap, onClear }: Props) {
  const [enabled, setEnabled] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

  const fields = Object.keys(form.field_schema.properties);
  const context = { nodeId: node.id, nodes, edges, forms };

  function applyMapping(fieldKey: string, selection: DataElementSelection) {
    const group = sources
      .find((s) => s.id === selection.sourceId)
      ?.getGroups(context)
      .find((g) => g.groupId === selection.groupId);

    onMap(fieldKey, {
      sourceId: selection.sourceId,
      groupId: selection.groupId,
      fieldKey: selection.field.key,
      label: `${group?.groupLabel ?? selection.groupId}.${selection.field.key}`,
    });
    setEditing(null);
  }

  return (
    <section className={styles.panel} aria-label={`Prefill settings for ${node.data.name}`}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Prefill</h2>
          <p className={styles.subtitle}>Prefill fields for this form</p>
        </div>
        <button
          role="switch"
          aria-checked={enabled}
          className={`${styles.toggle} ${enabled ? styles.toggleOn : ""}`}
          onClick={() => setEnabled((v) => !v)}
          aria-label="Toggle prefill"
        >
          <span className={styles.toggleThumb} />
        </button>
      </div>

      {enabled && (
        <ul className={styles.fieldList} role="list">
          {fields.map((key) => {
            const value = mapping[key] ?? null;

            return (
              <li key={key}>
                {value ? (
                  <div className={styles.mappedRow}>
                    <span className={styles.mappedIcon} aria-hidden="true">⊟</span>
                    <span className={styles.mappedLabel}>
                      {key}: <strong>{value.label}</strong>
                    </span>
                    <button
                      className={styles.clearBtn}
                      onClick={() => onClear(key)}
                      aria-label={`Clear prefill for ${key}`}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    className={`${styles.emptyRow} ${editing === key ? styles.emptyRowActive : ""}`}
                    onClick={() => setEditing(key)}
                    aria-label={`Configure prefill for ${key}`}
                  >
                    <span className={styles.emptyIcon} aria-hidden="true">⊟</span>
                    <span className={styles.fieldKey}>{key}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <DataElementModal
          sources={sources}
          context={context}
          onSelect={(sel) => applyMapping(editing, sel)}
          onCancel={() => setEditing(null)}
        />
      )}
    </section>
  );
}
