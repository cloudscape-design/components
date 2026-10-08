// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

import mobileGroupStyles from '../../../lib/components/button-dropdown/mobile-expandable-group/styles.selectors.js';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

const groupItems: ButtonDropdownProps.Items = [
  { id: 'g1', text: 'Group 1', items: [] as ButtonDropdownProps.Items } as ButtonDropdownProps.ItemGroup,
  { id: 'g2', text: 'Group 2', items: [{ id: 'g2i1', text: 'Action 1' }] } as ButtonDropdownProps.ItemGroup,
];

function renderDropdown(props: Partial<ButtonDropdownProps> = {}) {
  const result = render(
    <ButtonDropdown items={groupItems} expandableGroups={true} {...props}>
      Actions
    </ButtonDropdown>
  );
  const wrapper = createWrapper(result.container).findButtonDropdown()!;
  return { ...result, wrapper };
}

function findOpenMobileGroup(wrapper: ReturnType<typeof renderDropdown>['wrapper']) {
  return wrapper.findOpenDropdown()!.find(`.${mobileGroupStyles.dropdown}[data-open=true]`);
}

describe('ButtonDropdown async loading with expandable groups on mobile', () => {
  test('renders the group inline instead of as a fly-out', () => {
    const { wrapper } = renderDropdown();
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g2')!.click();
    expect(findOpenMobileGroup(wrapper)).not.toBeNull();
    expect(wrapper.findExpandableCategoryById('g2')!.findAll('li').length).toBe(1);
  });

  test('shows the loading status inside an expanded group without items', () => {
    const { wrapper } = renderDropdown({
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'loading' : null),
      asyncLoadingProps: { loadingText: groupId => `Loading ${groupId}` },
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    expect(wrapper.findStatusIndicator({ expandedGroupDropdown: true })!.getElement()).toHaveTextContent('Loading g1');
  });

  test('shows the empty text when the group finished loading without items', () => {
    const { wrapper } = renderDropdown({
      getExpandableItemsAsyncLoadingState: () => 'finished',
      asyncLoadingProps: { empty: () => 'No actions in this group' },
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    expect(wrapper.findStatusIndicator({ expandedGroupDropdown: true })!.getElement()).toHaveTextContent(
      'No actions in this group'
    );
  });

  test('renders the finished text after the group items', () => {
    const { wrapper } = renderDropdown({
      getExpandableItemsAsyncLoadingState: () => 'finished',
      asyncLoadingProps: { finishedText: () => 'End of group' },
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g2')!.click();
    const group = findOpenMobileGroup(wrapper)!;
    const listItems = group.findAll('li');
    expect(listItems.length).toBe(2);
    expect(listItems[0].getElement()).toHaveTextContent('Action 1');
    expect(listItems[1].getElement()).toHaveTextContent('End of group');
  });

  test('shows the error status with a recovery button that reloads the group and keeps it expanded', () => {
    const onLoadItems = jest.fn();
    const { wrapper } = renderDropdown({
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: { errorText: () => 'Failed to load', recoveryText: 'Retry' },
      onLoadItems: event => onLoadItems(event.detail),
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    onLoadItems.mockClear();

    const recoveryButton = wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })!;
    expect(recoveryButton.getElement()).toHaveTextContent('Retry');
    recoveryButton.click();

    expect(onLoadItems).toHaveBeenCalledTimes(1);
    expect(onLoadItems).toHaveBeenCalledWith({
      filteringText: '',
      firstPage: false,
      samePage: true,
      expandedGroupId: 'g1',
    });
    expect(wrapper.findOpenDropdown()).not.toBeNull();
    expect(findOpenMobileGroup(wrapper)).not.toBeNull();
  });

  test('renders the error status outside the group menu and links it with aria-describedby', () => {
    const { wrapper } = renderDropdown({
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: { errorText: () => 'Failed to load', recoveryText: 'Retry' },
      onLoadItems: () => {},
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();

    const groupMenu = findOpenMobileGroup(wrapper)!.find('[role="menu"]')!.getElement();
    const recoveryButton = wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })!.getElement();
    expect(groupMenu).not.toContainElement(recoveryButton);
    const footer = document.getElementById(groupMenu.getAttribute('aria-describedby')!);
    expect(footer).toContainElement(recoveryButton);
  });

  test('does not render a recovery button without onLoadItems', () => {
    const { wrapper } = renderDropdown({
      getExpandableItemsAsyncLoadingState: ({ item }) => (item.id === 'g1' ? 'error' : null),
      asyncLoadingProps: { errorText: () => 'Failed to load', recoveryText: 'Retry' },
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g1')!.click();
    expect(wrapper.findStatusIndicator({ expandedGroupDropdown: true })!.getElement()).toHaveTextContent(
      'Failed to load'
    );
    expect(wrapper.findErrorRecoveryButton({ expandedGroupDropdown: true })).toBeNull();
  });

  test('shows no status inside a group that is not loaded asynchronously', () => {
    const { wrapper } = renderDropdown({
      asyncLoadingProps: { loadingText: () => 'Loading', empty: () => 'Empty' },
    });
    wrapper.openDropdown();
    wrapper.findExpandableCategoryById('g2')!.click();
    expect(wrapper.findStatusIndicator({ expandedGroupDropdown: true })).toBeNull();
  });
});
