// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../../lib/components/test-utils/selectors';
import ContentDisplayPageObject from './pages/content-display-page';

const windowDimensions = {
  width: 1200,
  height: 1200,
};

const setupTest = (testFn: (page: ContentDisplayPageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new ContentDisplayPageObject(browser);
    await browser.url('#/light/collection-preferences/reorder-content');
    await page.setWindowSize(windowDimensions);
    await testFn(page);
  });
};

describe('Collection preferences - Content Display preference', () => {
  describe('reorders content with mouse', () => {
    test(
      'moves item down',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2', 'Item 3', 'Item 4'])).toBe(true);

        const activeDragHandle = page.findDragHandle(0);
        const targetDragHandle = page.findDragHandle(3);
        await page.dragAndDropTo(activeDragHandle.toSelector(), targetDragHandle.toSelector());

        await expect(await page.containsOptionsInOrder(['Item 2', 'Item 3', 'Item 4', 'Item 1'])).toBe(true);
      })
    );

    test(
      'moves item up',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2', 'Item 3', 'Item 4'])).toBe(true);

        const activeDragHandle = page.findDragHandle(3);
        const targetDragHandle = page.findDragHandle(0);
        await page.dragAndDropTo(activeDragHandle.toSelector(), targetDragHandle.toSelector());

        await expect(await page.containsOptionsInOrder(['Item 4', 'Item 1', 'Item 2', 'Item 3'])).toBe(true);
      })
    );

    test(
      'cancels reordering when pressing Escape',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2', 'Item 3', 'Item 4'])).toBe(true);

        const activeDragHandle = page.findDragHandle(3);
        const targetDragHandle = page.findDragHandle(0);
        await page.dragTo(activeDragHandle.toSelector(), targetDragHandle.toSelector());
        await page.keys('Escape');

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2', 'Item 3', 'Item 4'])).toBe(true);
        await expect(wrapper.findModal()).not.toBeNull();
      })
    );

    describe('does not cause overflow when reaching the edge of the window', () => {
      const testByDraggingToPosition = async (page: ContentDisplayPageObject, x: number, y: number) => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);
        const modal = wrapper.findModal();
        const modalContentSelector = wrapper.findModal().findContent().toSelector();
        const modalContentBox = await page.getBoundingBox(modalContentSelector);

        const dragHandleSelector = modal
          .findContentDisplayPreference()
          .findOptions()
          .get(1)
          .findDragHandle()
          .toSelector();
        const dragHandleBox = await page.getBoundingBox(dragHandleSelector);
        const delta = { x: x - dragHandleBox.right, y: y - dragHandleBox.bottom };
        await page.mouseDown(dragHandleSelector);
        await page.mouseMove(Math.round(delta.x), Math.round(delta.y));
        await page.pause(100);

        const newModalContentBox = await page.getBoundingBox(modalContentSelector);
        expect(newModalContentBox).toEqual(modalContentBox);
      };

      test(
        'horizontally',
        setupTest(page => testByDraggingToPosition(page, windowDimensions.width, windowDimensions.height / 2))
      );

      test(
        'vertically',
        setupTest(page => testByDraggingToPosition(page, windowDimensions.width / 2, windowDimensions.height))
      );
    });
  });

  describe('reorders content with keyboard', () => {
    test(
      'cancels reordering when pressing Tab',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(0);
        await page.keys('Space');
        await page.expectAnnouncement('Picked up item at position 1 of 6');
        await page.keys('ArrowDown');
        await page.expectAnnouncement('Moving item to position 2 of 6');
        await page.keys('Tab');

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);
        await page.expectAnnouncement('Reordering canceled');
      })
    );

    test(
      'cancels reordering when clicking somewhere else',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(0);
        await page.keys('Space');
        await page.expectAnnouncement('Picked up item at position 1 of 6');
        await page.keys('ArrowDown');
        await page.expectAnnouncement('Moving item to position 2 of 6');
        await page.click(wrapper.findModal().findContentDisplayPreference().findTitle().toSelector());

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);
        await page.expectAnnouncement('Reordering canceled');
      })
    );

    test(
      'scrolls if necessary',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-2');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(0);
        await page.keys('Space');
        await page.expectAnnouncement('Picked up item at position 1 of 50');
        for (let i = 0; i < 30; i++) {
          await page.keys('ArrowDown');
          // Wait for scroll
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        await page.keys('Space');

        await expect(await page.containsOptionsInOrder(['Item 31', 'Item 1'])).toBe(true);
        await page.expectAnnouncement('Item moved from position 1 to position 31 of 50');
      })
    );
  });
});
