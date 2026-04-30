import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormList } from "../../components/FormList";
import type { GraphNode } from "../../types/api";

function makeFormNode(id: string, name: string): GraphNode {
  return {
    id,
    type: "form",
    position: { x: 0, y: 0 },
    data: {
      id: `bp_${id}`,
      component_key: id,
      component_type: "form",
      component_id: `f_${id}`,
      name,
      prerequisites: [],
      permitted_roles: [],
      input_mapping: {},
      sla_duration: { number: 0, unit: "minutes" },
      approval_required: false,
      approval_roles: [],
    },
  };
}

const nodes: GraphNode[] = [
  makeFormNode("A", "Form A"),
  makeFormNode("B", "Form B"),
  { ...makeFormNode("T", "Trigger"), type: "trigger" },
];

describe("FormList", () => {
  it("renders only form-type nodes", () => {
    render(<FormList nodes={nodes} selectedNodeId={null} onSelect={() => {}} />);
    expect(screen.getByText("Form A")).toBeInTheDocument();
    expect(screen.getByText("Form B")).toBeInTheDocument();
    expect(screen.queryByText("Trigger")).not.toBeInTheDocument();
  });

  it("marks the selected node as pressed", () => {
    render(<FormList nodes={nodes} selectedNodeId="A" onSelect={() => {}} />);
    const btn = screen.getByRole("button", { name: /Form A/ });
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onSelect with the node id when clicked", async () => {
    const onSelect = vi.fn();
    render(<FormList nodes={nodes} selectedNodeId={null} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /Form B/ }));
    expect(onSelect).toHaveBeenCalledWith("B");
  });
});
