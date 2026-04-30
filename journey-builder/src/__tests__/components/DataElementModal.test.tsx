import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataElementModal } from "../../components/DataElementModal";
import type { DataSource, DataSourceContext } from "../../datasources/types";

const mockContext: DataSourceContext = {
  nodeId: "target",
  nodes: [],
  edges: [],
  forms: [],
};

const mockSource: DataSource = {
  id: "form",
  label: "Form Fields",
  getGroups: () => [
    {
      groupId: "parent",
      groupLabel: "Form A",
      fields: [
        { key: "email", label: "Email" },
        { key: "name", label: "Name" },
      ],
    },
  ],
};

describe("DataElementModal", () => {
  it("renders the dialog with a title", () => {
    render(
      <DataElementModal
        sources={[mockSource]}
        context={mockContext}
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Select data element to map/i)).toBeInTheDocument();
  });

  it("shows group names and expands them on click", async () => {
    render(
      <DataElementModal
        sources={[mockSource]}
        context={mockContext}
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText("Form A")).toBeInTheDocument();
    // Fields not visible until group expanded
    expect(screen.queryByText("email")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Form A"));
    expect(screen.getByText("email")).toBeInTheDocument();
  });

  it("SELECT button is disabled until a field is chosen", () => {
    render(
      <DataElementModal
        sources={[mockSource]}
        context={mockContext}
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /SELECT/ })).toBeDisabled();
  });

  it("calls onSelect with the right data after picking a field", async () => {
    const onSelect = vi.fn();
    render(
      <DataElementModal
        sources={[mockSource]}
        context={mockContext}
        onSelect={onSelect}
        onCancel={vi.fn()}
      />
    );
    await userEvent.click(screen.getByText("Form A"));
    await userEvent.click(screen.getByText("email"));
    await userEvent.click(screen.getByRole("button", { name: /SELECT/ }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ sourceId: "form", groupId: "parent" })
    );
    expect(onSelect.mock.calls[0][0].field.key).toBe("email");
  });

  it("calls onCancel when CANCEL is clicked", async () => {
    const onCancel = vi.fn();
    render(
      <DataElementModal
        sources={[mockSource]}
        context={mockContext}
        onSelect={vi.fn()}
        onCancel={onCancel}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /CANCEL/ }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("filters groups and fields by search query", async () => {
    render(
      <DataElementModal
        sources={[mockSource]}
        context={mockContext}
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    // Expand first
    await userEvent.click(screen.getByText("Form A"));
    // Both fields visible
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();

    await userEvent.type(screen.getByRole("searchbox"), "email");
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.queryByText("name")).not.toBeInTheDocument();
  });
});
