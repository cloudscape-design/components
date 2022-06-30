// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

class PageObject extends BasePageObject {}

describe('Collection preferences', () => {
  test(
    'renders 1 column',
    useBrowser(async browser => {
      await browser.url('#/light/collection-preferences/simple');
      const page = new PageObject(browser);
      await page.setWindowSize({ width: 1200, height: 1200 });

      const wrapper = createWrapper().findCollectionPreferences('.cp-3');
      await page.waitForVisible(wrapper.findTriggerButton().toSelector());
      await page.click(wrapper.findTriggerButton().toSelector());
      await expect(page.isExisting(wrapper.findModal().toSelector())).resolves.toBe(true);

      const columnLayout = wrapper.findModal().findContent().findColumnLayout();
      await expect(page.isExisting(columnLayout.findColumn(1).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(2).toSelector())).resolves.toBe(false);
    })
  );

  test(
    'renders 2 columns',
    useBrowser(async browser => {
      await browser.url('#/light/collection-preferences/simple');
      const page = new PageObject(browser);
      await page.setWindowSize({ width: 1200, height: 1200 });

      const wrapper = createWrapper().findCollectionPreferences('.cp-1');
      await page.waitForVisible(wrapper.findTriggerButton().toSelector());
      await page.click(wrapper.findTriggerButton().toSelector());
      await expect(page.isExisting(wrapper.findModal().toSelector())).resolves.toBe(true);

      const columnLayout = wrapper.findModal().findContent().findColumnLayout();
      await expect(page.isExisting(columnLayout.findColumn(1).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(2).toSelector())).resolves.toBe(true);
      await expect(page.isExisting(columnLayout.findColumn(3).toSelector())).resolves.toBe(false);
    })
  );
});
