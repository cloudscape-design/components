// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  calculateBreakpointColumnCount,
  calculcateCssColumnCount,
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

describe('ColumnLayout calculateBreakpointColumnCount', () => {
  // The narrow breakpoints ignore the width, so any value does for them.
  const anyWidth = 1000;

  it('returns the desired number of columns before the container has been measured', () => {
    expect(calculateBreakpointColumnCount(5, null, null)).toBe(5);
    expect(calculateBreakpointColumnCount(1, null, null)).toBe(1);
  });

  it('matches the 12-column renderer for counts it supports', () => {
    // COLUMN_DEFS resolves to these items per row: 12 / colspan at each breakpoint. The `xs`
    // expectations hold because 4 columns need 600px at the assumed width and `xs` starts at 688px,
    // so the width cap never bites in the range the 12-column renderer covers.
    const gridRendererItemsPerRow = [
      { columns: 1, default: 1, xxs: 1, xs: 1 },
      { columns: 2, default: 1, xxs: 2, xs: 2 },
      { columns: 3, default: 1, xxs: 2, xs: 3 },
      { columns: 4, default: 1, xxs: 2, xs: 4 },
    ];

    for (const { columns, ...expected } of gridRendererItemsPerRow) {
      expect(calculateBreakpointColumnCount(columns, 'default', anyWidth)).toBe(expected.default);
      expect(calculateBreakpointColumnCount(columns, 'xxs', anyWidth)).toBe(expected.xxs);
      expect(calculateBreakpointColumnCount(columns, 'xs', 688)).toBe(expected.xs);
    }
  });

  it('keeps the narrow-breakpoint rules beyond 4 columns', () => {
    expect(calculateBreakpointColumnCount(6, 'default', anyWidth)).toBe(1);
    expect(calculateBreakpointColumnCount(6, 'xxs', anyWidth)).toBe(2);
  });

  it('caps the count by available width once past the breakpoint ladder', () => {
    // 150px is assumed per column, so the count steps down as the container shrinks rather than
    // staying at the requested value for every width above xs.
    expect(calculateBreakpointColumnCount(6, 'xs', 1000)).toBe(6);
    expect(calculateBreakpointColumnCount(6, 'xs', 900)).toBe(6);
    expect(calculateBreakpointColumnCount(6, 'xs', 700)).toBe(4);

    // The same even-count rule as the minColumnWidth path: 5 fitting columns rounds down to 4.
    expect(calculateBreakpointColumnCount(12, 'xs', 1840)).toBe(12);
    expect(calculateBreakpointColumnCount(12, 'xs', 1200)).toBe(8);
    expect(calculateBreakpointColumnCount(12, 'xs', 800)).toBe(4);
  });
});
