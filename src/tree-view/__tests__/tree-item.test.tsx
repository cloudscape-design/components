// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';
import { defaultProps, Item, items } from './common';

function renderTreeView(props: Partial<TreeViewProps<Item>> = {}) {
  const { container } = render(<TreeView {...defaultProps} {...props} />);
  const wrapper = createWrapper(container).findTreeView()!;
  return { wrapper };
}

test('expand toggle is only added to expandable items', () => {
  const { wrapper } = renderTreeView();

  const expandableItem = wrapper.findItemById('1')!;
  const nonExpandableItem = wrapper.findItemById('2')!;

  expect(expandableItem.findItemToggle()!.getElement()).toBeVisible();
  expect(nonExpandableItem.findItemToggle()).toBeNull();
});

test('onItemToggle is fired when toggle is clicked', () => {
  const onItemToggle = jest.fn();
  const { wrapper } = renderTreeView({ onItemToggle });

  const itemToggle = wrapper.findItemById('1')!.findItemToggle()!.getElement();

  // expand
  itemToggle.click();
  expect(onItemToggle).toHaveBeenCalledTimes(1);
  expect(onItemToggle).toHaveBeenCalledWith(
    expect.objectContaining({ detail: { id: items[0].id, item: items[0], expanded: true } })
  );

  // collapse
  itemToggle.click();
  expect(onItemToggle).toHaveBeenCalledTimes(2);
  expect(onItemToggle).toHaveBeenCalledWith(
    expect.objectContaining({ detail: { id: items[0].id, item: items[0], expanded: false } })
  );
});

test('children items are rendered only when item is expanded', () => {
  const { wrapper } = renderTreeView();

  const expandableItem = wrapper.findItemById('1')!;
  expect(expandableItem.findChildItemById('1.1')).toBeNull();

  // expand
  expandableItem.findItemToggle()!.getElement().click();
  expect(expandableItem.findChildItems().length).toBe(2);
  expect(wrapper.findItemById('1', { expanded: true })!.getElement()).toBeVisible();
  expect(expandableItem.findChildItemById('1.1')!.getElement()).toBeVisible();

  // collapse
  expandableItem.findItemToggle()!.getElement().click();
  expect(expandableItem.findChildItems().length).toBe(0);
  expect(wrapper.findItemById('1', { expanded: false })!.getElement()).toBeVisible();
  expect(expandableItem.findChildItemById('1.1')).toBeNull();
});

test("expanding an item shouldn't expand its child item", () => {
  const { wrapper } = renderTreeView();

  const expandableItem = wrapper.findItemById('1')!;

  expandableItem.findItemToggle()!.getElement().click();
  expect(expandableItem.findChildItemById('1.2', { expanded: false })!.getElement()).toBeVisible();
  expect(expandableItem.findChildItemById('1.2.1')).toBeNull();
});
