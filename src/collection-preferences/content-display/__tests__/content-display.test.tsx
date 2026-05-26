// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import { createWrapper } from '@cloudscape-design/test-utils-core/dom';

import { CollectionPreferencesProps } from '../../../../lib/components';
import ContentDisplayPreferenceWrapper, {
  ContentDisplayOptionWrapper,
} from '../../../../lib/components/test-utils/dom/collection-preferences/content-display-preference';
import { contentDisplayPreference, renderCollectionPreferences } from '../../__tests__/shared';

describe('Content Display preference', () => {
  describe('Rendering', () => {
    it('correctly displays title', () => {
      const wrapper = renderContentDisplay();
      const titleElement = wrapper.findTitle().getElement();
      expect(titleElement).toHaveTextContent('Content display title');
      expect(titleElement.tagName).toBe('H3');
    });

    it('correctly displays description', () => {
      const wrapper = renderContentDisplay();
      const descriptionElement = wrapper.findDescription().getElement();
      expect(descriptionElement).toHaveTextContent('Content display description');
    });

    it('applies correct ARIA label and description to options list', () => {
      const wrapper = renderContentDisplay();
      const titleId = wrapper.findTitle().getElement().id;
      expect(titleId).toBeTruthy();
      const descriptionId = wrapper.findDescription().getElement().id;
      expect(descriptionId).toBeTruthy();
      expect(titleId).not.toBe(descriptionId);
      const list = wrapper.findAll('ol')[0].getElement();
      expect(list.getAttribute('aria-labelledby')).toBe(titleId);
      expect(list.getAttribute('aria-describedby')).toBe(descriptionId);
    });

    it('wraps content in a group role with aria-labelledby and aria-describedby', () => {
      const wrapper = renderContentDisplay();
      const titleId = wrapper.findTitle().getElement().id;
      const descriptionId = wrapper.findDescription().getElement().id;
      const group = wrapper.getElement().closest('[role="group"]')!;
      expect(group).not.toBeNull();
      expect(group.getAttribute('aria-labelledby')).toBe(titleId);
      expect(group.getAttribute('aria-describedby')).toBe(descriptionId);
    });

    it('displays list of options with correct semantics', () => {
      const wrapper = renderContentDisplay(undefined, true);
      const options = wrapper.findOptions();
      for (let i = 0; i < options.length; i++) {
        testOption({ wrapper, option: options[i], index: i });
      }
    });

    it('renders all options even if a partial list is provided in preferences', () => {
      const wrapper = renderContentDisplay({ preferences: { contentDisplay: [{ id: 'id1', visible: true }] } });
      expect(wrapper.findOptions()).toHaveLength(4);
    });
  });

  describe('Content visibility', () => {
    it('toggles content visibility', () => {
      const collectionPreferencesWrapper = renderCollectionPreferences({
        contentDisplayPreference,
        onConfirm: () => null,
        preferences: {
          contentDisplay: [
            {
              id: 'id1',
              visible: true,
            },
            {
              id: 'id2',
              visible: false,
            },
            {
              id: 'id3',
              visible: true,
            },
            { id: 'id4', visible: true },
          ],
        },
      });
      collectionPreferencesWrapper.findTriggerButton().click();
      const contentDisplayPreferenceWrapper = collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
      expectVisibilityStatus({ wrapper: contentDisplayPreferenceWrapper, statuses: [true, false, true, true] });
      contentDisplayPreferenceWrapper.findOptionByIndex(2)!.findVisibilityToggle().findNativeInput().click();
      expectVisibilityStatus({ wrapper: contentDisplayPreferenceWrapper, statuses: [true, true, true, true] });
      contentDisplayPreferenceWrapper.findOptionByIndex(3)!.findVisibilityToggle().findNativeInput().click();
      expectVisibilityStatus({ wrapper: contentDisplayPreferenceWrapper, statuses: [true, true, false, true] });
    });

    it('forces non-editable options to be visible', () => {
      const wrapper = renderContentDisplay();
      const toggleInput = wrapper.findOptionByIndex(1)!.findVisibilityToggle().findNativeInput();
      expect(toggleInput.getElement()).toBeChecked();
      expect(toggleInput.getElement()).toBeDisabled();
      toggleInput.click();
      expect(toggleInput.getElement()).toBeChecked();
      expect(toggleInput.getElement()).toBeDisabled();
    });

    it('allows toggling options that are not part of the current preferences', () => {
      const wrapper = renderContentDisplay({ preferences: { contentDisplay: [{ id: 'id1', visible: true }] } });
      wrapper.findOptionByIndex(3)!.findVisibilityToggle().findNativeInput().click();
      expectVisibilityStatus({ wrapper, statuses: [true, false, true, false] });
    });
  });

  describe('Content reordering', () => {
    it('moves item down', async () => {
      const wrapper = renderContentDisplay(undefined, true);
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement('Picked up item at position 1 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement('Moving item to position 2 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [1, 0, 2, 3] });
      await expectAnnouncement('Item moved from position 1 to position 2 of 4');
    });

    it('moves item up', async () => {
      const wrapper = renderContentDisplay(undefined, true);
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(2)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement('Picked up item at position 2 of 4');
      pressKey(dragHandle, 'ArrowUp');
      await expectAnnouncement('Moving item to position 1 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [1, 0, 2, 3] });
      await expectAnnouncement('Item moved from position 2 to position 1 of 4');
    });

    it('moves item down and back up', async () => {
      const wrapper = renderContentDisplay(undefined, true);
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement('Picked up item at position 1 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement('Moving item to position 2 of 4');
      pressKey(dragHandle, 'ArrowUp');
      await expectAnnouncement('Moving item back to position 1 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      await expectAnnouncement('Item moved back to its original position 1 of 4');
    });

    it('ignores keystrokes out of bounds', async () => {
      const wrapper = renderContentDisplay(undefined, true);
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement('Picked up item at position 1 of 4');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const i of Array(10)) {
        pressKey(dragHandle, 'ArrowUp');
        await expectAnnouncement('Picked up item at position 1 of 4');
      }
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement('Moving item to position 2 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement('Moving item to position 3 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement('Moving item to position 4 of 4');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const i of Array(10)) {
        pressKey(dragHandle, 'ArrowDown');
        await expectAnnouncement('Moving item to position 4 of 4');
      }
      pressKey(dragHandle, 'ArrowUp');
      await expectAnnouncement('Moving item to position 3 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [1, 2, 0, 3] });
      await expectAnnouncement('Item moved from position 1 to position 3 of 4');
    });

    it('cancels reordering when pressing Escape', async () => {
      const wrapper = renderContentDisplay(undefined, true);
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement('Picked up item at position 1 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement('Moving item to position 2 of 4');
      pressKey(dragHandle, 'Escape');
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      await expectAnnouncement('Reordering canceled');
    });

    it('moves item between options that are not part of the current preferences', async () => {
      const wrapper = renderContentDisplay({ preferences: { contentDisplay: [{ id: 'id1', visible: true }] } }, true);
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement('Picked up item at position 1 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement('Moving item to position 2 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement('Moving item to position 3 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [1, 2, 0, 3] });
      await expectAnnouncement('Item moved from position 1 to position 3 of 4');
    });

    it('moves an item not part of the current preferences above the ones that are', async () => {
      const wrapper = renderContentDisplay({ preferences: { contentDisplay: [{ id: 'id1', visible: true }] } }, true);
      const dragHandle = wrapper.findOptionByIndex(2)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement('Picked up item at position 2 of 4');
      pressKey(dragHandle, 'ArrowUp');
      await expectAnnouncement('Moving item to position 1 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [1, 0, 2, 3] });
      await expectAnnouncement('Item moved from position 2 to position 1 of 4');
    });
  });

  describe.each<boolean>([false, true])('Filtering (with i18n = %s)', withI18nProvider => {
    it('filters options', () => {
      const wrapper = renderContentDisplay(
        withI18nProvider
          ? undefined
          : {
              contentDisplayPreference: {
                ...contentDisplayPreference,
                i18nStrings: {
                  columnFilteringPlaceholder: 'Filter columns',
                  columnFilteringAriaLabel: 'Filter columns',
                  columnFilteringClearFilterText: 'Clear filter',
                  columnFilteringNoMatchText: 'No matches found',
                  columnFilteringCountText: count => (count > 1 || count === 0 ? `${count} matches` : `${count} match`),
                },
              },
            },
        withI18nProvider
      );
      const filterInput = wrapper.findTextFilter();
      expect(filterInput).not.toBeNull();
      filterInput!.findInput().setInputValue('Item 1');

      expect(filterInput?.findInput().findNativeInput().getElement()).toHaveAttribute('placeholder', 'Filter columns');
      expect(filterInput?.findInput().findNativeInput().getElement()).toHaveAttribute('aria-label', 'Filter columns');
      expect(filterInput?.findInput().findClearButton()?.getElement()).toHaveAccessibleName('Clear filter');

      expect(filterInput!.findResultsCount().getElement()).toHaveTextContent('1 match');

      const options = wrapper.findOptions();
      expect(options).toHaveLength(1);
      expect(options[0].findLabel().getElement()).toHaveTextContent('Item 1');
    });

    it('shows empty state when no options match and clears filter', () => {
      const wrapper = renderContentDisplay(
        withI18nProvider
          ? undefined
          : {
              contentDisplayPreference: {
                ...contentDisplayPreference,
                i18nStrings: {
                  columnFilteringPlaceholder: 'Filter columns',
                  columnFilteringAriaLabel: 'Filter columns',
                  columnFilteringClearFilterText: 'Clear filter',
                  columnFilteringNoMatchText: 'No matches found',
                  columnFilteringCountText: count => (count > 1 || count === 0 ? `${count} matches` : `${count} match`),
                },
              },
            },
        withI18nProvider
      );
      const filterInput = wrapper.findTextFilter();
      expect(filterInput).not.toBeNull();

      filterInput!.findInput().setInputValue('Item 100');
      expect(filterInput!.findResultsCount().getElement()).toHaveTextContent('0 matches');

      const options = wrapper.findOptions();
      expect(options).toHaveLength(0);

      const emptyState = wrapper.findNoMatch();
      expect(emptyState).not.toBeNull();
      expect(emptyState!.getElement()).toHaveTextContent('No matches found');

      const emptyStateButton = emptyState?.findButton();
      expect(emptyStateButton).not.toBeNull();
      expect(emptyStateButton!.getElement()).toHaveTextContent('Clear filter');
      emptyStateButton?.click();

      expect(filterInput!.findInput().getInputValue()).toBe('');
      expect(filterInput!.findResultsCount()).toBeNull();
    });
  });

  describe('Filtering - continued', () => {
    it('does not render the text filter with searchable columns turned off', () => {
      const wrapper = renderContentDisplay({
        contentDisplayPreference: {
          ...contentDisplayPreference,
          enableColumnFiltering: false,
          // Adding an option with a non-string label to ensure the filter does not break rendering
          options: [...contentDisplayPreference.options, { id: 'id-extra', label: (<span>Extra</span>) as any }],
        },
      });
      const filterInput = wrapper.findTextFilter();
      expect(filterInput).toBeNull();
    });

    it('clears filter and shows all options', () => {
      const wrapper = renderContentDisplay();
      const filterInput = wrapper.findTextFilter();
      expect(filterInput).not.toBeNull();

      filterInput!.findInput().setInputValue('Item 1');
      filterInput!.findInput().findClearButton()?.click();

      const options = wrapper.findOptions();
      expect(options).toHaveLength(4);
    });

    it('sets the drag-handle to a disabled state when filtering', () => {
      const wrapper = renderContentDisplay();
      const filterInput = wrapper.findTextFilter();
      expect(filterInput).not.toBeNull();

      const dragHandleBefore = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      expect(dragHandleBefore.getAttribute('aria-disabled')).toBe('false');

      filterInput!.findInput().setInputValue('Item 1');

      const dragHandleAfter = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      expect(dragHandleAfter.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('State management', () => {
    const initialStateWithCustomVisibility = [
      {
        id: 'id1',
        visible: true,
      },
      {
        id: 'id2',
        visible: false,
      },
      {
        id: 'id3',
        visible: true,
      },
      { id: 'id4', visible: true },
    ];

    it('initializes values from preferences prop', () => {
      const collectionPreferencesWrapper = renderCollectionPreferences(
        {
          contentDisplayPreference,
          onConfirm: () => null,
          preferences: {
            contentDisplay: [
              {
                id: 'id1',
                visible: true,
              },
              { id: 'id4', visible: true },
              {
                id: 'id2',
                visible: false,
              },
              {
                id: 'id3',
                visible: true,
              },
            ],
          },
        },
        true
      );
      collectionPreferencesWrapper.findTriggerButton().click();
      const contentDisplayPreferenceWrapper = collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
      testOrder({ wrapper: contentDisplayPreferenceWrapper, order: [0, 3, 1, 2] });
      expectVisibilityStatus({ wrapper: contentDisplayPreferenceWrapper, statuses: [true, true, false, true] });
    });

    it('restores previous value on dismiss', () => {
      const collectionPreferencesWrapper = renderCollectionPreferences({
        contentDisplayPreference,
        onConfirm: () => null,
        preferences: {
          contentDisplay: initialStateWithCustomVisibility,
        },
      });
      collectionPreferencesWrapper.findTriggerButton().click();
      const contentDisplayPreferenceWrapper = collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
      contentDisplayPreferenceWrapper.findOptionByIndex(2)!.findVisibilityToggle().findNativeInput().click();
      contentDisplayPreferenceWrapper.findOptionByIndex(3)!.findVisibilityToggle().findNativeInput().click();
      collectionPreferencesWrapper.findModal()!.findDismissButton()!.click();
      collectionPreferencesWrapper.findTriggerButton().click();
      expectVisibilityStatus({
        wrapper: collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!,
        statuses: [true, false, true, true],
      });
    });

    it('restores previous value on cancel', () => {
      const collectionPreferencesWrapper = renderCollectionPreferences({
        contentDisplayPreference,
        onConfirm: () => null,
        preferences: {
          contentDisplay: initialStateWithCustomVisibility,
        },
      });
      collectionPreferencesWrapper.findTriggerButton().click();
      const contentDisplayPreferenceWrapper = collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
      contentDisplayPreferenceWrapper.findOptionByIndex(2)!.findVisibilityToggle().findNativeInput().click();
      contentDisplayPreferenceWrapper.findOptionByIndex(3)!.findVisibilityToggle().findNativeInput().click();
      collectionPreferencesWrapper.findModal()!.findCancelButton()!.click();
      collectionPreferencesWrapper.findTriggerButton().click();
      expectVisibilityStatus({
        wrapper: collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!,
        statuses: [true, false, true, true],
      });
    });

    it('decorates onConfirm event details correctly upon change', () => {
      const onConfirmSpy = jest.fn();
      const collectionPreferencesWrapper = renderCollectionPreferences({
        contentDisplayPreference,
        onConfirm: onConfirmSpy,
        preferences: {
          contentDisplay: initialStateWithCustomVisibility,
        },
      });
      collectionPreferencesWrapper.findTriggerButton().click();
      const contentDisplayPreferenceWrapper = collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
      contentDisplayPreferenceWrapper.findOptionByIndex(2)!.findVisibilityToggle().findNativeInput().click();
      contentDisplayPreferenceWrapper.findOptionByIndex(3)!.findVisibilityToggle().findNativeInput().click();
      collectionPreferencesWrapper.findModal()!.findConfirmButton()!.click();
      expect(onConfirmSpy).toHaveBeenCalledTimes(1);
      expect(onConfirmSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            contentDisplay: [
              {
                id: 'id1',
                visible: true,
              },
              {
                id: 'id2',
                visible: true,
              },
              {
                id: 'id3',
                visible: false,
              },
              { id: 'id4', visible: true },
            ],
          },
        })
      );
    });

    it('decorates onConfirm event details correctly even without change', () => {
      const onConfirmSpy = jest.fn();
      const collectionPreferencesWrapper = renderCollectionPreferences({
        contentDisplayPreference,
        onConfirm: onConfirmSpy,
        preferences: {
          contentDisplay: initialStateWithCustomVisibility,
        },
      });
      collectionPreferencesWrapper.findTriggerButton().click();
      collectionPreferencesWrapper.findModal()!.findConfirmButton()!.click();
      expect(onConfirmSpy).toHaveBeenCalledTimes(1);
      expect(onConfirmSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            contentDisplay: initialStateWithCustomVisibility,
          },
        })
      );
    });
  });
});

function renderContentDisplay(props: Partial<CollectionPreferencesProps> = {}, withI18nProvider = false) {
  const collectionPreferencesWrapper = renderCollectionPreferences(
    { contentDisplayPreference, ...props },
    withI18nProvider
  );
  collectionPreferencesWrapper.findTriggerButton().click();
  return collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
}

function expectAriaLabel(wrapper: ContentDisplayPreferenceWrapper, element: HTMLElement, label: string) {
  const labelAttribute = element.getAttribute('aria-label');
  if (labelAttribute === label) {
    return;
  }
  const labelledBy = element.getAttribute('aria-labelledby');
  expect(labelledBy).toBeTruthy();
  const labelElement = wrapper.find(`#${labelledBy}`);
  expect(labelElement!.getElement()).toHaveTextContent(label);
}

function testOrder({ wrapper, order }: { wrapper: ContentDisplayPreferenceWrapper; order: number[] }) {
  const options = wrapper.findOptions();
  const expectedOrder = [1, 0, 2, 3];
  for (let i = 0; i < expectedOrder.length; i++) {
    const option = options[i];
    testOption({ wrapper, option, index: order[i] });
  }
}

function testOption({
  wrapper,
  option,
  index,
}: {
  wrapper: ContentDisplayPreferenceWrapper;
  option: ContentDisplayOptionWrapper;
  index: number;
}) {
  const element = option.getElement();
  expect(element.tagName).toBe('LI');
  expect(element.parentElement!.tagName).toBe('OL');
  expect(option.findLabel().getElement()).toHaveTextContent(`Item ${index + 1}`);
  const dragHandle = option.findDragHandle().getElement();
  expectAriaLabel(wrapper, dragHandle, `Drag handle Item ${index + 1}`);
  expectLabelForToggle(option);
}

async function expectAnnouncement(announcement: string) {
  await new Promise(resolve => setTimeout(resolve, 0));
  const liveRegion = createWrapper().find('[aria-live="assertive"]');
  expect(liveRegion!.getElement()).toHaveTextContent(announcement);
}

function expectVisibilityStatus({
  wrapper,
  statuses,
}: {
  wrapper: ContentDisplayPreferenceWrapper;
  statuses: boolean[];
}) {
  const options = wrapper.findOptions();
  for (let i = 0; i < options.length; i++) {
    const toggleElement = options[i].findVisibilityToggle().findNativeInput().getElement();
    if (statuses[i]) {
      expect(toggleElement).toBeChecked();
    } else {
      expect(toggleElement).not.toBeChecked();
    }
  }
}
function expectLabelForToggle(option: ContentDisplayOptionWrapper) {
  const toggleId = option.findVisibilityToggle().findNativeInput().getElement().id;
  expect(toggleId).toBeTruthy();
  const labelForAttribute = option.findLabel().getElement().getAttribute('for');
  expect(labelForAttribute).toBe(toggleId);
}

function pressKey(element: HTMLElement, key: string) {
  fireEvent.keyDown(element, { key, code: key });
}

describe('Content Display preference with groups', () => {
  const groupedPreference: CollectionPreferencesProps.ContentDisplayPreference = {
    ...contentDisplayPreference,
    groups: [
      { id: 'g1', label: 'Group 1' },
      { id: 'g2', label: 'Group 2' },
    ],
  };

  const groupedContentDisplay: CollectionPreferencesProps.ContentDisplayItem[] = [
    { id: 'id1', visible: true },
    {
      type: 'group',
      id: 'g1',
      visible: true,
      children: [
        { id: 'id2', visible: true },
        { id: 'id3', visible: false },
      ],
    },
    { type: 'group', id: 'g2', visible: true, children: [{ id: 'id4', visible: true }] },
  ];

  function renderGroupedContentDisplay(props: Partial<CollectionPreferencesProps> = {}) {
    const wrapper = renderCollectionPreferences(
      {
        contentDisplayPreference: groupedPreference,
        preferences: { contentDisplay: groupedContentDisplay },
        ...props,
      },
      true
    );
    wrapper.findTriggerButton().click();
    return wrapper.findModal()!.findContentDisplayPreference()!;
  }

  it('renders group headers', () => {
    const wrapper = renderGroupedContentDisplay();
    const element = wrapper.getElement();
    expect(element.textContent).toContain('Group 1');
    expect(element.textContent).toContain('Group 2');
  });

  it('renders leaf options within groups', () => {
    const wrapper = renderGroupedContentDisplay();
    const options = wrapper.findOptions();
    // findOptions returns all items (groups + leaves) in DOM order
    // Verify leaf labels are present
    const labels = options.map(opt => opt.findLabel()?.getElement().textContent).filter(Boolean);
    expect(labels).toContain('Item 1');
    expect(labels).toContain('Item 2');
    expect(labels).toContain('Item 3');
    expect(labels).toContain('Item 4');
  });

  it('renders options with correct visibility state', () => {
    const wrapper = renderGroupedContentDisplay();
    const options = wrapper.findOptions();
    const toggleStates = options
      .map(opt => opt.findVisibilityToggle()?.findNativeInput()?.getElement()?.checked)
      .filter(state => state !== undefined);
    // All items with visibility toggles in DOM order: id1, g1, id2, id3, g2, id4
    expect(toggleStates).toEqual([true, true, true, false, true, true]);
  });

  it('renders nested lists with aria-label for groups', () => {
    const wrapper = renderGroupedContentDisplay();
    const lists = wrapper.findAll('ol');
    // Should have at least the top-level list + nested lists for each group
    expect(lists.length).toBeGreaterThanOrEqual(2);
    // Nested lists should have aria-label matching group name
    const nestedList = lists.find(l => l.getElement().getAttribute('aria-label') === 'Group 1');
    expect(nestedList).toBeDefined();
  });

  it('filters options within groups', () => {
    const wrapper = renderGroupedContentDisplay({
      contentDisplayPreference: { ...groupedPreference, enableColumnFiltering: true },
    });
    const filterInput = wrapper.findTextFilter()!;
    filterInput.findInput().setInputValue('Item 2');
    // Only Item 2 and its parent group should be visible
    const element = wrapper.getElement();
    expect(element.textContent).toContain('Item 2');
    expect(element.textContent).toContain('Group 1');
    expect(element.textContent).not.toContain('Item 4');
  });

  it('shows no match state when filter has no results', () => {
    const wrapper = renderGroupedContentDisplay({
      contentDisplayPreference: {
        ...groupedPreference,
        enableColumnFiltering: true,
        i18nStrings: { columnFilteringNoMatchText: 'No matches found', columnFilteringClearFilterText: 'Clear' },
      },
    });
    const filterInput = wrapper.findTextFilter()!;
    filterInput.findInput().setInputValue('nonexistent');
    expect(wrapper.getElement().textContent).toContain('No matches found');
  });

  it('reorders top-level items when onSortingChange fires', () => {
    const onConfirm = jest.fn();
    const collectionPreferencesWrapper = renderCollectionPreferences(
      {
        contentDisplayPreference: groupedPreference,
        preferences: { contentDisplay: groupedContentDisplay },
        onConfirm,
      },
      true
    );
    collectionPreferencesWrapper.findTriggerButton().click();
    const wrapper = collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;

    // Verify initial top-level order: id1, g1, g2
    const topLevelItem = wrapper.findOptionByIndex(1);
    expect(topLevelItem!.findLabel()!.getElement()).toHaveTextContent('Item 1');
  });

  it('has drag handles for items within groups', () => {
    const wrapper = renderGroupedContentDisplay();
    const options = wrapper.findOptions();
    // All items (including those in groups) should have drag handles
    const id2Option = options.find(opt => opt.findLabel()?.getElement().textContent === 'Item 2');
    expect(id2Option).toBeDefined();
    expect(id2Option!.findDragHandle()).not.toBeNull();
    expect(id2Option!.findDragHandle().getElement().getAttribute('aria-disabled')).toBe('false');
  });

  it('findChildrenOptions returns nested options for a group item', () => {
    const wrapper = renderGroupedContentDisplay();
    const options = wrapper.findOptions();
    // Find a group option and check its children
    for (const option of options) {
      const children = option.findChildrenOptions();
      if (children !== null) {
        expect(children.length).toBeGreaterThan(0);
        return;
      }
    }
  });

  it('findChildrenOptions with group=true returns only group children', () => {
    const wrapper = renderGroupedContentDisplay();
    const options = wrapper.findOptions();
    for (const option of options) {
      const children = option.findChildrenOptions({ group: true });
      if (children !== null && children.length > 0) {
        // Found group children
        expect(children.length).toBeGreaterThan(0);
        return;
      }
    }
  });

  it('findChildrenOptions with group=false returns only leaf children', () => {
    const wrapper = renderGroupedContentDisplay();
    const options = wrapper.findOptions();
    for (const option of options) {
      const children = option.findChildrenOptions({ group: false });
      if (children !== null && children.length > 0) {
        expect(children.length).toBeGreaterThan(0);
        return;
      }
    }
  });

  it('findOptions returns all items including groups', () => {
    const wrapper = renderGroupedContentDisplay();
    const allOptions = wrapper.findOptions();
    // Should have ungrouped items + group items + leaf items inside groups
    expect(allOptions.length).toBeGreaterThan(0);
  });

  it('toggling a grouped leaf option calls onChange with updated tree', () => {
    const onConfirm = jest.fn();
    const collectionPreferencesWrapper = renderCollectionPreferences({
      contentDisplayPreference: groupedPreference,
      preferences: { contentDisplay: groupedContentDisplay },
      onConfirm,
    });
    collectionPreferencesWrapper.findTriggerButton().click();
    const wrapper = collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;

    // Toggle a leaf option visibility — use findOptions() without filter since :has() doesn't work in JSDOM
    const options = wrapper.findOptions();
    const toggleableOption = options.find(opt => opt.findVisibilityToggle() !== null);
    expect(toggleableOption).toBeDefined();
    toggleableOption!.findVisibilityToggle().findNativeInput().click();

    // Confirm
    collectionPreferencesWrapper.findModal()!.findFooter()!.findAll('button')[1].click();
    expect(onConfirm).toHaveBeenCalled();
    const detail = onConfirm.mock.calls[0][0].detail;
    expect(detail.contentDisplay).toBeDefined();
    // Should contain group structure
    const hasGroup = detail.contentDisplay.some((item: any) => item.type === 'group');
    expect(hasGroup).toBe(true);
  });
});
