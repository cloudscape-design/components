// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { calculcateCssColumnCount } from '../../../lib/components/column-layout/flexible-column-layout';

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

  it('supports more than 4 columns', () => {
    // all fit into 10 columns
    expect(calculcateCssColumnCount(10, 50, 900)).toBe(10);

    // wraps into fewer columns
    expect(calculcateCssColumnCount(10, 50, 420)).toBe(8);
    expect(calculcateCssColumnCount(10, 50, 180)).toBe(2);
    expect(calculcateCssColumnCount(10, 50, 90)).toBe(1);
  });
});
