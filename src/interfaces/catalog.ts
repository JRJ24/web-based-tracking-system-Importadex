export interface Catalogs {
  countries: string[];
  offices: string[];
  statuses: string[];
}

export type CatalogKind = keyof Catalogs;

export type CatalogDrafts = Record<CatalogKind, string>;
