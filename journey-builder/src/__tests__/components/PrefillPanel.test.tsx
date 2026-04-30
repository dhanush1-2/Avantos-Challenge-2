import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrefillPanel } from "../../components/PrefillPanel";
import type { FormDefinition, GraphEdge, GraphNode } from "../../types/api";
import type { DataSource } from "../../datasources/types";

function makeNode(id: string, componentId: string): GraphNode {
  return {
    id,
    type: "form",
    position: { x: 0, y: 0 },
    data: {
      id: `bp_${id}`,
      component_key: id,
      component_type: "form",
      component_id: componentId,
      name: `Form ${id}`,
      prerequisites: [],
      permitted_roles: [],
      input_mapping: {},
      sla_duration: { number: 0, unit: "minutes" },
      approval_required: false,
      approval_roles: [],
    },
  };
}

const form: FormDefinition = {
  id: "f_target",
  name: "Target Form",
  description: "",
  is_reusable: false,
  dynamic_field_config: {},
  field_schema: {
    type: "object",
    properties: {
      email: { avantos_type: "short-text", type: "string", title: "Email" },
      name: { avantos_type: "short-text", type: "string", title: "Name" },
    },
  },
};

const node = makeNode("target", "f_target");
const edges: GraphEdge[] = [{ source: "parent", target: "target" }];

const mockSource: DataSource = {
  id: "mock",
  label: "Mock Source",
  getGroups: () => [
    {
      groupId: "parent",
      groupLabel: "Form Parent",
      fields: [{ key: "status", label: "Status" }],
    },
  ],
};

const base = {
  node,
  form,
  nodes: [node, makeNode("parent", "f_parent")],
  edges,
  forms: [form],
  sources: [mockSource],
  mapping: {},
  onMap: vi.fn(),
  onClear: vi.fn(),
};

describe("PrefillPanel", () => {
  it("renders a button for each form field", () => {
    render(<PrefillPanel {...base} />);
    expect(screen.getByRole("button", { name: /email/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /name/ })).toBeInTheDocument();
  });

  it("opens the modal when an unmapped field is clicked", async () => {
    render(<PrefillPanel {...base} />);
    await userEvent.click(screen.getByRole("button", { name: /email/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows the mapped label and a clear button for a configured field", () => {
    const mapping = {
      email: { sourceId: "mock", groupId: "parent", fieldKey: "status", label: "Form Parent.status" },
    };
    render(<PrefillPanel {...base} mapping={mapping} />);
    expect(screen.getByText(/Form Parent\.status/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear prefill for email/ })).toBeInTheDocument();
  });

  it("calls onClear with the field key when the clear button is clicked", async () => {
    const onClear = vi.fn();
    const mapping = {
      email: { sourceId: "mock", groupId: "parent", fieldKey: "status", label: "Form Parent.status" },
    };
    render(<PrefillPanel {...base} mapping={mapping} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: /Clear prefill for email/ }));
    expect(onClear).toHaveBeenCalledWith("email");
  });

  it("hides the field list when the toggle is switched off", async () => {
    render(<PrefillPanel {...base} />);
    await userEvent.click(screen.getByRole("switch", { name: /Toggle prefill/ }));
    expect(screen.queryByRole("button", { name: /email/ })).not.toBeInTheDocument();
  });
});
