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
