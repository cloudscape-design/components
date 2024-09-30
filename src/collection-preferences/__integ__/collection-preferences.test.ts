// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import CollectionPreferencesPageObject from './pages/collection-preferences-page';

const setupTest = (testFn: (page: CollectionPreferencesPageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new CollectionPreferencesPageObject(browser);
    await browser.url('#/light/collection-preferences/simple');
    await page.setWindowSize({ width: 1200, height: 1200 });
    await testFn(page);
  });
};

describe('Collection preferences', () => {
  test(
    'renders one column if there is only custom content',
    setupTest(async page => {
      page.wrapper = createWrapper().findCollectionPreferences('.cp-3');

      await page.openCollectionPreferencesModal();

      // The content is small enough so that it only needs one column
      const columnLayout = page.wrapper.findModal().findContent().findColumnLayout();
      await expect(page.isExisting(columnLayout.findColumn(1).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(2).toSelector())).resolves.toBe(false);

      await expect(page.isExisting(page.wrapper.findModal().findWrapLinesPreference().toSelector())).resolves.toBe(
        true
      );
    })
  );

  test(
    'renders one column if there is only visible content preferences',
    setupTest(async page => {
      page.wrapper = createWrapper().findCollectionPreferences('.cp-4');
      await page.openCollectionPreferencesModal();

      // The content is small enough so that it only needs one column
      const columnLayout = page.wrapper.findModal().findContent().findColumnLayout();
      await expect(page.isExisting(columnLayout.findColumn(1).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(2).toSelector())).resolves.toBe(false);

      await expect(page.isExisting(page.wrapper.findModal().findVisibleContentPreference().toSelector())).resolves.toBe(
        true
      );
    })
  );

  test(
    'renders 2 columns if all preferences are present',
    setupTest(async page => {
      page.wrapper = createWrapper().findCollectionPreferences('.cp-1');
      await page.openCollectionPreferencesModal();

      const columnLayout = page.wrapper.findModal().findContent().findColumnLayout();
      await expect(page.isExisting(columnLayout.findColumn(1).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(2).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(3).toSelector())).resolves.toBe(false);
    })
  );
});
