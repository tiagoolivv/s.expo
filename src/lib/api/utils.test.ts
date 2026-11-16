import type { PaginateQuery } from './utils';
import {
  getNextPageParam,
  getPreviousPageParam,
  getQueryKey,
  getUrlParameters,
  normalizePages,
} from './utils';

function page(overrides: Partial<PaginateQuery<number>> = {}): PaginateQuery<number> {
  return { results: [], count: 0, next: null, previous: null, ...overrides };
}

describe('getUrlParameters', () => {
  it('returns null when there is no url', () => {
    expect(getUrlParameters(null)).toBeNull();
  });

  it('returns every query parameter as a string', () => {
    expect(getUrlParameters('https://api.test/items?limit=10&offset=20')).toEqual({
      limit: '10',
      offset: '20',
    });
  });

  it('ignores the fragment and returns an empty object without a query', () => {
    expect(getUrlParameters('https://api.test/items?offset=5#top')).toEqual({ offset: '5' });
    expect(getUrlParameters('https://api.test/items')).toEqual({});
  });
});

describe('page params', () => {
  it('reads the offset of the next page', () => {
    const current = page({ next: 'https://api.test/items?limit=10&offset=30' });
    expect(getNextPageParam(current)).toBe('30');
  });

  it('reads the offset of the previous page', () => {
    const current = page({ previous: 'https://api.test/items?offset=10' });
    expect(getPreviousPageParam(current)).toBe('10');
  });

  it('returns null when there is no page in that direction, or it has no offset', () => {
    expect(getNextPageParam(page())).toBeNull();
    expect(getPreviousPageParam(page({ previous: 'https://api.test/items' }))).toBeNull();
  });

  it('treats an empty offset as no page, so the query stops instead of fetching offset ""', () => {
    expect(getNextPageParam(page({ next: 'https://api.test/items?offset=' }))).toBeNull();
  });
});

describe('getQueryKey', () => {
  it('appends params only when they are given', () => {
    expect(getQueryKey('items')).toEqual(['items']);
    expect(getQueryKey('items', { id: 1 })).toEqual(['items', { id: 1 }]);
  });
});

describe('normalizePages', () => {
  it('flattens the results of every page, in order', () => {
    expect(normalizePages([page({ results: [1, 2] }), page({ results: [3] })])).toEqual([1, 2, 3]);
  });

  it('returns an empty list when there are no pages yet', () => {
    expect(normalizePages()).toEqual([]);
  });
});
