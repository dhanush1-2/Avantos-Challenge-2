import type { DataSource } from "./types";
import { globalDataSource } from "./globalDataSource";
import { formDataSource } from "./formDataSource";

// Global sources appear first in the modal, then form-based sources
const registered: DataSource[] = [globalDataSource, formDataSource];

export function registerDataSource(source: DataSource): void {
  if (registered.some((s) => s.id === source.id)) {
    throw new Error(`A data source with id "${source.id}" is already registered.`);
  }
  registered.push(source);
}

export function getDataSources(): DataSource[] {
  return [...registered];
}
