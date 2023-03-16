// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import CollectionPreferencesPageObject from './pages/collection-preferences-page';

const setupTest = (testFn: (page: CollectionPreferencesPageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new CollectionPreferencesPageObject(browser);
    await browser.url('#/light/collection-preferences/reorder-content');
    await page.setWindowSize({ width: 1200, height: 1200 });
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
        await page.keys('ArrowDown');
        await page.keys('Space');
        return expect(await page.containsOptionsInOrder(['Item 2', 'Item 1'])).toBe(true);
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
        await page.keys('ArrowUp');
        await page.keys('Space');
        return expect(await page.containsOptionsInOrder(['Item 2', 'Item 1'])).toBe(true);
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
        await page.keys('ArrowDown');
        await page.keys('ArrowUp');
        await page.keys('Space');
        return expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);
      })
    );

    test(
      'cancels movement',
      setupTest(async page => {
        const wrapper = createWrapper().findCollectionPreferences('.cp-1');
        await page.openCollectionPreferencesModal(wrapper);

        await expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);

        await page.focusDragHandle(0);
        await page.keys('Space');
        await page.keys('ArrowDown');
        await page.keys('Escape');
        return expect(await page.containsOptionsInOrder(['Item 1', 'Item 2'])).toBe(true);
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
        for (let i = 0; i < 30; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          await page.keys('ArrowDown');
        }
        await page.keys('Space');
        return expect(await page.containsOptionsInOrder(['Item 30', 'Item 1'])).toBe(true);
      })
    );
  });
});
