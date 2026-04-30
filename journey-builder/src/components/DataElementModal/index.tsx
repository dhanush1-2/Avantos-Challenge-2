import { useState } from "react";
import type { DataSourceGroup, DataSourceField, DataSource } from "../../datasources/types";
import styles from "./DataElementModal.module.css";

interface Selection {
  sourceId: string;
  groupId: string;
  field: DataSourceField;
}

interface Props {
  sources: DataSource[];
  context: Parameters<DataSource["getGroups"]>[0];
  onSelect: (selection: Selection) => void;
  onCancel: () => void;
}

export function DataElementModal({ sources, context, onSelect, onCancel }: Props) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [picked, setPicked] = useState<Selection | null>(null);

  const query = search.toLowerCase();

  function toggleGroup(key: string) {
    const wasOpen = expanded.has(key);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (wasOpen) { next.delete(key); } else { next.add(key); }
      return next;
    });
    setActiveGroup(wasOpen ? null : key);
  }

  function matches(group: DataSourceGroup, field: DataSourceField): boolean {
    if (!query) return true;
    return (
      group.groupLabel.toLowerCase().includes(query) ||
      field.label.toLowerCase().includes(query) ||
      field.key.toLowerCase().includes(query)
    );
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Select data element to map">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Select data element to map</h2>
        </div>

        <div className={styles.body}>
          <div className={styles.panel}>
            <p className={styles.panelLabel}>Available data</p>

            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon} aria-hidden="true">⌕</span>
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search data elements"
              />
            </div>

            <ul className={styles.groupList} role="tree">
              {sources.map((source) =>
                source.getGroups(context).map((group) => {
                  const key = `${source.id}:${group.groupId}`;
                  const filtered = group.fields.filter((f) => matches(group, f));
                  if (filtered.length === 0 && query) return null;

                  const open = expanded.has(key);
                  const active = activeGroup === key;

                  return (
                    <li key={key} role="treeitem" aria-expanded={open}>
                      <button
                        className={`${styles.groupButton} ${active ? styles.groupButtonActive : ""}`}
                        onClick={() => toggleGroup(key)}
                        aria-expanded={open}
                      >
                        <span className={styles.caret}>{open ? "∨" : "›"}</span>
                        {group.groupLabel}
                      </button>

                      {open && (
                        <ul className={styles.fieldList} role="group">
                          {filtered.map((field) => {
                            const selected =
                              picked?.sourceId === source.id &&
                              picked.groupId === group.groupId &&
                              picked.field.key === field.key;

                            return (
                              <li key={field.key}>
                                <button
                                  className={`${styles.fieldButton} ${selected ? styles.fieldSelected : ""}`}
                                  onClick={() => setPicked({ sourceId: source.id, groupId: group.groupId, field })}
                                >
                                  {field.key}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div className={styles.preview}>
            {picked && (
              <div className={styles.previewContent}>
                <p className={styles.previewLabel}>Selected</p>
                <p className={styles.previewValue}>
                  {picked.field.label !== picked.field.key
                    ? `${picked.field.label} (${picked.field.key})`
                    : picked.field.key}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>CANCEL</button>
          <button
            className={styles.selectBtn}
            disabled={!picked}
            onClick={() => picked && onSelect(picked)}
          >
            SELECT
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Selection as DataElementSelection };
