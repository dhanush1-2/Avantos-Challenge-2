import type { DataSource } from "./types";

export const globalDataSource: DataSource = {
  id: "global",
  label: "Global Data",

  getGroups() {
    return [
      {
        groupId: "action_properties",
        groupLabel: "Action Properties",
        fields: [
          { key: "action_id", label: "Action ID" },
          { key: "action_name", label: "Action Name" },
          { key: "created_at", label: "Created At" },
          { key: "created_by", label: "Created By" },
        ],
      },
      {
        groupId: "client_org",
        groupLabel: "Client Organisation Properties",
        fields: [
          { key: "org_id", label: "Organisation ID" },
          { key: "org_name", label: "Organisation Name" },
          { key: "org_email", label: "Organisation Email" },
          { key: "org_phone", label: "Organisation Phone" },
        ],
      },
    ];
  },
};
