// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { ButtonDropdownProps } from '../interfaces';
import ItemsList from '../../../lib/components/button-dropdown/items-list';
import itemElementStyles from '../../../lib/components/button-dropdown/item-element/styles.css.js';

function renderItemsList(items: ButtonDropdownProps.Items): HTMLElement {
  const { container } = render(
    <ItemsList
      items={items}
      lastInDropdown={true} // always true for the top-level list
      targetItem={null}
      onGroupToggle={() => {}}
      onItemActivate={() => {}}
      isHighlighted={() => false}
      isKeyboardHighlight={() => false}
      isExpanded={() => false}
      highlightItem={() => {}}
    />
  );
  return container;
}

test('renders a section divider on the last item before a category', () => {
  const container = renderItemsList([
    { id: '1', text: '1' },
    { id: '2', text: '2' },
    { id: '3', text: '3' },
    { id: '4', items: [{ id: '4-1', text: '4-1' }] },
  ]);
  expect(container.querySelector('[data-testid="3"]')).toHaveClass(itemElementStyles['show-divider']);
});

test('renders a section divider on the last item inside a category if there are items following it', () => {
  const container = renderItemsList([
    { id: '1', items: [{ id: '1-1', text: '1-1' }] },
    { id: '2', text: '2' },
  ]);
  expect(container.querySelector('[data-testid="1-1"]')).toHaveClass(itemElementStyles['show-divider']);
});

test('does not render a section divider on the last item inside a category if there are no items following it', () => {
  const container = renderItemsList([{ id: '1', items: [{ id: '1-1', text: '1-1' }] }]);
  expect(container.querySelector('[data-testid="1-1"]')).not.toHaveClass(itemElementStyles['show-divider']);
});

test('does not render a section divider on the last item in the list', () => {
  const container = renderItemsList([
    { id: '1', text: '1' },
    { id: '2', text: '2' },
    { id: '3', text: '3' },
  ]);
  expect(container.querySelector('[data-testid="3"]')).not.toHaveClass(itemElementStyles['show-divider']);
});
