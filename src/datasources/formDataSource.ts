import { ancestorsOf } from "../lib/dag";
import type { DataSource, DataSourceContext, DataSourceGroup } from "./types";

// completed_at is a system field automatically available on every submitted form
const SYSTEM_FIELDS = [{ key: "completed_at", label: "Completed At" }];

export const formDataSource: DataSource = {
  id: "form",
  label: "Form Fields",

  getGroups({ nodeId, nodes, edges, forms }: DataSourceContext): DataSourceGroup[] {
    // Reverse so upstream ancestors (roots) appear before downstream ones in the modal
    return ancestorsOf(nodeId, edges).reverse().flatMap((id) => {
      const node = nodes.find((n) => n.id === id);
      const form = node && forms.find((f) => f.id === node.data.component_id);
      if (!node || !form) return [];

      const schemaFields = Object.entries(form.field_schema.properties).map(
        ([key, schema]) => ({ key, label: schema.title ?? key })
      );

      return [{
        groupId: id,
        groupLabel: node.data.name,
        fields: [...SYSTEM_FIELDS, ...schemaFields],
      }];
    });
  },
};
