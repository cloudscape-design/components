// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import { scrollElementIntoView } from '../../../lib/components/internal/utils/scrollable-containers';
import createWrapper from '../../../lib/components/test-utils/dom';
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

function getMenuItems(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"]'));
}

describe('ButtonDropdown filtering', () => {
  beforeEach(() => {
    jest.mocked(scrollElementIntoView).mockClear();
  });

  describe('filter input rendering', () => {
    test('does not render filter input when filteringType is not set', () => {
      const { container, wrapper } = renderDropdown();
      wrapper.openDropdown();
      expect(getFilterInput(container)).toBeNull();
    });

    test('renders filter input when filteringType="auto"', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      expect(getFilterInput(container)).not.toBeNull();
    });

    test('filter input has combobox role and aria-expanded', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      const input = getFilterInput(container)!;
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

  describe('no match state', () => {
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

    test('does not render a fallback no match state when noMatch is not provided', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('zzz');
      expect(wrapper.findFooterRegion()).toBeNull();
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

      const dropdownEl = wrapper.findOpenDropdown()!.getElement();
      act(() => {
        fireEvent.keyDown(dropdownEl, { keyCode: KeyCode.down });
      });

      const activedescendant = input.getAttribute('aria-activedescendant');
      expect(activedescendant).toBeTruthy();
      expect(activedescendant).not.toBe('');

      const highlightedEl = container.querySelector(`#${activedescendant}`);
      expect(highlightedEl).not.toBeNull();
      expect(highlightedEl!.getAttribute('role')).toBe('menuitem');
    });

    test('menu items have id attributes when filtering is active', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      const menuItems = getMenuItems(container);
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

      const dropdownEl = wrapper.findOpenDropdown()!.getElement();
      // Arrow down twice to reach the expandable group header
      act(() => {
        fireEvent.keyDown(dropdownEl, { keyCode: KeyCode.down });
      });
      act(() => {
        fireEvent.keyDown(dropdownEl, { keyCode: KeyCode.down });
      });

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
      const dropdownEl = wrapper.findOpenDropdown()!.getElement();

      act(() => {
        fireEvent.keyDown(dropdownEl, { keyCode: KeyCode.down });
      });

      expect(document.activeElement).toBe(input);
    });

    test('focus stays on filter input when hovering menu items', async () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      await act(async () => {
        await new Promise(resolve => requestAnimationFrame(resolve));
      });

      const input = getFilterInput(container)!;
      const menuItemLi = getMenuItems(container)[0].closest('li')!;

      act(() => {
        fireEvent.mouseEnter(menuItemLi);
      });

      expect(document.activeElement).toBe(input);
    });

    test('without filtering, highlighted items receive DOM focus', () => {
      const { wrapper } = renderDropdown();
      wrapper.openDropdown();

      const dropdownEl = wrapper.findOpenDropdown()!.getElement();
      act(() => {
        fireEvent.keyDown(dropdownEl, { keyCode: KeyCode.down });
      });

      const focused = document.activeElement as HTMLElement;
      expect(focused.getAttribute('role')).toBe('menuitem');
    });

    test('all menu items have tabIndex=-1 when filtering is active', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();

      const dropdownEl = wrapper.findOpenDropdown()!.getElement();
      act(() => {
        fireEvent.keyDown(dropdownEl, { keyCode: KeyCode.down });
      });

      const menuItems = getMenuItems(container);
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

      const dropdownEl = wrapper.findOpenDropdown()!.getElement();
      act(() => {
        fireEvent.keyDown(dropdownEl, { keyCode: KeyCode.down });
      });

      // The highlighted item is scrolled into view since focus stays on the filter input.
      expect(scrollElementIntoView).toHaveBeenCalled();
      const highlightedEl = wrapper.findHighlightedItem()!.find('[role="menuitem"]')!.getElement();
      expect(scrollElementIntoView).toHaveBeenCalledWith(highlightedEl);
    });

    test('without filtering, highlighted item gets tabIndex=0', () => {
      const { wrapper } = renderDropdown();
      wrapper.openDropdown();

      const dropdownEl = wrapper.findOpenDropdown()!.getElement();
      act(() => {
        fireEvent.keyDown(dropdownEl, { keyCode: KeyCode.down });
      });

      const highlightedItem = wrapper.findHighlightedItem()!.find('[role="menuitem"]')!.getElement();
      expect(highlightedItem.getAttribute('tabindex')).toBe('0');
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
      act(() => {
        fireEvent.keyDown(wrapper.findNativeButton().getElement(), { keyCode: KeyCode.down });
      });
      expect(wrapper.findOpenDropdown()).not.toBeNull();
      expect(wrapper.findHighlightedItem()).toBeNull();
    });

    test('opening with ArrowUp does not highlight an item when filtering is enabled', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      act(() => {
        fireEvent.keyDown(wrapper.findNativeButton().getElement(), { keyCode: KeyCode.up });
      });
      expect(wrapper.findOpenDropdown()).not.toBeNull();
      expect(wrapper.findHighlightedItem()).toBeNull();
    });

    test('opening with ArrowDown highlights the first item when filtering is not enabled', () => {
      const { wrapper } = renderDropdown();
      act(() => {
        fireEvent.keyDown(wrapper.findNativeButton().getElement(), { keyCode: KeyCode.down });
      });
      expect(wrapper.findHighlightedItem()).not.toBeNull();
    });

    test('Escape clears the filtering value before closing the dropdown', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');
      expect(getFilterInput(container)!.value).toBe('Cut');

      act(() => {
        fireEvent.keyDown(getFilterInput(container)!, { keyCode: KeyCode.escape });
      });
      // First Escape only clears the filter; the dropdown stays open.
      expect(wrapper.findOpenDropdown()).not.toBeNull();
      expect(getFilterInput(container)!.value).toBe('');

      act(() => {
        fireEvent.keyDown(getFilterInput(container)!, { keyCode: KeyCode.escape });
      });
      // Second Escape closes the dropdown.
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('Escape closes the dropdown directly when there is no filtering value', () => {
      const { wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      act(() => {
        fireEvent.keyDown(wrapper.findOpenDropdown()!.getElement(), { keyCode: KeyCode.escape });
      });
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('moving focus from the filter input to the clear button keeps the dropdown open', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      const input = getFilterInput(container)!;
      const clearButton = wrapper.findFilteringInput()!.findClearButton()!.getElement();
      act(() => {
        input.focus();
      });
      act(() => {
        clearButton.focus();
      });

      // Tabbing forward to the clear button stays within the dropdown, so it remains open.
      expect(document.activeElement).toBe(clearButton);
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('moving focus back from the clear button to the filter input keeps the dropdown open', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      const input = getFilterInput(container)!;
      const clearButton = wrapper.findFilteringInput()!.findClearButton()!.getElement();
      act(() => {
        clearButton.focus();
      });
      act(() => {
        input.focus();
      });

      // Shift+Tabbing back to the input stays within the dropdown, so it remains open.
      expect(document.activeElement).toBe(input);
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('moving focus out of the dropdown closes it', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      const input = getFilterInput(container)!;
      const outsideButton = document.createElement('button');
      document.body.appendChild(outsideButton);

      act(() => {
        input.focus();
      });
      act(() => {
        outsideButton.focus();
      });

      // Focus left the dropdown entirely, so it closes.
      expect(wrapper.findOpenDropdown()).toBeNull();

      document.body.removeChild(outsideButton);
    });

    test('Tab does not close the dropdown via keydown while filtering', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto' });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      const input = getFilterInput(container)!;
      act(() => {
        fireEvent.keyDown(input, { keyCode: KeyCode.tab });
      });

      // Closing is handled by focus leaving the dropdown, not by the Tab keydown itself.
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('moving focus between the filter input and clear button keeps the dropdown open with expandToViewport', () => {
      const { container, wrapper } = renderDropdown({ filteringType: 'auto', expandToViewport: true });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      const input = getFilterInput(container)!;
      const clearButton = wrapper.findFilteringInput()!.findClearButton()!.getElement();
      act(() => {
        input.focus();
      });
      act(() => {
        clearButton.focus();
      });

      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('Space does not activate the highlighted item while filtering', () => {
      const onItemClick = jest.fn();
      const { container, wrapper } = renderDropdown({ filteringType: 'auto', onItemClick });
      wrapper.openDropdown();
      act(() => {
        fireEvent.keyDown(wrapper.findOpenDropdown()!.getElement(), { keyCode: KeyCode.down });
      });
      act(() => {
        fireEvent.keyUp(getFilterInput(container)!, { keyCode: KeyCode.space });
      });
      expect(onItemClick).not.toHaveBeenCalled();
    });

    test('Enter does nothing when no item is highlighted while filtering', () => {
      const onItemClick = jest.fn();
      const { container, wrapper } = renderDropdown({ filteringType: 'auto', onItemClick });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      // No item is highlighted (typing resets the highlight), so Enter must not select
      // anything and must keep the dropdown open, matching select/multiselect.
      act(() => {
        fireEvent.keyDown(getFilterInput(container)!, { keyCode: KeyCode.enter });
      });
      expect(onItemClick).not.toHaveBeenCalled();
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('Enter activates the highlighted item while filtering', () => {
      const onItemClick = jest.fn();
      const { container, wrapper } = renderDropdown({ filteringType: 'auto', onItemClick });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Cut');

      const input = getFilterInput(container)!;
      act(() => {
        fireEvent.keyDown(input, { keyCode: KeyCode.down });
      });
      act(() => {
        fireEvent.keyDown(input, { keyCode: KeyCode.enter });
      });
      expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'i1' } }));
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('Left and Right arrow keys do not expand groups while filtering', () => {
      const { container, wrapper } = renderDropdown({
        filteringType: 'auto',
        items: expandableItems,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Instance');

      const input = getFilterInput(container)!;
      act(() => {
        fireEvent.keyDown(input, { keyCode: KeyCode.right });
      });
      act(() => {
        fireEvent.keyDown(input, { keyCode: KeyCode.left });
      });
      // Filtering renders groups flat, so the nested items are visible regardless of expansion.
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
    test('renders matching nested items with ids and non-focusable tab indexes', () => {
      const { container, wrapper } = renderDropdown({
        filteringType: 'auto',
        items: expandableItems,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Start');

      const menuItems = getMenuItems(container);
      expect(menuItems.length).toBeGreaterThan(0);
      menuItems.forEach(item => {
        expect(item.id).toBeTruthy();
        expect(item.getAttribute('tabindex')).toBe('-1');
      });
    });

    test('prevents focus stealing on mouse down for expandable categories while filtering is enabled', () => {
      const { wrapper } = renderDropdown({
        filteringType: 'auto',
        items: expandableItems,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      const categoryEl = wrapper.findExpandableCategoryById('states')!.getElement();
      // With filtering enabled the focus stays on the input, so mouse down is prevented on items.
      expect(fireEvent.mouseDown(categoryEl)).toBe(false);
    });

    test('does not prevent mouse down for expandable categories without filtering', () => {
      const { wrapper } = renderDropdown({ items: expandableItems, expandableGroups: true });
      wrapper.openDropdown();
      const categoryEl = wrapper.findExpandableCategoryById('states')!.getElement();
      expect(fireEvent.mouseDown(categoryEl)).toBe(true);
    });
  });
});
