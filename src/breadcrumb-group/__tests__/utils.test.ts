// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getItemsDisplayProperties } from '../utils';

describe('getItemsDisplayProperties', () => {
  test('does not break with zero items', () => {
    const displayProperties = getItemsDisplayProperties([], 90);
    expect(displayProperties).toEqual({
      collapsed: 0,
    });
  });
  test.each([
    [3000, 0],
    [1210, 0],
    [1209, 1], // second breadcrumb collapses
    [910, 1],
    [909, 2], // third breadcrumb collapses
    [410, 2],
    [409, 3], // fourth breadcrumb collapses
    [360, 3],
    [359, 4], // fifth breadcrumb collapses
    [210, 4],
    [209, 5], // sixth breadcrumb collapses
    [10, 5],
  ])('returns correct number of collapsed items (width: %d, collapsed: %d)', (navWidth, expectedCollapsed) => {
    const itemsWidths = [20, 300, 500, 50, 150, 1000];
    expect(getItemsDisplayProperties(itemsWidths, navWidth).collapsed).toEqual(expectedCollapsed);
  });
});
