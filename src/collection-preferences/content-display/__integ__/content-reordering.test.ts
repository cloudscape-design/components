// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../../lib/components/test-utils/selectors';
import ContentDisplayPageObject from './pages/content-display-page';

const setupTest = (testFn: (page: ContentDisplayPageObject) => Promise<void>, height = 1200) => {
  return useBrowser(async browser => {
    const page = new ContentDisplayPageObject(browser);
    await browser.url('#/light/collection-preferences/reorder-content');
    await page.setWindowSize({ width: 1200, height });
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
        return page.expectAnnouncement('Reordering canceled');
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
        return page.expectAnnouncement('Reordering canceled');
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
        return page.expectAnnouncement('Item moved from position 1 to position 31 of 50');
      })
    );
  });
});
