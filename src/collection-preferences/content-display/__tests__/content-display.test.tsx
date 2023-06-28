// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { contentDisplayPreference, renderCollectionPreferences } from '../../__tests__/shared';
import { CollectionPreferencesProps } from '../../../../lib/components';
import ContentDisplayPreferenceWrapper, {
  ContentDisplayOptionWrapper,
} from '../../../../lib/components/test-utils/dom/collection-preferences/content-display-preference';
import { fireEvent } from '@testing-library/react';

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
      const list = wrapper.findAll('UL')[0].getElement();
      expect(list.getAttribute('aria-labelledby')).toBe(titleId);
      expect(list.getAttribute('aria-describedby')).toBe(descriptionId);
    });

    it('displays list of options with correct semantics', () => {
      const wrapper = renderContentDisplay();
      const options = wrapper.findOptions();
      for (let i = 0; i < options.length; i++) {
        testOption({ wrapper, option: options[i], index: i });
      }
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
  });

  describe('Content reordering', () => {
    it('moves item down', async () => {
      const wrapper = renderContentDisplay();
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement(wrapper, 'Picked up item at position 1 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement(wrapper, 'Moving item to position 2 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [1, 0, 2, 3] });
      await expectAnnouncement(wrapper, 'Item moved from position 1 to position 2 of 4');
    });

    it('moves item up', async () => {
      const wrapper = renderContentDisplay();
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(2)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement(wrapper, 'Picked up item at position 2 of 4');
      pressKey(dragHandle, 'ArrowUp');
      await expectAnnouncement(wrapper, 'Moving item to position 1 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [1, 0, 2, 3] });
      await expectAnnouncement(wrapper, 'Item moved from position 2 to position 1 of 4');
    });

    it('moves item down and back up', async () => {
      const wrapper = renderContentDisplay();
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement(wrapper, 'Picked up item at position 1 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement(wrapper, 'Moving item to position 2 of 4');
      pressKey(dragHandle, 'ArrowUp');
      await expectAnnouncement(wrapper, 'Moving item back to position 1 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      await expectAnnouncement(wrapper, 'Item moved back to its original position 1 of 4');
    });

    it('ignores keystrokes out of bounds', async () => {
      const wrapper = renderContentDisplay();
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement(wrapper, 'Picked up item at position 1 of 4');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const i of Array(10)) {
        pressKey(dragHandle, 'ArrowUp');
        await expectAnnouncement(wrapper, 'Picked up item at position 1 of 4');
      }
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement(wrapper, 'Moving item to position 2 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement(wrapper, 'Moving item to position 3 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement(wrapper, 'Moving item to position 4 of 4');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const i of Array(10)) {
        pressKey(dragHandle, 'ArrowDown');
        await expectAnnouncement(wrapper, 'Moving item to position 4 of 4');
      }
      pressKey(dragHandle, 'ArrowUp');
      await expectAnnouncement(wrapper, 'Moving item to position 3 of 4');
      pressKey(dragHandle, 'Space');
      testOrder({ wrapper, order: [1, 2, 0, 3] });
      await expectAnnouncement(wrapper, 'Item moved from position 1 to position 3 of 4');
    });

    it('cancels reordering when pressing Escape', async () => {
      const wrapper = renderContentDisplay();
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptionByIndex(1)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await expectAnnouncement(wrapper, 'Picked up item at position 1 of 4');
      pressKey(dragHandle, 'ArrowDown');
      await expectAnnouncement(wrapper, 'Moving item to position 2 of 4');
      pressKey(dragHandle, 'Escape');
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      await expectAnnouncement(wrapper, 'Reordering canceled');
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
      const collectionPreferencesWrapper = renderCollectionPreferences({
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
      });
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

function renderContentDisplay(props: Partial<CollectionPreferencesProps> = {}) {
  const collectionPreferencesWrapper = renderCollectionPreferences({ contentDisplayPreference, ...props });
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
  expect(element.parentElement!.tagName).toBe('UL');
  expect(option.findLabel().getElement()).toHaveTextContent(`Item ${index + 1}`);
  const dragHandle = option.findDragHandle().getElement();
  expectAriaLabel(wrapper, dragHandle, `Drag handle, Item ${index + 1}`);
  expectLabelForToggle(option);
}

async function expectAnnouncement(wrapper: ContentDisplayPreferenceWrapper, announcement: string) {
  await new Promise(resolve => setTimeout(resolve, 0));
  const liveRegion = wrapper.find('[aria-live="assertive"]');
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
