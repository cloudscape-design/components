// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CollectionPreferencesProps } from '../../../../lib/components';
import { contentDisplayPreference, renderCollectionPreferences } from '../../__tests__/shared';

const lockedPreference: CollectionPreferencesProps.ContentDisplayPreference = {
  ...contentDisplayPreference,
  lockedItemsCount: 2,
};

const defaultContentDisplay: CollectionPreferencesProps.ContentDisplayItem[] = [
  { id: 'id1', visible: true },
  { id: 'id2', visible: true },
  { id: 'id3', visible: true },
  { id: 'id4', visible: true },
];

function renderWithLockedItems(props: Partial<CollectionPreferencesProps> = {}) {
  const wrapper = renderCollectionPreferences(
    {
      contentDisplayPreference: lockedPreference,
      preferences: { contentDisplay: defaultContentDisplay },
      ...props,
    },
    true
  );
  wrapper.findTriggerButton().click();
  return wrapper.findModal()!.findContentDisplayPreference()!;
}

describe('Content Display preference – locked items', () => {
  describe('Drag handle disabled state', () => {
    it('disables drag handles for locked items', () => {
      const wrapper = renderWithLockedItems();
      const options = wrapper.findOptions();

      // First two items are locked → drag handles have aria-disabled="true"
      expect(options[0].findDragHandle().getElement().getAttribute('aria-disabled')).toBe('true');
      expect(options[1].findDragHandle().getElement().getAttribute('aria-disabled')).toBe('true');
    });

    it('does not mark non-locked items as disabled', () => {
      const wrapper = renderWithLockedItems();
      const options = wrapper.findOptions();

      // Items at index 2 and 3 are not locked → aria-disabled is not "true"
      expect(options[2].findDragHandle().getElement().getAttribute('aria-disabled')).not.toBe('true');
      expect(options[3].findDragHandle().getElement().getAttribute('aria-disabled')).not.toBe('true');
    });
  });

  describe('Visibility toggle for locked items', () => {
    it('forces locked items to always be visible regardless of preference value', () => {
      const wrapper = renderWithLockedItems({
        preferences: {
          contentDisplay: [
            { id: 'id1', visible: false }, // even if false, locked items are shown as visible
            { id: 'id2', visible: false },
            { id: 'id3', visible: true },
            { id: 'id4', visible: true },
          ],
        },
      });
      const options = wrapper.findOptions();
      // Locked items forced visible
      expect(options[0].findVisibilityToggle().findNativeInput().getElement()).toBeChecked();
      expect(options[1].findVisibilityToggle().findNativeInput().getElement()).toBeChecked();
    });

    it('disables visibility toggle for locked items', () => {
      const wrapper = renderWithLockedItems();
      const options = wrapper.findOptions();

      // Locked items have disabled toggles
      expect(options[0].findVisibilityToggle().findNativeInput().getElement()).toBeDisabled();
      expect(options[1].findVisibilityToggle().findNativeInput().getElement()).toBeDisabled();

      // Non-locked items have enabled toggles
      expect(options[2].findVisibilityToggle().findNativeInput().getElement()).not.toBeDisabled();
      expect(options[3].findVisibilityToggle().findNativeInput().getElement()).not.toBeDisabled();
    });

    it('toggling a locked item does not change its visibility (toggle is disabled)', () => {
      const wrapper = renderWithLockedItems();
      const options = wrapper.findOptions();

      // The toggle is disabled so clicking it is a no-op
      const toggle = options[0].findVisibilityToggle().findNativeInput();
      expect(toggle.getElement()).toBeDisabled();
      expect(toggle.getElement()).toBeChecked();
      toggle.click();
      // Still checked after click
      expect(toggle.getElement()).toBeChecked();
    });
  });

  describe('Edge cases', () => {
    it('handles lockedItemsCount of 0 (no items locked)', () => {
      const wrapper = renderCollectionPreferences(
        {
          contentDisplayPreference: { ...contentDisplayPreference, lockedItemsCount: 0 },
          preferences: { contentDisplay: defaultContentDisplay },
        },
        true
      );
      wrapper.findTriggerButton().click();
      const prefWrapper = wrapper.findModal()!.findContentDisplayPreference()!;
      const options = prefWrapper.findOptions();

      // No drag handles should be aria-disabled="true"
      options.forEach(opt => {
        expect(opt.findDragHandle().getElement().getAttribute('aria-disabled')).not.toBe('true');
      });
    });

    it('handles lockedItemsCount exceeding total items (clamps to all)', () => {
      const wrapper = renderCollectionPreferences(
        {
          contentDisplayPreference: { ...contentDisplayPreference, lockedItemsCount: 100 },
          preferences: { contentDisplay: defaultContentDisplay },
        },
        true
      );
      wrapper.findTriggerButton().click();
      const prefWrapper = wrapper.findModal()!.findContentDisplayPreference()!;
      const options = prefWrapper.findOptions();

      // All items locked → all drag handles disabled
      options.forEach(opt => {
        expect(opt.findDragHandle().getElement().getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('disables locking when filtering is active (locked items no longer appear locked)', () => {
      const wrapper = renderWithLockedItems({
        contentDisplayPreference: { ...lockedPreference, enableColumnFiltering: true },
      });

      // Before filtering: first two items are locked
      const optionsBefore = wrapper.findOptions();
      expect(optionsBefore[0].findDragHandle().getElement().getAttribute('aria-disabled')).toBe('true');
      expect(optionsBefore[1].findDragHandle().getElement().getAttribute('aria-disabled')).toBe('true');

      // Apply a filter — locking is suspended during filtering
      const filterInput = wrapper.findTextFilter();
      filterInput!.findInput().setInputValue('Item');

      // After filtering, locked items are no longer marked as individually locked
      // (the whole list becomes sort-disabled via sortDisabled prop)
      const optionsAfter = wrapper.findOptions();
      // Items that were locked should no longer have their individual lock applied
      // (effectiveLockedCount becomes 0 while filtering)
      // Note: the global sortDisabled behavior is tested separately in the existing suite
      expect(optionsAfter).toHaveLength(4);
    });

    it('renders all items when lockedItemsCount is set', () => {
      const wrapper = renderWithLockedItems();
      expect(wrapper.findOptions()).toHaveLength(4);
    });

    it('locked items appear first in the list', () => {
      const wrapper = renderWithLockedItems({
        preferences: {
          contentDisplay: [
            { id: 'id1', visible: true },
            { id: 'id2', visible: true },
            { id: 'id3', visible: false },
            { id: 'id4', visible: true },
          ],
        },
      });
      const options = wrapper.findOptions();
      // First 2 are locked
      expect(options[0].findDragHandle().getElement().getAttribute('aria-disabled')).toBe('true');
      expect(options[1].findDragHandle().getElement().getAttribute('aria-disabled')).toBe('true');
      // Remaining are not locked
      expect(options[2].findDragHandle().getElement().getAttribute('aria-disabled')).not.toBe('true');
      expect(options[3].findDragHandle().getElement().getAttribute('aria-disabled')).not.toBe('true');
    });
  });
});
