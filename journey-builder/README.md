# Journey Builder

![CI](https://github.com/dhanush1-2/journey-builder/actions/workflows/ci.yml/badge.svg)

A React + TypeScript implementation of the Avantos Journey Builder prefill UI challenge.

## Running locally

**1. Start the mock API server**

```bash
cd frontendchallengeserver
npm install
npm start
# Server runs on http://localhost:3000
```

**2. Start the React app** (in a separate terminal)

```bash
cd journey-builder
npm install
npm run dev
# App runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173), select a form from the sidebar, and configure its prefill mappings.

## Running tests

```bash
npm test              # run all tests once
npm run test:watch    # re-run on file changes
npm run test:coverage # generate coverage report
```

42 tests across 7 files:

| Area | File |
|---|---|
| DAG traversal | `__tests__/lib/dag.test.ts` |
| Form data source | `__tests__/datasources/formDataSource.test.ts` |
| Global data source | `__tests__/datasources/globalDataSource.test.ts` |
| Data source registry | `__tests__/datasources/registry.test.ts` |
| FormList component | `__tests__/components/FormList.test.tsx` |
| PrefillPanel component | `__tests__/components/PrefillPanel.test.tsx` |
| DataElementModal component | `__tests__/components/DataElementModal.test.tsx` |

CI runs lint + tests + build on every push via `.github/workflows/ci.yml`.

## Architecture

```
src/
  api/              fetchBlueprintGraph — single API call
  types/            TypeScript types for the API response and prefill state
  lib/dag.ts        Pure DAG utilities — directParentsOf, ancestorsOf
  datasources/      Pluggable data source layer (see below)
  hooks/            useGraph, usePrefillMapping
  components/
    FormList/         Sidebar list of form nodes
    PrefillPanel/     Per-form prefill configuration UI
    DataElementModal/ Source picker modal
```

## Data source plugin system

Each prefill source implements one interface:

```typescript
interface DataSource {
  id: string;
  label: string;
  getGroups(context: DataSourceContext): DataSourceGroup[];
}
```

`context` carries `{ nodeId, nodes, edges, forms }`. A source that needs the DAG
uses it; one that doesn't (e.g. global data) ignores it entirely.

Two sources ship by default:

| ID | What it does |
|---|---|
| `global` | Returns static groups (Action Properties, Client Organisation Properties) |
| `form` | Walks DAG ancestors (BFS reversed → upstream-first) and exposes each form's fields + `completed_at` |

## Adding a new data source

Implement `DataSource` and call `registerDataSource` once at startup — no other changes required:

```typescript
// main.tsx (or any module that runs before the first render)
import { registerDataSource } from "./datasources/registry";

registerDataSource({
  id: "crm",
  label: "CRM Properties",
  getGroups: () => [
    {
      groupId: "lead",
      groupLabel: "Lead",
      fields: [
        { key: "lead_id",    label: "Lead ID" },
        { key: "lead_email", label: "Lead Email" },
      ],
    },
  ],
});
```

The modal and prefill panel pick it up automatically. Sources appear in the modal
in registration order, so call `registerDataSource` in the order you want them displayed.

## Key design decisions

| Decision | Reason |
|---|---|
| `DataSource` plugin interface + registry | Adding or removing a source requires zero component changes |
| BFS reversed for form ancestors | Upstream forms (roots) appear before downstream ones in the modal, matching the expected UX |
| `completed_at` prepended in `formDataSource` | System field automatically available on every submitted form, not declared in `field_schema` |
| `usePrefillMapping` hook | Isolates all mapping state; reset on node change keeps mappings form-scoped |
| Controlled components throughout | `PrefillPanel` and `DataElementModal` own no data — state lives in `App`, making them fully testable in isolation |
| CSS Modules | Component-scoped styles, zero runtime cost |
