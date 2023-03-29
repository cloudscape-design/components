// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import CollectionPreferencesPageObject from './pages/collection-preferences-page';

const setupTest = (testFn: (page: CollectionPreferencesPageObject) => Promise<void>, height = 1200) => {
  return useBrowser(async browser => {
    const page = new CollectionPreferencesPageObject(browser);
    await browser.url('#/light/collection-preferences/reorder-content');
    await page.setWindowSize({ width: 1200, height });
    await testFn(page);
  });
};

describe('Collection preferences with custom content reordering', () => {
  describe('with keyboard', () => {
    test(
      'moves item down',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(0);
        await page.keys('Space');
        await page.expectAnnouncement('Picked up item at position 1 of 6');
        await page.keys('ArrowDown');
        await page.expectAnnouncement('Moving item to position 2 of 6');
        await page.keys('Space');

        await expect(await page.containsOptionsInOrder(['Item 2', 'Item 1'])).toBe(true);
        return page.expectAnnouncement('Item moved from position 1 to position 2 of 6');
      })
    );

    test(
      'moves item up',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(1);
        await page.keys('Space');
        await page.expectAnnouncement('Picked up item at position 2 of 6');
        await page.keys('ArrowUp');
        await page.expectAnnouncement('Moving item to position 1 of 6');
        await page.keys('Space');

        await expect(await page.containsOptionsInOrder(['Item 2', 'Item 1'])).toBe(true);
        return page.expectAnnouncement('Item moved from position 2 to position 1 of 6');
      })
    );

    test(
      'moves item down and back up',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(0);
        await page.keys('Space');
        await page.expectAnnouncement('Picked up item at position 1 of 6');
        await page.keys('ArrowDown');
        await page.expectAnnouncement('Moving item to position 2 of 6');
        await page.keys('ArrowUp');
        await page.expectAnnouncement('Moving item back to position 1 of 6');
        await page.keys('Space');

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);
        return page.expectAnnouncement('Item moved back to its original position 1 of 6');
      })
    );

    test(
      'ignores keystrokes out of bounds',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(0);
        await page.keys('Space');
        await page.expectAnnouncement('Picked up item at position 1 of 6');
        await page.keys(new Array(10).fill('ArrowUp'));
        await page.expectAnnouncement('Picked up item at position 1 of 6');
        await page.keys('ArrowDown');
        await page.expectAnnouncement('Moving item to position 2 of 6');
        await page.keys(new Array(10).fill('ArrowDown'));
        await page.keys('ArrowUp');
        await page.keys('Space');

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 6'])).toBe(true);
        return page.expectAnnouncement('Item moved from position 1 to position 5 of 6');
      })
    );

    test(
      'cancels reordering by pressing Escape',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(0);
        await page.keys('Space');
        await page.expectAnnouncement('Picked up item at position 1 of 6');
        await page.keys('ArrowDown');
        await page.expectAnnouncement('Moving item to position 2 of 6');
        await page.keys('Escape');

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);
        return page.expectAnnouncement('Reordering canceled');
      })
    );

    test(
      'cancels reordering by pressing Tab',
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
      'cancels reordering by clicking somewhere else',
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
