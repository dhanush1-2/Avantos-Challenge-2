import type { GraphNode } from "../../types/api";
import styles from "./FormList.module.css";

interface Props {
  nodes: GraphNode[];
  selectedNodeId: string | null;
  onSelect: (nodeId: string) => void;
}

export function FormList({ nodes, selectedNodeId, onSelect }: Props) {
  const forms = nodes.filter((n) => n.type === "form");

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.heading}>Forms</h2>
      <ul className={styles.list} role="list">
        {forms.map((node) => (
          <li key={node.id}>
            <button
              className={`${styles.item} ${node.id === selectedNodeId ? styles.selected : ""}`}
              onClick={() => onSelect(node.id)}
              aria-pressed={node.id === selectedNodeId}
            >
              <span className={styles.icon} aria-hidden="true">⊟</span>
              <span className={styles.name}>{node.data.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
