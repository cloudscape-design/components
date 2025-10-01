// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import ButtonDropdown from '../../../lib/components/button-dropdown';
import Icon from '../../../lib/components/icon';
import Link from '../../../lib/components/link';
import Popover from '../../../lib/components/popover';
import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView, { TreeViewProps } from '../../../lib/components/tree-view';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

interface Item {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  hasActions?: boolean;
  items?: Item[];
}

const defaultActions = (
  <ButtonDropdown
    items={[
      { id: 'start', text: 'Start' },
      { id: 'stop', text: 'Stop', disabled: true },
      { id: 'terminate', text: 'Terminate' },
    ]}
    ariaLabel="Control instance"
    variant="icon"
  />
);

const defaultData: Item[] = [
  {
    id: '1',
    title: 'Item 1',
    description: 'Description 1',
    hasActions: true,
    items: [
      {
        id: '1.1',
        title: 'Item 1.1',
        description: 'Description 1.1',
        hasActions: true,
      },
      {
        id: '1.2',
        title: 'Item 1.2',
        description: 'Description 1.2',
        items: [
          {
            id: '1.2.1',
            title: 'Item 1.2.1',
            description: 'Description 1.2.1',
            hasActions: true,
          },
        ],
      },
      {
        id: '1.3',
        title: 'Item 1.3',
        description: 'Description 1.3',
        items: [
          {
            id: '1.3.1',
            title: 'Item 1.3.1',
            description: 'Description 1.3.1',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: (
      <Popover content="This is a popover" dismissButton={false}>
        Item 2
      </Popover>
    ),
    hasActions: true,
    description: <Link href="#">Link in description</Link>,
  },
  {
    id: '3',
    title: 'Item 3',
    description: 'Description 3',
  },
];

const defaultProps: TreeViewProps<Item> = {
  items: defaultData,
  getItemId: item => item.id,
  getItemChildren: item => item.items,
  renderItem: item => ({
    icon: <Icon name="folder" />,
    content: item.title,
    secondaryContent: item.description,
    actions: item.hasActions ? defaultActions : undefined,
  }),
};

function renderTreeView(props: Partial<TreeViewProps<Item>> = {}) {
  const { container, rerender } = render(<TreeView {...defaultProps} {...props} />);
  const wrapper = createWrapper(container).findTreeView()!;
  return { wrapper, rerender };
}

test('should render with only content', () => {
  const { wrapper } = renderTreeView({ renderItem: item => ({ content: item.title }) });

  const items = wrapper.findItems();
  expect(items).toHaveLength(3);

  items.forEach((item, index) => {
    expect(item.findContent()?.getElement()).toHaveTextContent(`Item ${index + 1}`);
    expect(item.findIcon()).toBeNull();
    expect(item.findSecondaryContent()).toBeNull();
    expect(item.findActions()).toBeNull();
  });
});

test('should render with various slots', () => {
  const { wrapper } = renderTreeView();

  const items = wrapper.findItems();
  expect(items).toHaveLength(3);

  defaultData.forEach((data, index) => {
    const item = items[index];

    expect(item.findContent()!.getElement()).toHaveTextContent(`Item ${index + 1}`);
    expect(item.findIcon()!.getElement()).toBeVisible();
    if (data.description) {
      expect(item.findSecondaryContent()!.getElement()).toBeVisible();

      if (index !== 1) {
        // index 1 (item 2)'s description is a link
        expect(item.findSecondaryContent()!.getElement()).toHaveTextContent(`Description ${index + 1}`);
      }
    }
    if (data.hasActions) {
      expect(item.findActions()!.findButtonDropdown()!.getElement()).toBeVisible();
    }
  });
});

test('should render with other components inside', () => {
  const { wrapper } = renderTreeView();

  const item = wrapper.findItemById('2')!;

  const contentPopover = item.findContent()!.findPopover()!;
  const descriptionLink = item.findSecondaryContent()!.findLink()!;
  const actionsButtonDropdown = item.findActions()!.findButtonDropdown()!;

  expect(contentPopover.getElement()).toBeVisible();
  expect(descriptionLink.getElement()).toBeVisible();
  expect(actionsButtonDropdown.getElement()).toBeVisible();

  contentPopover.findTrigger().click();
  expect(contentPopover.findContent()?.getElement()).toHaveTextContent('This is a popover');

  actionsButtonDropdown.findNativeButton().click();
  expect(actionsButtonDropdown.findItems()).toHaveLength(3);
});

test('expand/collapse state should be controlled by expandedItems', () => {
  const expandedItems = ['1', '1.2'];
  const { wrapper, rerender } = renderTreeView({
    expandedItems,
    onItemToggle: () => {},
  });
  expect(wrapper.findItems({ expanded: true })).toHaveLength(2);

  rerender(<TreeView {...defaultProps} expandedItems={[...expandedItems, '1.3']} />);
  expect(wrapper.findItems({ expanded: true })).toHaveLength(3);

  rerender(<TreeView {...defaultProps} expandedItems={['1']} />);
  expect(wrapper.findItems({ expanded: true })).toHaveLength(1);
});

test('should warn when expandedItems is provided without onItemToggle', () => {
  renderTreeView({
    expandedItems: [],
  });

  expect(warnOnce).toHaveBeenCalledWith(
    'TreeView',
    'You provided a `expandedItems` prop without an `onItemToggle` handler. This will render a non-interactive component.'
  );
});
