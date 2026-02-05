// src/shared/utils/query-parser.ts
export function parseQueryParams(url: string) {
  const { searchParams } = new URL(url);
  return Object.fromEntries(searchParams.entries());
}
