export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

type KeyParams = {
  [key: string]: any;
};
export const DEFAULT_LIMIT = 10;

export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}

// for infinite query pages  to flatList data
export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
  return pages
    ? pages.reduce((prev: T[], current) => [...prev, ...current.results], [])
    : [];
}

// a function that accept a url and return params as an object
export function getUrlParameters(
  url: string | null,
): { [k: string]: string } | null {
  if (url === null) {
    return null;
  }
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params = {};
  let match;
  while ((match = regex.exec(url))) {
    // @ts-expect-error - Dynamic key assignment
    params[match[1]] = match[2];
  }
  return params;
}

// A page param reads the offset that the response's next or previous url
// points at. Both directions are the same decision, so it lives here once.
type PageDirection = 'next' | 'previous';

function pageParam(direction: PageDirection) {
  return (page: PaginateQuery<unknown>): string | null =>
    getUrlParameters(page[direction])?.offset || null;
}

export const getPreviousPageParam = pageParam('previous');

export const getNextPageParam = pageParam('next');
