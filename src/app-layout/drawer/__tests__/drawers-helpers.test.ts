// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { splitItems } from '../../../../lib/components/app-layout/drawer/drawers-helpers';

test('handles empty values', () => {
  expect(splitItems(undefined, 2, null)).toEqual({ visibleItems: [], overflowItems: [] });
});

test('splits items by index', () => {
  expect(splitItems([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], 2, null)).toEqual({
    visibleItems: [{ id: '1' }, { id: '2' }],
    overflowItems: [{ id: '3' }, { id: '4' }],
  });
});

test('splits items when active item is visible', () => {
  expect(splitItems([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], 2, '2')).toEqual({
    visibleItems: [{ id: '1' }, { id: '2' }],
    overflowItems: [{ id: '3' }, { id: '4' }],
  });
});

test('moves active item to visible when in overflow', () => {
  expect(splitItems([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], 2, '3')).toEqual({
    visibleItems: [{ id: '1' }, { id: '3' }],
    overflowItems: [{ id: '2' }, { id: '4' }],
  });
});

test('does not fail when active id resolves to a non-existing item', () => {
  expect(splitItems([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], 2, '10')).toEqual({
    visibleItems: [{ id: '1' }, { id: '2' }],
    overflowItems: [{ id: '3' }, { id: '4' }],
  });
});

test('moves single overflow item into visible items', () => {
  expect(splitItems([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], 3, null)).toEqual({
    visibleItems: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
    overflowItems: [],
  });
});
