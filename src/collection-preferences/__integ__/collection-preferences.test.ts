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
    'renders no columns if there is only custom content',
    setupTest(async page => {
      const wrapper = createWrapper().findCollectionPreferences('.cp-3');
      await page.openCollectionPreferencesModal(wrapper);

      // The content is small enough so that it doesn't need column layout
      const columnLayout = wrapper.findModal().findContent().findColumnLayout();
      await expect(page.isExisting(columnLayout.toSelector())).resolves.toBe(false);

      await expect(page.isExisting(wrapper.findModal().findWrapLinesPreference().toSelector())).resolves.toBe(true);
    })
  );

  test(
    'renders no columns if there is only visible content preferences',
    setupTest(async page => {
      const wrapper = createWrapper().findCollectionPreferences('.cp-4');
      await page.openCollectionPreferencesModal(wrapper);

      // The content is small enough so that it doesn't need column layout
      const columnLayout = wrapper.findModal().findContent().findColumnLayout();
      await expect(page.isExisting(columnLayout.toSelector())).resolves.toBe(false);

      await expect(page.isExisting(wrapper.findModal().findVisibleContentPreference().toSelector())).resolves.toBe(
        true
      );
    })
  );

  test(
    'renders 2 columns if all preferences are present',
    setupTest(async page => {
      const wrapper = createWrapper().findCollectionPreferences('.cp-1');
      await page.openCollectionPreferencesModal(wrapper);

      const columnLayout = wrapper.findModal().findContent().findColumnLayout();
      await expect(page.isExisting(columnLayout.findColumn(1).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(2).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(3).toSelector())).resolves.toBe(false);
    })
  );
});
