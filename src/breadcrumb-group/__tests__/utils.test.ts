// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getItemsDisplayProperties, getMaxItemsCollapsed } from '../utils';

describe('getItemsDisplayProperties', () => {
  test('does not break with zero items', () => {
    const displayProperties = getItemsDisplayProperties([], 90);
    expect(displayProperties).toEqual({
      collapsed: 0,
    });
  });
  test('two items: enough space', () => {
    expect(getItemsDisplayProperties([70, 30], 100).collapsed).toEqual(0);
  });
  test('two items: not enough space', () => {
    expect(getItemsDisplayProperties([70, 30], 99).collapsed).toEqual(1);
  });
  test('two items: enough space with final item truncation', () => {
    expect(getItemsDisplayProperties([70, 100], 140).collapsed).toEqual(0);
  });
  test('two items: not enough space with final item truncation', () => {
    expect(getItemsDisplayProperties([70, 100], 139).collapsed).toEqual(1);
  });
  test('three items: enough space', () => {
    expect(getItemsDisplayProperties([70, 70, 30], 170).collapsed).toEqual(0);
  });
  test('three items: not enough space (collapse 1)', () => {
    expect(getItemsDisplayProperties([70, 70, 30], 169).collapsed).toEqual(1);
    expect(getItemsDisplayProperties([70, 70, 30], 150).collapsed).toEqual(1);
  });
  test('three items: not enough space (collapse 2)', () => {
    expect(getItemsDisplayProperties([70, 70, 30], 149).collapsed).toEqual(2);
  });
  test('three items: enough space with final item truncation', () => {
    expect(getItemsDisplayProperties([70, 70, 100], 210).collapsed).toEqual(0);
  });
  test('three items: not enough space with final item truncation (collapse 1)', () => {
    expect(getItemsDisplayProperties([70, 70, 100], 209).collapsed).toEqual(1);
    expect(getItemsDisplayProperties([70, 70, 100], 190).collapsed).toEqual(1);
  });
  test('three items: not enough space with final item truncation (collapse 2)', () => {
    expect(getItemsDisplayProperties([70, 70, 100], 189).collapsed).toEqual(2);
  });
  test('three items, small 2nd: enough space', () => {
    expect(getItemsDisplayProperties([70, 30, 30], 130).collapsed).toEqual(0);
  });
  test('three items, small 2nd: not enough space', () => {
    expect(getItemsDisplayProperties([70, 30, 30], 129).collapsed).toEqual(2);
  });
  test.each([
    [3000, 0],
    [1090, 0],
    [1089, 1], // second breadcrumb collapses
    [840, 1],
    [839, 2], // third breadcrumb collapses
    [340, 2],
    [339, 3], // fourth breadcrumb collapses
    [290, 3],
    [289, 4], // fifth breadcrumb collapses
    [140, 4],
    [139, 5], // sixth breadcrumb collapses
    [10, 5],
  ])('returns correct number of collapsed items (width: %d, collapsed: %d)', (navWidth, expectedCollapsed) => {
    const itemsWidths = [20, 300, 500, 50, 150, 1000];
    expect(getItemsDisplayProperties(itemsWidths, navWidth).collapsed).toEqual(expectedCollapsed);
  });
});

describe('getMaxItemsCollapsed', () => {
  describe('returns 0 when maxItems is not a meaningful constraint', () => {
    test('maxItems undefined', () => {
      expect(getMaxItemsCollapsed(5, undefined)).toBe(0);
    });

    test('maxItems less than 2', () => {
      expect(getMaxItemsCollapsed(5, 1)).toBe(0);
      expect(getMaxItemsCollapsed(5, 0)).toBe(0);
      expect(getMaxItemsCollapsed(5, -1)).toBe(0);
    });

    test('maxItems equals total items — no collapse needed', () => {
      expect(getMaxItemsCollapsed(5, 5)).toBe(0);
    });

    test('maxItems greater than total items — no collapse needed', () => {
      expect(getMaxItemsCollapsed(5, 10)).toBe(0);
      expect(getMaxItemsCollapsed(5, 6)).toBe(0);
    });

    test('zero items', () => {
      expect(getMaxItemsCollapsed(0, 3)).toBe(0);
    });

    test('one item', () => {
      expect(getMaxItemsCollapsed(1, 3)).toBe(0);
    });

    test('two items with maxItems=2 — no collapse', () => {
      expect(getMaxItemsCollapsed(2, 2)).toBe(0);
    });
  });

  describe('returns the correct number of collapsed items', () => {
    test('5 items, maxItems=4 → collapse 1 middle item', () => {
      expect(getMaxItemsCollapsed(5, 4)).toBe(1);
    });

    test('5 items, maxItems=3 → collapse 2 middle items', () => {
      expect(getMaxItemsCollapsed(5, 3)).toBe(2);
    });

    test('5 items, maxItems=2 → collapse 3 middle items (max: all middles)', () => {
      expect(getMaxItemsCollapsed(5, 2)).toBe(3);
    });

    test('6 items, maxItems=4 → collapse 2 middle items', () => {
      expect(getMaxItemsCollapsed(6, 4)).toBe(2);
    });

    test('6 items, maxItems=2 → collapse 4 middle items (all middles)', () => {
      expect(getMaxItemsCollapsed(6, 2)).toBe(4);
    });

    test('2 items, maxItems=2 → no collapse (only first and last)', () => {
      expect(getMaxItemsCollapsed(2, 2)).toBe(0);
    });

    test('3 items, maxItems=2 → collapse 1 middle item', () => {
      expect(getMaxItemsCollapsed(3, 2)).toBe(1);
    });

    test('fractional maxItems is floored', () => {
      // maxItems=3.9 → floor → 3; 5 items → collapse 2
      expect(getMaxItemsCollapsed(5, 3.9)).toBe(2);
    });
  });

  describe('never collapses first or last item', () => {
    test('maxItems=2 with many items collapses only middle items', () => {
      // 10 items, maxItems=2 → keep first (0) and last (9), collapse 8 middles
      expect(getMaxItemsCollapsed(10, 2)).toBe(8);
    });

    test('collapse count never exceeds totalItems - 2', () => {
      // Even if maxItems=1 (invalid, returns 0), we verify the guard
      expect(getMaxItemsCollapsed(5, 1)).toBe(0);
    });
  });
});
