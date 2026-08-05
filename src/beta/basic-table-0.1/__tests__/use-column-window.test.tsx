// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { computeColumnWindow } from '../use-virtualization/use-column-window';

// Pure-geometry unit tests for the column-virtualization window. computeColumnWindow maps a
// horizontal viewport (scrollLeft + width) onto the fixed px widths of the data columns and returns
// the intersecting indices (± overscan) unioned with any pinned first/last columns.

// 10 columns × 100px each = 1000px total.
const WIDTHS = Array.from({ length: 10 }, () => 100);

function indices(set: Set<number>): number[] {
  return [...set].sort((a, b) => a - b);
}

describe('computeColumnWindow', () => {
  test('viewport at the left edge selects the leading columns', () => {
    const {
      first,
      last,
      indices: set,
    } = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 0,
      scrollLeft: 0,
      viewportWidth: 250,
      overscan: 0,
      pinnedFirst: 0,
      pinnedLast: 0,
    });
    // [0,250) intersects columns 0,1,2 ([0,100),[100,200),[200,300)).
    expect(first).toBe(0);
    expect(last).toBe(2);
    expect(indices(set)).toEqual([0, 1, 2]);
  });

  test('viewport in the middle selects the middle columns', () => {
    const { first, last } = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 0,
      scrollLeft: 420,
      viewportWidth: 200,
      overscan: 0,
      pinnedFirst: 0,
      pinnedLast: 0,
    });
    // [420,620) intersects columns 4 ([400,500)),5,6 ([600,700)).
    expect(first).toBe(4);
    expect(last).toBe(6);
  });

  test('viewport at the right edge selects the trailing columns', () => {
    const { first, last } = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 0,
      scrollLeft: 800,
      viewportWidth: 200,
      overscan: 0,
      pinnedFirst: 0,
      pinnedLast: 0,
    });
    // [800,1000) intersects columns 8,9.
    expect(first).toBe(8);
    expect(last).toBe(9);
  });

  test('leadingOffset shifts the intersection by the disclosure track width', () => {
    const { first, last } = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 40,
      scrollLeft: 0,
      viewportWidth: 250,
      overscan: 0,
      pinnedFirst: 0,
      pinnedLast: 0,
    });
    // Columns now start at 40: col0 [40,140), col1 [140,240), col2 [240,340). [0,250) hits 0,1,2.
    expect(first).toBe(0);
    expect(last).toBe(2);
  });

  test('overscan expands the window symmetrically and clamps to [0, n-1]', () => {
    const {
      first,
      last,
      indices: set,
    } = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 0,
      scrollLeft: 420,
      viewportWidth: 200,
      overscan: 2,
      pinnedFirst: 0,
      pinnedLast: 0,
    });
    // Base window 4..6, overscan 2 -> 2..8.
    expect(first).toBe(2);
    expect(last).toBe(8);
    expect(indices(set)).toEqual([2, 3, 4, 5, 6, 7, 8]);

    // Near the left edge overscan clamps at 0.
    const left = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 0,
      scrollLeft: 0,
      viewportWidth: 100,
      overscan: 5,
      pinnedFirst: 0,
      pinnedLast: 0,
    });
    expect(left.first).toBe(0);
  });

  test('pinnedFirst / pinnedLast are always included even far off-window', () => {
    const { indices: set } = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 0,
      scrollLeft: 420,
      viewportWidth: 200,
      overscan: 0,
      pinnedFirst: 2,
      pinnedLast: 1,
    });
    // Window 4..6 plus pinned columns 0,1 (first) and 9 (last).
    expect(indices(set)).toEqual([0, 1, 4, 5, 6, 9]);
  });

  test('zero (or negative) viewport width falls back to ALL indices', () => {
    const {
      first,
      last,
      indices: set,
    } = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 0,
      scrollLeft: 0,
      viewportWidth: 0,
      overscan: 0,
      pinnedFirst: 0,
      pinnedLast: 0,
    });
    expect(first).toBe(0);
    expect(last).toBe(9);
    expect(set.size).toBe(10);
  });

  test('empty widths returns an empty window', () => {
    const { indices: set } = computeColumnWindow({
      widths: [],
      leadingOffset: 0,
      scrollLeft: 0,
      viewportWidth: 500,
      overscan: 3,
      pinnedFirst: 1,
      pinnedLast: 1,
    });
    expect(set.size).toBe(0);
  });

  test('scrolled entirely past all content falls back to ALL indices (safe)', () => {
    const { indices: set } = computeColumnWindow({
      widths: WIDTHS,
      leadingOffset: 0,
      scrollLeft: 5000,
      viewportWidth: 200,
      overscan: 0,
      pinnedFirst: 0,
      pinnedLast: 0,
    });
    expect(set.size).toBe(10);
  });
});
