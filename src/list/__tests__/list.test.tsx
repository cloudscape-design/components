// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { Icon } from '../../../lib/components';
import List, { ListProps } from '../../../lib/components/list';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: string;
  content: string;
}
const defaultItems: Item[] = [
  { id: 'item1', content: 'Item 1' },
  { id: 'item2', content: 'Item 2' },
  { id: 'item3', content: 'Item 3' },
];

const renderList = (props: Partial<ListProps<Item>> = {}) => {
  const defaultProps = {
    items: defaultItems,
    renderItem: (item: Item) => ({ id: item.id, content: item.content }),
  };
  const renderResult = render(<List {...defaultProps} {...props} />);
  return createWrapper(renderResult.container).findList()!;
};

describe('List', () => {
  test('renders items', () => {
    const wrapper = renderList();
    expect(wrapper.findItems()).toHaveLength(3);
    expect(wrapper.findItemByIndex(1)!.getElement()).toHaveTextContent('Item 1');
    expect(wrapper.findItemByIndex(2)!.getElement()).toHaveTextContent('Item 2');
    expect(wrapper.findItemByIndex(3)!.getElement()).toHaveTextContent('Item 3');
  });

  test('find item by id', () => {
    const wrapper = renderList();
    expect(wrapper.findItemById('item1')!.getElement()).toHaveTextContent('Item 1');
    expect(wrapper.findItemById('item2')!.getElement()).toHaveTextContent('Item 2');
    expect(wrapper.findItemById('item3')!.getElement()).toHaveTextContent('Item 3');
  });

  test('renders complex items', () => {
    const wrapper = renderList({
      renderItem: item => ({
        id: item.id,
        content: item.content,
        secondaryContent: `Secondary content for ${item.content}`,
        icon: <Icon name="add-plus" ariaLabel="" />,
        actions: `Actions for ${item.content}`,
      }),
    });
    expect(wrapper.findItems()).toHaveLength(3);
    expect(wrapper.findItemByIndex(1)!.findSecondaryContent()!.getElement()).toHaveTextContent(
      'Secondary content for Item 1'
    );
    expect(wrapper.findItemByIndex(2)!.findActions()!.getElement()).toHaveTextContent('Actions for Item 2');
    expect(wrapper.findItemByIndex(3)!.findIcon()!.findIcon()!.getElement()).toBeTruthy();
  });

  test('renders as ul by default', () => {
    const wrapper = renderList();
    expect(wrapper.getElement().tagName).toBe('UL');
  });

  test('can render as ol', () => {
    const wrapper = renderList({ tag: 'ol' });
    expect(wrapper.getElement().tagName).toBe('OL');
  });
});
