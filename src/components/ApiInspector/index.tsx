import { useState } from "react";
import type { BlueprintGraph, GraphNode, FormDefinition } from "../../types/api";
import styles from "./ApiInspector.module.css";

interface Props {
  graph: BlueprintGraph;
  activeNode: GraphNode | null;
  activeForm: FormDefinition | null;
  endpoint: string;
}

export function ApiInspector({ graph, activeNode, activeForm, endpoint }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"node" | "form" | "full">("node");

  const payload =
    tab === "node"  ? activeNode  ?? "No form selected"
    : tab === "form"  ? activeForm  ?? "No form selected"
    : graph;

  return (
    <div className={styles.wrapper}>
      <button className={styles.toggle} onClick={() => setOpen((v) => !v)}>
        <span className={styles.label}>API Response</span>
        <span className={styles.endpoint}>{endpoint}</span>
        <span className={styles.caret}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === "node" ? styles.tabActive : ""}`}
              onClick={() => setTab("node")}
            >
              Selected node
            </button>
            <button
              className={`${styles.tab} ${tab === "form" ? styles.tabActive : ""}`}
              onClick={() => setTab("form")}
            >
              Form definition
            </button>
            <button
              className={`${styles.tab} ${tab === "full" ? styles.tabActive : ""}`}
              onClick={() => setTab("full")}
            >
              Full response
            </button>
          </div>

          <pre className={styles.json}>{JSON.stringify(payload, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
