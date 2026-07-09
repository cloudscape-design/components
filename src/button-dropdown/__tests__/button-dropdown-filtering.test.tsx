// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import { scrollElementIntoView } from '../../../lib/components/internal/utils/scrollable-containers';
import createWrapper from '../../../lib/components/test-utils/dom';
import ButtonDropdownWrapper from '../../../lib/components/test-utils/dom/button-dropdown';
import { KeyCode } from '../../internal/keycode';

jest.mock('../../../lib/components/internal/utils/scrollable-containers', () => ({
  ...jest.requireActual('../../../lib/components/internal/utils/scrollable-containers'),
  scrollElementIntoView: jest.fn(),
}));

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'Cut' },
  { id: 'i2', text: 'Copy' },
  { id: 'i3', text: 'Paste' },
  { id: 'i4', text: 'Undo', secondaryText: 'Revert last action' },
];

const expandableItems: ButtonDropdownProps.Items = [
  { id: 'connect', text: 'Connect' },
  {
    id: 'states',
    text: 'Instance state',
    items: [
      { id: 'start', text: 'Start' },
      { id: 'stop', text: 'Stop' },
    ],
  },
];

const nestedExpandableItems: ButtonDropdownProps.Items = [
  { id: 'connect', text: 'Connect' },
  {
    id: 'actions',
    text: 'Actions',
    items: [
      {
        id: 'states',
        text: 'Instance state',
        items: [
          { id: 'start', text: 'Start instance' },
          { id: 'stop', text: 'Stop instance' },
          { id: 'reboot', text: 'Reboot instance' },
        ],
      },
      { id: 'terminate', text: 'Terminate' },
    ],
  },
];

function renderDropdown(props: Partial<ButtonDropdownProps> = {}) {
  const result = render(
    <ButtonDropdown items={items} ariaLabel="Actions" {...props}>
      Actions
    </ButtonDropdown>
  );
  const wrapper = createWrapper(result.container).findButtonDropdown()!;
  return { ...result, wrapper };
}

function getFilterInput(container: HTMLElement): HTMLInputElement | null {
  return createWrapper(container).findButtonDropdown()!.findFilteringInput()?.findNativeInput().getElement() ?? null;
}

function getMenuItems(wrapper: ButtonDropdownWrapper): HTMLElement[] {
  return wrapper.findItems().map(item => item.find('[role="menuitem"], [role="menuitemcheckbox"]')!.getElement());
}

