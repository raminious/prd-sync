export interface Prd {
  id: number;
  slug: string;
  title: string;
  project: string;
  latestVersion: number;
}

export interface PrdSummary {
  slug: string;
  title: string;
  project: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
}

export interface PrdVersionMeta {
  number: number;
  summary: string;
  author: string;
  isMinor: boolean;
  createdAt: string;
}

export type FormState = { error: string } | null;
