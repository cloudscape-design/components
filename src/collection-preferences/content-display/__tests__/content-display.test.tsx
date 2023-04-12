// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { contentDisplayPreference, renderCollectionPreferences } from '../../__tests__/shared';
import { CollectionPreferencesProps } from '../../../../lib/components';
import ContentDisplayPreferenceWrapper, {
  ContentDisplayOptionWrapper,
} from '../../../../lib/components/test-utils/dom/collection-preferences/content-display-preference';
import { fireEvent } from '@testing-library/react';

describe('Content Display preference', () => {
  it('correctly displays title', () => {
    const wrapper = renderContentDisplay();
    const titleElement = wrapper.findTitle().getElement();
    expect(titleElement).toHaveTextContent('Content display title');
    expect(titleElement.tagName).toBe('H3');
  });

  it('correctly displays label', () => {
    const wrapper = renderContentDisplay();
    const labelElement = wrapper.findLabel().getElement();
    expect(labelElement).toHaveTextContent('Content display label');
  });

  it('displays list of options with correct semantics', () => {
    const wrapper = renderContentDisplay();
    const items = wrapper.findOptions();
    for (let i = 0; i < items.length; i++) {
      testOptionItem({ wrapper, item: items[i], index: i });
    }
  });

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
    expectCheckedStatus({ wrapper: contentDisplayPreferenceWrapper, statuses: [true, false, true, true] });
    contentDisplayPreferenceWrapper.findOptions()[1].findToggle().findNativeInput().click();
    expectCheckedStatus({ wrapper: contentDisplayPreferenceWrapper, statuses: [true, true, true, true] });
    contentDisplayPreferenceWrapper.findOptions()[2].findToggle().findNativeInput().click();
    expectCheckedStatus({ wrapper: contentDisplayPreferenceWrapper, statuses: [true, true, false, true] });
  });

  it('forces non-editable options to be visible', () => {
    const wrapper = renderContentDisplay();
    const toggleInput = wrapper.findOptions()[0].findToggle().findNativeInput();
    expect(toggleInput.getElement()).toBeChecked();
    expect(toggleInput.getElement()).toBeDisabled();
    toggleInput.click();
    expect(toggleInput.getElement()).toBeChecked();
    expect(toggleInput.getElement()).toBeDisabled();
  });

  describe('reorders content', () => {
    it('moves item down', async () => {
      const wrapper = renderContentDisplay();
      testOrder({ wrapper, order: [0, 1, 2, 3] });
      const dragHandle = wrapper.findOptions()[0].findDragHandle().getElement();
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
      const dragHandle = wrapper.findOptions()[1].findDragHandle().getElement();
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
      const dragHandle = wrapper.findOptions()[0].findDragHandle().getElement();
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
      const dragHandle = wrapper.findOptions()[0].findDragHandle().getElement();
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
  });

  it('cancels reordering when pressing Escape', async () => {
    const wrapper = renderContentDisplay();
    testOrder({ wrapper, order: [0, 1, 2, 3] });
    const dragHandle = wrapper.findOptions()[0].findDragHandle().getElement();
    pressKey(dragHandle, 'Space');
    await expectAnnouncement(wrapper, 'Picked up item at position 1 of 4');
    pressKey(dragHandle, 'ArrowDown');
    await expectAnnouncement(wrapper, 'Moving item to position 2 of 4');
    pressKey(dragHandle, 'Escape');
    testOrder({ wrapper, order: [0, 1, 2, 3] });
    await expectAnnouncement(wrapper, 'Reordering canceled');
  });
});

function renderContentDisplay(props: Partial<CollectionPreferencesProps> = {}) {
  const collectionPreferencesWrapper = renderCollectionPreferences({ contentDisplayPreference, ...props });
  collectionPreferencesWrapper.findTriggerButton().click();
  return collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
}

function expectLabel(wrapper: ContentDisplayPreferenceWrapper, element: HTMLElement, label: string) {
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
  const items = wrapper.findOptions();
  const expectedOrder = [1, 0, 2, 3];
  for (let i = 0; i < expectedOrder.length; i++) {
    const item = items[i];
    testOptionItem({ wrapper, item, index: order[i] });
  }
}

function testOptionItem({
  wrapper,
  item,
  index,
}: {
  wrapper: ContentDisplayPreferenceWrapper;
  item: ContentDisplayOptionWrapper;
  index: number;
}) {
  const element = item.getElement();
  expect(element.tagName).toBe('LI');
  expect(element.parentElement!.tagName).toBe('UL');
  expect(element).toHaveTextContent(`Item ${index + 1}`);
  const dragHandle = item.findDragHandle().getElement();
  expectLabel(wrapper, dragHandle, `Drag handle, Item ${index + 1}`);
}

async function expectAnnouncement(wrapper: ContentDisplayPreferenceWrapper, announcement: string) {
  await new Promise(resolve => setTimeout(resolve, 0));
  const liveRegion = wrapper.find('[aria-live="assertive"]');
  expect(liveRegion!.getElement()).toHaveTextContent(announcement);
}

function expectCheckedStatus({ wrapper, statuses }: { wrapper: ContentDisplayPreferenceWrapper; statuses: boolean[] }) {
  const options = wrapper.findOptions();
  for (let i = 0; i < options.length; i++) {
    const toggleElement = options[i].findToggle().findNativeInput().getElement();
    if (statuses[i]) {
      expect(toggleElement).toBeChecked();
    } else {
      expect(toggleElement).not.toBeChecked();
    }
  }
}

function pressKey(element: HTMLElement, key: string) {
  fireEvent.keyDown(element, { key, code: key });
}