describe('Button dropdown filtering', () => {
  beforeEach(() => {
    jest.mocked(scrollElementIntoView).mockClear();
  });

  describe('Filter input', () => {
    test('does not render filter input when filteringType is not set', () => {
      const { container, wrapper } = renderDropdown();
      wrapper.openDropdown();
      expect(getFilterInput(container)).toBeNull();
    });

    test('does not render filter input when filteringType="none"', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'none' });
      wrapper.openDropdown();
      expect(getFilterInput(container)).toBeNull();
    });

    test('renders filter input when filteringType="auto"', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      const input = getFilterInput(container)!;
      expect(input).not.toBeNull();
      expect(input.getAttribute('role')).toBe('combobox');
      expect(input.getAttribute('aria-expanded')).toBe('true');
    });

    test('filter input has aria-controls pointing to the menu', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      const input = getFilterInput(container)!;
      const menuId = input.getAttribute('aria-controls');
      expect(menuId).toBeTruthy();
      const menu = container.querySelector(`#${menuId}`);
      expect(menu).not.toBeNull();
      expect(menu!.getAttribute('role')).toBe('menu');
    });
  });

  describe('No match state', () => {
    test('does not render the no match state when there are matching items', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto', noMatch: 'No actions found' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');
      expect(wrapper.findFooterRegion()).toBeNull();
    });

    test('renders the provided noMatch content when there are no matches', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto', noMatch: 'No actions found' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('zzz');
      const noMatch = wrapper.findFooterRegion();
      expect(noMatch).not.toBeNull();
      expect(noMatch!.getElement()).toHaveTextContent('No actions found');
    });
  });

  describe('aria-activedescendant', () => {
    test('aria-activedescendant is empty when no item is highlighted', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      const input = getFilterInput(container)!;
      expect(input.getAttribute('aria-activedescendant')).toBe('');
    });

    test('aria-activedescendant updates when navigating with arrow keys', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      const input = getFilterInput(container)!;

      wrapper.findOpenDropdown()!.keydown(KeyCode.down);

      const activedescendant = input.getAttribute('aria-activedescendant');
      expect(activedescendant).toBeTruthy();
      expect(activedescendant).not.toBe('');

      const highlightedEl = container.querySelector(`#${activedescendant}`);
      expect(highlightedEl).not.toBeNull();
      expect(highlightedEl!.getAttribute('role')).toBe('menuitem');
    });

    test('menu items have id attributes when filtering is active', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      const menuItems = getMenuItems(wrapper);
      const itemsWithId = menuItems.filter(el => el.id);
      expect(itemsWithId.length).toBe(items.length);
    });

    test('aria-activedescendant references expandable group headers', () => {
      const { container, wrapper } = renderDropdown({
        filteringType: 'auto',
        items: expandableItems,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      const input = getFilterInput(container)!;

      const dropdown = wrapper.findOpenDropdown()!;
      // Arrow down twice to reach the expandable group header
      dropdown.keydown(KeyCode.down);
      dropdown.keydown(KeyCode.down);

      const activedescendant = input.getAttribute('aria-activedescendant');
      expect(activedescendant).toContain('states');
      const el = container.querySelector(`#${activedescendant}`);
      expect(el).not.toBeNull();
    });
  });

  describe('focus behavior', () => {
    test('filter input receives focus when dropdown opens', async () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();

      await act(async () => {
        await new Promise(resolve => requestAnimationFrame(resolve));
      });

      const input = getFilterInput(container)!;
      expect(document.activeElement).toBe(input);
    });

    test('focus stays on filter input when navigating items with arrow keys', async () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      await act(async () => {
        await new Promise(resolve => requestAnimationFrame(resolve));
      });

      const input = getFilterInput(container)!;

      wrapper.findOpenDropdown()!.keydown(KeyCode.down);

      expect(document.activeElement).toBe(input);
    });

    test('focus stays on filter input when hovering menu items', async () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      await act(async () => {
        await new Promise(resolve => requestAnimationFrame(resolve));
      });

      const input = getFilterInput(container)!;
      const menuItemLi = wrapper.findItems()[0].getElement();

      act(() => {
        fireEvent.mouseEnter(menuItemLi);
      });

      expect(document.activeElement).toBe(input);
    });

    test('without filtering, highlighted items receive DOM focus', () => {
      const { wrapper } = renderDropdown();
      wrapper.openDropdown();

      wrapper.findOpenDropdown()!.keydown(KeyCode.down);

      const focused = document.activeElement as HTMLElement;
      expect(focused.getAttribute('role')).toBe('menuitem');
    });

    test('all menu items have tabIndex=-1 when filtering is active', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();

      wrapper.findOpenDropdown()!.keydown(KeyCode.down);

      const menuItems = getMenuItems(wrapper);
      menuItems.forEach(item => {
        expect(item.getAttribute('tabindex')).toBe('-1');
      });
    });

    test('scrolls the highlighted item into view when navigating with arrow keys while filtering', async () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      await act(async () => {
        await new Promise(resolve => requestAnimationFrame(resolve));
      });
      expect(scrollElementIntoView).not.toHaveBeenCalled();

      wrapper.findOpenDropdown()!.keydown(KeyCode.down);

      // The highlighted item is scrolled into view since focus stays on the filter input.
      expect(scrollElementIntoView).toHaveBeenCalled();
      const highlightedEl = wrapper.findHighlightedItem()!.find('[role="menuitem"]')!.getElement();
      expect(scrollElementIntoView).toHaveBeenCalledWith(highlightedEl);
    });

    test('returns focus to trigger when focus leaves the dropdown with expandToViewport and filtering', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto', expandToViewport: true });
      wrapper.openDropdown();

      // Simulate focus leaving the dropdown
      wrapper.findFilteringInput()!.findNativeInput().blur();

      expect(wrapper.findOpenDropdown()).toBeNull();
      expect(document.activeElement).toBe(wrapper.findNativeButton().getElement());
    });
  });

  describe('trigger aria attributes', () => {
    test('trigger has aria-haspopup="dialog" when filtering is enabled', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      expect(wrapper.findNativeButton().getElement().getAttribute('aria-haspopup')).toBe('dialog');
    });

    test('trigger has aria-haspopup="true" when filtering is not enabled', () => {
      const { wrapper } = renderDropdown();
      expect(wrapper.findNativeButton().getElement().getAttribute('aria-haspopup')).toBe('true');
    });
  });

  describe('keyboard behavior', () => {
    test('opening with ArrowDown does not highlight an item when filtering is enabled', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.findNativeButton().keydown(KeyCode.down);
      expect(wrapper.findOpenDropdown()).not.toBeNull();
      expect(wrapper.findHighlightedItem()).toBeNull();
    });

    test('opening with ArrowUp does not highlight an item when filtering is enabled', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.findNativeButton().keydown(KeyCode.up);
      expect(wrapper.findOpenDropdown()).not.toBeNull();
      expect(wrapper.findHighlightedItem()).toBeNull();
    });

    test('Escape closes the dropdown', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.keydown(KeyCode.escape);
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('Escape closes the dropdown when filtering input has text', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cu');
      wrapper.findFilteringInput()!.keydown(KeyCode.escape);
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('Space does not activate the highlighted item while filtering', () => {
      const onItemClick = jest.fn();
      const { wrapper } = renderDropdown({ filteringType: 'auto', onItemClick });
      wrapper.openDropdown();
      wrapper.findOpenDropdown()!.keydown(KeyCode.down);
      wrapper.findFilteringInput()!.findNativeInput().keyup(KeyCode.space);
      expect(onItemClick).not.toHaveBeenCalled();
    });

    test('Enter does nothing when no item is highlighted while filtering', () => {
      const onItemClick = jest.fn();
      const { wrapper } = renderDropdown({ filteringType: 'auto', onItemClick });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      // No item is highlighted (typing resets the highlight), so Enter must not select
      // anything and must keep the dropdown open, matching select/multiselect.
      wrapper.findFilteringInput()!.findNativeInput().keydown(KeyCode.enter);
      expect(onItemClick).not.toHaveBeenCalled();
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('Enter activates the highlighted item while filtering', () => {
      const onItemClick = jest.fn();
      const { wrapper } = renderDropdown({ filteringType: 'auto', onItemClick });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      const input = wrapper.findFilteringInput()!.findNativeInput();
      input.keydown(KeyCode.down);
      input.keydown(KeyCode.enter);
      expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'i1' } }));
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('Enter activates the highlighted item without filtering', () => {
      const onItemClick = jest.fn();
      const { wrapper } = renderDropdown({ onItemClick });
      wrapper.openDropdown();

      // The first item is already highlighted when opened without filtering.
      // Enter on a non-link item triggers preventDefault and activates it.
      wrapper.findOpenDropdown()!.keydown(KeyCode.enter);

      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ detail: expect.objectContaining({ id: 'i1' }) })
      );
    });

    test('Left and Right arrow keys do not expand groups while filtering', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        items: expandableItems,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Instance');

      const input = wrapper.findFilteringInput()!.findNativeInput();
      input.keydown(KeyCode.right);
      input.keydown(KeyCode.left);
      // Filtering renders groups flat, so the nested items are visible regardless of expansion.
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('Tab closes the dropdown when filtering is disabled', () => {
      const { wrapper } = renderDropdown();
      wrapper.openDropdown();
      expect(wrapper.findOpenDropdown()).not.toBeNull();

      wrapper.findHighlightedItem()!.keydown(KeyCode.tab);
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('Tab with expandToViewport returns focus to trigger and closes dropdown', () => {
      const { wrapper } = renderDropdown({ expandToViewport: true });
      wrapper.openDropdown();
      expect(wrapper.findOpenDropdown()).not.toBeNull();

      wrapper.findHighlightedItem()!.keydown(KeyCode.tab);
      expect(wrapper.findOpenDropdown()).toBeNull();
      expect(document.activeElement).toBe(wrapper.findNativeButton().getElement());
    });

    test('Tab does not close the dropdown when filtering is enabled', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      expect(wrapper.findOpenDropdown()).not.toBeNull();

      wrapper.findFilteringInput()!.keydown(KeyCode.tab);
      // Dropdown stays open because Tab is handled by onDropdownFocusLeave in filtering mode
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });
  });

  describe('filtering value reset', () => {
    test('reopening the dropdown clears the previous filtering value', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');
      expect(getFilterInput(container)!.value).toBe('Cut');

      // Clicking the trigger while open toggles the dropdown closed and resets the filter.
      wrapper.openDropdown();
      // Reopen the dropdown.
      wrapper.openDropdown();
      expect(getFilterInput(container)!.value).toBe('');
    });

    test('activating a filtered item closes the dropdown and resets the filter', () => {
      const onItemClick = jest.fn();
      const { container, wrapper } = renderDropdown({ filteringType: 'auto', onItemClick });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Copy');

      wrapper.findItemById('i2')!.click();
      expect(onItemClick).toHaveBeenCalledTimes(1);
      expect(wrapper.findOpenDropdown()).toBeNull();

      wrapper.openDropdown();
      expect(getFilterInput(container)!.value).toBe('');
    });
  });

  describe('match highlighting', () => {
    const richItems: ButtonDropdownProps.Items = [
      { id: 'i1', text: 'Copy', secondaryText: 'Copy selection', labelTag: 'Copyable' },
    ];

    test('highlights the matching part of the item text, secondary text, and label tag', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto', items: richItems });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cop');

      const marks = container.querySelectorAll('mark');
      // text, secondaryText and labelTag each contain a highlighted match.
      expect(marks.length).toBeGreaterThanOrEqual(3);
      marks.forEach(mark => expect(mark.textContent?.toLowerCase()).toBe('cop'));
    });

    test('does not highlight anything when there is no filtering value', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto', items: richItems });
      wrapper.openDropdown();
      expect(container.querySelectorAll('mark')).toHaveLength(0);
    });
  });

  describe('filtered expandable groups', () => {
    test('renders matching nested items and collapses expandable groups', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        items: expandableItems,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Start');

      expect(wrapper.findExpandableCategoryById('states')).toBeNull(); // Category is no longer expandable
      expect(getMenuItems(wrapper)).toHaveLength(1); // Excluding groups
      expect(wrapper.findItemById('start')).not.toBeNull();
    });

    test('prevents focus stealing on mouse down for expandable categories while filtering is enabled', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        items: expandableItems,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      expect(wrapper.findFilteringInput()!.findNativeInput().getElement()).toHaveFocus();
      wrapper.findExpandableCategoryById('states')!.click();
      expect(wrapper.findFilteringInput()!.findNativeInput().getElement()).toHaveFocus();
    });

    test('does not prevent mouse down for expandable categories without filtering', () => {
      const { wrapper } = renderDropdown({ items: expandableItems, expandableGroups: true });
      wrapper.openDropdown();
      const categoryEl = wrapper.findExpandableCategoryById('states')!;
      categoryEl.click();
      // Clicking on a category moves focus to the first item in the category.
      const startMenuItemEl = wrapper.findItemById('start')!;
      expect(startMenuItemEl.find('[role=menuitem]')!.getElement()).toHaveFocus();
    });

    test('flattens matching items from nested groups into the top-level group', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        items: nestedExpandableItems,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Reboot');

      // The deeply-nested "Reboot instance" item should surface as a result
      // under the top-level "Actions" group header.
      const menuItems = getMenuItems(wrapper);
      expect(menuItems.length).toBe(1);
      expect(menuItems[0]).toHaveTextContent('Reboot instance');
    });
  });

  describe('filtering results text', () => {
    test('does not render filtering results text by default', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('C');
      expect(wrapper.findFooterRegion()).toBeNull();
    });

    test('does not render filtering results text when filter input is empty', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        filteringResultsText: (matchesCount, totalCount) => `${matchesCount} of ${totalCount} items`,
      });
      wrapper.openDropdown();
      expect(wrapper.findFooterRegion()).toBeNull();
    });

    test('renders filtering results text with correct counts when filtering produces matches', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        filteringResultsText: (matchesCount, totalCount) => `${matchesCount} of ${totalCount} items`,
      });
      wrapper.openDropdown();
      // "Co" matches "Copy" => 1 of 4 items
      wrapper.findFilteringInput()!.setInputValue('Co');
      const footer = wrapper.findFooterRegion();
      expect(footer).not.toBeNull();
      expect(footer!.getElement()).toHaveTextContent('1 of 4 items');
    });

    test('does not render filtering results text when there are no matches', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        filteringResultsText: (matchesCount, totalCount) => `${matchesCount} of ${totalCount} items`,
        noMatch: 'No items found',
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('zzz');
      const footer = wrapper.findFooterRegion();
      // The noMatch content is shown, not the filteringResultsText
      expect(footer).not.toBeNull();
      expect(footer!.getElement()).toHaveTextContent('No items found');
    });

    test('counts leaf items in groups for totalCount', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        items: expandableItems,
        expandableGroups: true,
        filteringResultsText: (matchesCount, totalCount) => `${matchesCount} of ${totalCount} items`,
      });
      wrapper.openDropdown();
      // "St" matches "Start" and "Stop" (2 leaf items), expandableItems has 3 leaf items total
      wrapper.findFilteringInput()!.setInputValue('St');
      const footer = wrapper.findFooterRegion();
      expect(footer).not.toBeNull();
      expect(footer!.getElement()).toHaveTextContent('2 of 3 items');
    });
  });

  describe('i18nStrings.filteringItemAriaDescription', () => {
    test('menu items do not have an accessible description when i18nStrings is not provided', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('C');
      const menuItems = getMenuItems(wrapper);
      menuItems.forEach(menuItem => {
        expect(menuItem).not.toHaveAccessibleDescription();
      });
    });

    test('menu items have the filtering description as their accessible description', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        i18nStrings: { filteringItemAriaDescription: 'Continue typing to further filter the list' },
      });
      wrapper.openDropdown();
      const menuItems = getMenuItems(wrapper);
      menuItems.forEach(menuItem => {
        expect(menuItem).toHaveAccessibleDescription('Continue typing to further filter the list');
      });
    });

    test('disabled item with disabledReason includes both descriptions', () => {
      const disabledItems: ButtonDropdownProps.Items = [
        { id: 'i1', text: 'Cut', disabled: true, disabledReason: 'Not available' },
        { id: 'i2', text: 'Copy' },
      ];
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        items: disabledItems,
        i18nStrings: { filteringItemAriaDescription: 'Continue typing to further filter the list' },
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('C');

      // The disabled item should have both descriptions combined
      const disabledMenuItem = wrapper.findItemById('i1')!.find('[role="menuitem"]')!.getElement();
      expect(disabledMenuItem).toHaveAccessibleDescription('Not available Continue typing to further filter the list');

      // The non-disabled item should only have the filtering description
      const enabledMenuItem = wrapper.findItemById('i2')!.find('[role="menuitem"]')!.getElement();
      expect(enabledMenuItem).toHaveAccessibleDescription('Continue typing to further filter the list');
    });
  });

  describe('disabled reason', () => {
    const disabledItems: ButtonDropdownProps.Items = [
      { id: 'i1', text: 'Cut' },
      { id: 'i2', text: 'Copy', disabled: true, disabledReason: 'Cannot copy right now' },
      { id: 'i3', text: 'Paste' },
    ];

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test('opens tooltip when a disabled item with disabledReason is highlighted via keyboard while filtering', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto', items: disabledItems });
      wrapper.openDropdown();

      // Navigate down twice to reach the disabled item
      wrapper.findOpenDropdown()!.keydown(KeyCode.down);
      wrapper.findOpenDropdown()!.keydown(KeyCode.down);

      // Wait for open delay
      act(() => jest.advanceTimersByTime(200));

      expect(wrapper.findDisabledReason()).not.toBeNull();
      expect(wrapper.findDisabledReason()!.getElement()).toHaveTextContent('Cannot copy right now');
    });

    test('closes tooltip when highlight moves away from disabled item while filtering', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto', items: disabledItems });
      wrapper.openDropdown();

      // Navigate to the disabled item
      wrapper.findOpenDropdown()!.keydown(KeyCode.down);
      wrapper.findOpenDropdown()!.keydown(KeyCode.down);

      // Wait for open delay
      act(() => jest.advanceTimersByTime(200));
      expect(wrapper.findDisabledReason()).not.toBeNull();

      // Move highlight away
      wrapper.findOpenDropdown()!.keydown(KeyCode.down);
      expect(wrapper.findDisabledReason()).toBeNull();
    });
  });

  test('passes filterText to renderItem for different item types', () => {
    const items: ButtonDropdownProps.Items = [
      { id: 'i1', text: 'Cut' },
      { id: 'c1', itemType: 'checkbox', text: 'Toggle feature', checked: true },
      ...expandableItems,
    ];

    const renderItem = jest.fn(() => null);
    const { wrapper } = renderDropdown({ filteringType: 'auto', items, expandableGroups: true, renderItem });
    wrapper.openDropdown();

    wrapper.findFilteringInput()!.setInputValue('Cu');
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        filterText: 'Cu',
        item: expect.objectContaining({
          type: 'action',
          option: expect.objectContaining({ id: 'i1', text: 'Cut' }),
        }),
      })
    );

    wrapper.findFilteringInput()!.setInputValue('Toggle');
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        filterText: 'Toggle',
        item: expect.objectContaining({
          type: 'checkbox',
          option: expect.objectContaining({ id: 'c1', text: 'Toggle feature' }),
        }),
      })
    );

    wrapper.findFilteringInput()!.setInputValue('Start');
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        filterText: 'Start',
        item: expect.objectContaining({
          type: 'group',
          option: expect.objectContaining({ id: 'states', text: 'Instance state' }),
        }),
      })
    );
  });
});
