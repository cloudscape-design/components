// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import { KeyCode } from '../../../lib/components/internal/keycode';
import createWrapper from '../../../lib/components/test-utils/dom';

import dropdownFooterStyles from '../../../lib/components/internal/components/dropdown-footer/styles.selectors.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'Cut' },
  { id: 'i2', text: 'Copy' },
  { id: 'i3', text: 'Paste' },
];

function renderDropdown(props: Partial<ButtonDropdownProps> = {}) {
  const result = render(
    <ButtonDropdown items={items} {...props}>
      Actions
    </ButtonDropdown>
  );
  const wrapper = createWrapper(result.container).findButtonDropdown()!;
  return { ...result, wrapper };
}

beforeEach(() => {
  jest.mocked(warnOnce).mockClear();
});

describe('ButtonDropdown async loading', () => {
  test('fires onLoadItems with empty filteringText when the dropdown opens', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
  });

  test('fires onLoadItems on open when the handler is attached after an earlier open without it', () => {
    const onLoadItems = jest.fn();
    const { wrapper, rerender } = renderDropdown({ filteringType: 'manual' });
    wrapper.openDropdown();
    wrapper.openDropdown();
    rerender(
      <ButtonDropdown items={items} filteringType="manual" onLoadItems={event => onLoadItems(event.detail)}>
        Actions
      </ButtonDropdown>
    );
    wrapper.openDropdown();
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
  });

  test('fires onLoadItems with firstPage=true when filteringText changes', async () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    onLoadItems.mockClear();
    wrapper.findFilteringInput()!.setInputValue('test');
    await waitFor(() =>
      expect(onLoadItems).toHaveBeenCalledWith({ filteringText: 'test', firstPage: true, samePage: false })
    );
  });

  test('does not fire onLoadItems again when filteringText has not changed', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    const callCount = onLoadItems.mock.calls.length;
    // Simulate a re-render without changing the text — no extra call expected.
    wrapper.openDropdown();
    expect(onLoadItems).toHaveBeenCalledTimes(callCount);
  });

  test('fires onLoadItems with samePage=true when the recovery button is clicked', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      asyncLoadingProps: {
        statusType: 'error',
        errorText: () => 'Error fetching items',
        recoveryText: 'Retry',
      },
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    onLoadItems.mockClear();
    const recoveryButton = wrapper.findErrorRecoveryButton()!;
    expect(recoveryButton).not.toBeNull();
    recoveryButton.click();
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: false, samePage: true });
  });

  test('requests the next page when the dropdown opens with statusType "pending" and the list does not fill it', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      asyncLoadingProps: { statusType: 'pending' },
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    // In addition to the first-page request fired on open, the list reports it is not scrollable yet.
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: false, samePage: false });
  });

  test('does not request the next page on open when statusType is "finished"', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      asyncLoadingProps: { statusType: 'finished' },
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    expect(onLoadItems).toHaveBeenCalledTimes(1);
    expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
  });

  test('does not apply client-side filtering when filteringType is "manual"', () => {
    const { wrapper } = renderDropdown({
      filteringType: 'manual',
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findFilteringInput()!.setInputValue('zzz');
    // All provided items remain visible — consumer is responsible for filtering.
    expect(wrapper.findItems()).toHaveLength(items.length);
  });

  test('applies client-side filtering when filteringType is "auto"', () => {
    const { wrapper } = renderDropdown({
      filteringType: 'auto',
    });
    wrapper.openDropdown();
    wrapper.findFilteringInput()!.setInputValue('Cut');
    expect(wrapper.findItems()).toHaveLength(1);
    expect(wrapper.findItems()[0].getElement()).toHaveTextContent('Cut');
  });

  test('warns if recoveryText is provided without onLoadItems', () => {
    renderDropdown({
      asyncLoadingProps: {
        statusType: 'error',
        errorText: () => 'Error',
        recoveryText: 'Retry',
      },
    });
    expect(warnOnce).toHaveBeenCalledWith(
      'ButtonDropdown',
      '`onLoadItems` must be provided for `recoveryText` to be displayed.'
    );
  });

  describe('recovery button keyboard access', () => {
    const errorProps: Partial<ButtonDropdownProps> = {
      asyncLoadingProps: { statusType: 'error', errorText: () => 'Error fetching items', recoveryText: 'Retry' },
    };

    test('Tab does not close the dropdown while the recovery button is shown', () => {
      const { wrapper } = renderDropdown({ ...errorProps, onLoadItems: () => {} });
      wrapper.openDropdown();
      wrapper.findHighlightedItem()!.keydown(KeyCode.tab);
      expect(wrapper.findOpenDropdown()).not.toBeNull();
      expect(wrapper.findErrorRecoveryButton()).not.toBeNull();
    });

    test('Tab closes the dropdown in error state when there is no recovery button', () => {
      const { wrapper } = renderDropdown({
        asyncLoadingProps: { statusType: 'error', errorText: () => 'Error fetching items' },
        onLoadItems: () => {},
      });
      wrapper.openDropdown();
      wrapper.findHighlightedItem()!.keydown(KeyCode.tab);
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('Enter on the recovery button retries without activating the highlighted item or closing the dropdown', () => {
      const onLoadItems = jest.fn();
      const onItemClick = jest.fn();
      const { wrapper } = renderDropdown({
        ...errorProps,
        onLoadItems: event => onLoadItems(event.detail),
        onItemClick,
      });
      wrapper.openDropdown();
      onLoadItems.mockClear();
      wrapper.findErrorRecoveryButton()!.keydown(KeyCode.enter);
      expect(onLoadItems).toHaveBeenCalledTimes(1);
      expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: false, samePage: true });
      expect(onItemClick).not.toHaveBeenCalled();
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('moves focus to the trigger after the recovery button is activated', () => {
      const { wrapper } = renderDropdown({ ...errorProps, onLoadItems: () => {} });
      wrapper.openDropdown();
      wrapper.findErrorRecoveryButton()!.click();
      expect(document.activeElement).toBe(wrapper.findNativeButton().getElement());
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('moves focus to the filter input after the recovery button is activated in filtering mode', () => {
      const { wrapper } = renderDropdown({ ...errorProps, filteringType: 'manual', onLoadItems: () => {} });
      wrapper.openDropdown();
      wrapper.findErrorRecoveryButton()!.click();
      expect(document.activeElement).toBe(wrapper.findFilteringInput()!.findNativeInput().getElement());
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });
  });
});

describe('ButtonDropdown status display', () => {
  test('shows loading status text when statusType is "loading"', () => {
    const { wrapper } = renderDropdown({
      asyncLoadingProps: {
        statusType: 'loading',
        loadingText: () => 'Loading actions',
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    const status = wrapper.findStatusIndicator();
    expect(status).not.toBeNull();
    expect(status!.getElement()).toHaveTextContent('Loading actions');
  });

  test('shows error status text when statusType is "error"', () => {
    const { wrapper } = renderDropdown({
      asyncLoadingProps: {
        statusType: 'error',
        errorText: () => 'Failed to load',
        recoveryText: 'Retry',
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    const status = wrapper.findStatusIndicator();
    expect(status).not.toBeNull();
    expect(status!.getElement()).toHaveTextContent('Failed to load');
  });

  test('shows finished text when statusType is "finished" and finishedText provided', () => {
    const { wrapper } = renderDropdown({
      asyncLoadingProps: {
        statusType: 'finished',
        finishedText: () => 'End of results',
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    const status = wrapper.findStatusIndicator();
    expect(status).not.toBeNull();
    expect(status!.getElement()).toHaveTextContent('End of results');
  });

  test('renders finished text inside the menu list after the last item, with a divider', () => {
    const { wrapper } = renderDropdown({
      asyncLoadingProps: { statusType: 'finished', finishedText: () => 'End of results' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    const menu = wrapper.findOpenDropdown()!.find('ul[role="menu"]')!.getElement();
    const status = wrapper.findStatusIndicator()!.getElement();
    // Scrolls together with the items instead of covering the last one.
    expect(menu.lastElementChild!.contains(status)).toBe(true);
    expect(menu.lastElementChild!.previousElementSibling).toBe(wrapper.findItemById('i3')!.getElement());
    // Divider between the last item and the text.
    expect(wrapper.findOpenDropdown()!.findByClassName(dropdownFooterStyles.root)!.getElement()).not.toHaveClass(
      dropdownFooterStyles['no-items']
    );
  });

  test('renders sticky status without the divider when there are no items', () => {
    const { wrapper } = renderDropdown({
      items: [],
      asyncLoadingProps: { statusType: 'loading', loadingText: () => 'Loading actions' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    expect(wrapper.findOpenDropdown()!.findByClassName(dropdownFooterStyles.root)!.getElement()).toHaveClass(
      dropdownFooterStyles['no-items']
    );
  });

  test('announces the status through a live region, also when there are no items', () => {
    const { wrapper } = renderDropdown({
      items: [],
      asyncLoadingProps: { statusType: 'loading', loadingText: () => 'Loading actions' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    const liveRegion = wrapper.findOpenDropdown()!.findLiveRegion();
    expect(liveRegion).not.toBeNull();
    expect(liveRegion!.getElement()).toHaveTextContent('Loading actions');
  });

  test('shows empty text when items are empty and statusType is "finished"', () => {
    const { wrapper } = renderDropdown({
      items: [],
      asyncLoadingProps: {
        statusType: 'finished',
        empty: () => 'No actions found',
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    const status = wrapper.findStatusIndicator();
    expect(status).not.toBeNull();
    expect(status!.getElement()).toHaveTextContent('No actions found');
  });

  test('shows no status indicator when statusType is "finished" with no special text', () => {
    const { wrapper } = renderDropdown({
      asyncLoadingProps: {
        statusType: 'finished',
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    expect(wrapper.findStatusIndicator()).toBeNull();
  });

  test('shows noMatch when filteringType="manual" and items are empty due to filtering', () => {
    const { wrapper } = renderDropdown({
      items: [],
      filteringType: 'manual',
      noMatch: <span>No actions match</span>,
      asyncLoadingProps: { statusType: 'finished', empty: () => 'No actions found' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findFilteringInput()!.setInputValue('xyz');
    const status = wrapper.findStatusIndicator();
    expect(status).not.toBeNull();
    expect(status!.getElement()).toHaveTextContent('No actions match');
  });
});

describe('ButtonDropdown async loading with expandable groups', () => {
  const groupItems: ButtonDropdownProps.Items = [
    { id: 'g1', text: 'Group 1', items: [] as ButtonDropdownProps.Items } as ButtonDropdownProps.ItemGroup,
    { id: 'g2', text: 'Group 2', items: [{ id: 'g2i1', text: 'Action 1' }] } as ButtonDropdownProps.ItemGroup,
  ];

  test('fires onLoadItems with expandedGroupId when an expandable group is opened', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'pending' : null),
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    onLoadItems.mockClear();
    wrapper.findExpandableCategoryById('g1')!.click();
    expect(onLoadItems).toHaveBeenCalledWith({
      filteringText: '',
      firstPage: true,
      samePage: false,
      expandedGroupId: 'g1',
    });
  });

  test('shows per-group loading status from getExpandableItemsAsyncLoadingState', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'loading' : null),
      asyncLoadingProps: {
        loadingText: (groupId?: string) => `Loading ${groupId ?? 'items'}`,
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    const groupStatus = wrapper.findStatusIndicator({ expandedGroupDropdown: true });
    expect(groupStatus).not.toBeNull();
    expect(groupStatus!.getElement()).toHaveTextContent('Loading g1');
  });

  test('shows recovery button inside expanded group when group status is "error"', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: {
        errorText: (groupId?: string) => `Error loading ${groupId ?? 'items'}`,
        recoveryText: 'Retry',
      },
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    const groupRecovery = wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true });
    expect(groupRecovery).not.toBeNull();
    onLoadItems.mockClear();
    groupRecovery!.click();
    expect(onLoadItems).toHaveBeenCalledWith(expect.objectContaining({ samePage: true, expandedGroupId: 'g1' }));
  });

  test('shows loading status inside expanded group without a divider when items are empty', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'loading' : null),
      asyncLoadingProps: {
        loadingText: () => 'Loading group items',
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    const groupStatus = wrapper.findStatusIndicator({ expandedGroupDropdown: true });
    expect(groupStatus).not.toBeNull();
    expect(groupStatus!.getElement()).toHaveTextContent('Loading group items');
    const groupDropdown = wrapper.findOpenDropdown()!.find('[data-open=true]')!;
    expect(groupDropdown.findByClassName(dropdownFooterStyles.root)!.getElement()).toHaveClass(
      dropdownFooterStyles['no-items']
    );
  });

  test('announces the group status through a live region', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'loading' : null),
      asyncLoadingProps: { loadingText: () => 'Loading group items' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    const liveRegion = wrapper.findOpenDropdown()!.find('[data-open=true]')!.findLiveRegion();
    expect(liveRegion).not.toBeNull();
    expect(liveRegion!.getElement()).toHaveTextContent('Loading group items');
  });

  test('renders group finished text inside the group menu after its items', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g2' ? 'finished' : null),
      asyncLoadingProps: { finishedText: (groupId?: string) => `End of ${groupId}` },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g2')!.click();
    const groupMenu = wrapper.findOpenDropdown()!.find('[data-open=true]')!.find('ul[role="menu"]')!.getElement();
    const status = wrapper.findStatusIndicator({ expandedGroupDropdown: true })!.getElement();
    expect(status).toHaveTextContent('End of g2');
    expect(groupMenu.lastElementChild!.contains(status)).toBe(true);
    expect(groupMenu.lastElementChild!.previousElementSibling).toBe(wrapper.findItemById('g2i1')!.getElement());
  });

  test('clicking the recovery button inside a group keeps the group expanded', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: { errorText: () => 'Error', recoveryText: 'Retry' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })!.click();
    expect(wrapper.findOpenDropdown()).not.toBeNull();
    expect(wrapper.findExpandableCategoryById('g1')!.find('[aria-expanded="true"]')).not.toBeNull();
  });

  test('fires a same-page request for the group when its recovery button is clicked', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: { errorText: () => 'Error', recoveryText: 'Retry' },
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    onLoadItems.mockClear();
    wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })!.click();
    expect(onLoadItems).toHaveBeenCalledTimes(1);
    expect(onLoadItems).toHaveBeenCalledWith({
      filteringText: '',
      firstPage: false,
      samePage: true,
      expandedGroupId: 'g1',
    });
  });

  test('moves focus to the group header after its recovery button is activated', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: { errorText: () => 'Error', recoveryText: 'Retry' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })!.click();
    expect(document.activeElement).toBe(
      wrapper.findExpandableCategoryById('g1')!.find('[aria-haspopup="true"]')!.getElement()
    );
    expect(wrapper.findOpenDropdown()).not.toBeNull();
  });

  test('moves focus to the filter input after a group recovery button is activated in filtering mode', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      filteringType: 'manual',
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: { errorText: () => 'Error', recoveryText: 'Retry' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    const recoveryButton = wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })!;
    // Tab from the filter input lands on the recovery button, so focus is no longer on the input.
    recoveryButton.focus();
    recoveryButton.click();
    expect(document.activeElement).toBe(wrapper.findFilteringInput()!.findNativeInput().getElement());
    expect(wrapper.findOpenDropdown()).not.toBeNull();
  });

  test('root status lookups ignore the status of an expanded group', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: {
        statusType: 'finished',
        finishedText: () => 'End of results',
        errorText: () => 'Error',
        recoveryText: 'Retry',
      },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    expect(wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })).not.toBeNull();
    expect(wrapper.findErrorRecoveryButton()).toBeNull();
    expect(wrapper.findStatusIndicator({ expandedGroupDropdown: true })!.getElement()).toHaveTextContent('Error');
    expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('End of results');
  });

  test('treats a group status of "pending" as "finished"', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: () => 'pending',
      asyncLoadingProps: { empty: () => 'No actions in this group', finishedText: () => 'End of group' },
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    expect(wrapper.findStatusIndicator({ expandedGroupDropdown: true })!.getElement()).toHaveTextContent(
      'No actions in this group'
    );
    wrapper.findExpandableCategoryById('g2')!.click();
    expect(wrapper.findStatusIndicator({ expandedGroupDropdown: true })!.getElement()).toHaveTextContent(
      'End of group'
    );
  });

  test('Tab does not close the dropdown while a group recovery button is shown', () => {
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: { errorText: () => 'Error', recoveryText: 'Retry' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    wrapper.findOpenDropdown()!.keydown(KeyCode.tab);
    expect(wrapper.findOpenDropdown()).not.toBeNull();
    expect(wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })).not.toBeNull();
  });

  test.each([
    ['right arrow', KeyCode.right],
    ['Enter', KeyCode.enter],
  ])('fires onLoadItems with expandedGroupId when a group is expanded with %s', (_, keyCode) => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'pending' : null),
      onLoadItems: event => onLoadItems(event.detail),
    });
    // Opening with the keyboard highlights the first group.
    wrapper.findNativeButton().keydown(KeyCode.down);
    onLoadItems.mockClear();
    wrapper.findOpenDropdown()!.keydown(keyCode);
    expect(onLoadItems).toHaveBeenCalledTimes(1);
    expect(onLoadItems).toHaveBeenCalledWith({
      filteringText: '',
      firstPage: true,
      samePage: false,
      expandedGroupId: 'g1',
    });
  });

  test('does not fire onLoadItems when a group is collapsed', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      items: groupItems,
      expandableGroups: true,
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g2')!.click();
    onLoadItems.mockClear();
    wrapper.findExpandableCategoryById('g2')!.click();
    expect(onLoadItems).not.toHaveBeenCalled();
  });
});
