import { useState } from "react";
import { useGraph } from "./hooks/useGraph";
import { usePrefillMapping } from "./hooks/usePrefillMapping";
import { FormList } from "./components/FormList";
import { PrefillPanel } from "./components/PrefillPanel";
import { ApiInspector } from "./components/ApiInspector";
import { getDataSources } from "./datasources/registry";
import styles from "./App.module.css";

const TENANT_ID = "1";
const BLUEPRINT_ID = "bp_01jk766tckfwx84xjcxazggzyc";
const ENDPOINT = `http://localhost:3000/api/v1/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph`;

export default function App() {
  const { graph, loading, error } = useGraph(TENANT_ID, BLUEPRINT_ID);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const { mapping, mapField, clearField, reset } = usePrefillMapping();

  const sources = getDataSources();

  function selectNode(nodeId: string) {
    if (nodeId === activeNodeId) return;
    reset();
    setActiveNodeId(nodeId);
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <p>Loading blueprint graph…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.error}>Error: {error}</p>
        <p className={styles.hint}>
          Make sure the mock server is running:{" "}
          <code>cd frontendchallengeserver && npm start</code>
        </p>
      </div>
    );
  }

  if (!graph) return null;

  const activeNode = graph.nodes.find((n) => n.id === activeNodeId) ?? null;
  const activeForm = activeNode
    ? (graph.forms.find((f) => f.id === activeNode.data.component_id) ?? null)
    : null;

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <span className={styles.brand}>Journey Builder</span>
        <span className={styles.blueprintName}>{graph.name}</span>
      </header>

      <div className={styles.main}>
        <FormList
          nodes={graph.nodes}
          selectedNodeId={activeNodeId}
          onSelect={selectNode}
        />

        <div className={styles.content}>
          {activeNode && activeForm ? (
            <PrefillPanel
              node={activeNode}
              form={activeForm}
              nodes={graph.nodes}
              edges={graph.edges}
              forms={graph.forms}
              sources={sources}
              mapping={mapping}
              onMap={mapField}
              onClear={clearField}
            />
          ) : (
            <div className={styles.empty}>
              <p>Select a form on the left to configure its prefill settings.</p>
            </div>
          )}
        </div>
      </div>

      <ApiInspector
        graph={graph}
        activeNode={activeNode}
        activeForm={activeForm}
        endpoint={ENDPOINT}
      />
    </div>
  );
}
