// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  calculcateCssColumnCount,
  DEFAULT_MIN_COLUMN_WIDTH,
} from '../../../lib/components/column-layout/flexible-column-layout';

describe('ColumnLayout calculcateCssColumnCount', () => {
  it('returns desired number of columns when container width is not defined', () => {
    expect(calculcateCssColumnCount(3, 100, null)).toBe(3);
    expect(calculcateCssColumnCount(4, 50, null)).toBe(4);
    expect(calculcateCssColumnCount(1, 100, null)).toBe(1);
  });

  it('returns desired number of columns when content fits', () => {
    expect(calculcateCssColumnCount(4, 100, 600)).toBe(4);
    expect(calculcateCssColumnCount(2, 400, 900)).toBe(2);
  });

  it('return one column if there is not enough space', () => {
    expect(calculcateCssColumnCount(4, 1000, 800)).toBe(1);
  });

  it('wraps to the next even number of columns when necessary', () => {
    expect(calculcateCssColumnCount(4, 100, 300)).toBe(2);
    expect(calculcateCssColumnCount(4, 250, 300)).toBe(1);

    expect(calculcateCssColumnCount(3, 200, 450)).toBe(2);
    expect(calculcateCssColumnCount(3, 200, 220)).toBe(1);
  });

  it('supports more than 4 columns when minColumnWidth is set', () => {
    // all fit into 10 columns
    expect(calculcateCssColumnCount(10, 50, 900)).toBe(10);

    // wraps into fewer columns
    expect(calculcateCssColumnCount(10, 50, 420)).toBe(8);
    expect(calculcateCssColumnCount(10, 50, 180)).toBe(2);
    expect(calculcateCssColumnCount(10, 50, 90)).toBe(1);
  });
});

describe('ColumnLayout column count with the assumed default width', () => {
  // Mirrors what the renderer does when `minColumnWidth` is not set: the same calculation runs with
  // DEFAULT_MIN_COLUMN_WIDTH supplied in its place, so there is one reduction rule, not two.
  const withDefault = (columns: number, containerWidth: number | null) =>
    calculcateCssColumnCount(columns, DEFAULT_MIN_COLUMN_WIDTH, containerWidth);

  it('renders the requested count before the container has been measured', () => {
    expect(withDefault(12, null)).toBe(12);
    expect(withDefault(5, null)).toBe(5);
  });

  it('steps the count down as the container narrows', () => {
    expect(withDefault(12, 1840)).toBe(12);
    expect(withDefault(12, 1200)).toBe(8);
    expect(withDefault(12, 1000)).toBe(6);
    expect(withDefault(12, 700)).toBe(4);
    expect(withDefault(12, 450)).toBe(2);
    expect(withDefault(12, 300)).toBe(2);
    expect(withDefault(12, 140)).toBe(1);
  });

  it('skips odd counts while reducing, so 13 items wrap as 12-1, 8-5, 6-6-1, then 4-4-4-1', () => {
    // floor(750/150) is 5 and floor(1100/150) is 7, both rounded down to the next even count.
    expect(withDefault(12, 750)).toBe(4);
    expect(withDefault(12, 1100)).toBe(6);
  });

  it('leaves an odd requested count alone when it fits', () => {
    expect(withDefault(5, 800)).toBe(5);
    expect(withDefault(7, 1100)).toBe(7);
  });
});
