// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

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

  test('shows loading status inside expanded group without a border when items are empty', () => {
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
    // g1 has no items yet - status renders via DropdownStatus (no DropdownFooter border)
    const groupStatus = wrapper.findStatusIndicator({ expandedGroupDropdown: true });
    expect(groupStatus).not.toBeNull();
    expect(groupStatus!.getElement()).toHaveTextContent('Loading group items');
  });
});
