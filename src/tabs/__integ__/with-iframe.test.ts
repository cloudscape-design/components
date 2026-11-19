// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findTabs();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser({ width: 1600, height: 800 }, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/tabs/with-iframe');
    await page.runInsideIframe('#iframe', true, async () => {
      await page.waitForVisible(wrapper.findTabContent().toSelector());
      await testFn(page);
    });
  });
};

test(
  'allows to focus on tab content area',
  setupTest(async page => {
    await page.click('#before');
    await page.keys(['Tab']);
    await expect(page.isFocused(wrapper.findActiveTab().toSelector())).resolves.toBe(true);

    await page.keys(['Tab']);
    await expect(page.isFocused(wrapper.findTabContent().toSelector())).resolves.toBe(true);

    await page.keys(['Tab']);
    await expect(page.isFocused('#tab-content-button')).resolves.toBe(true);

    await page.keys(['Tab']);
    await expect(page.isFocused('#after')).resolves.toBe(true);
  })
);

test(
  'navigates tab list with left/right arrow keys',
  setupTest(async page => {
    await page.click('#before');
    await page.keys(['Tab']);
    await expect(page.getFocusedElementText()).resolves.toBe('First tab');

    await page.keys(['ArrowRight']);
    await expect(page.getFocusedElementText()).resolves.toBe('Second tab');

    await page.keys(['ArrowRight']);
    await expect(page.getFocusedElementText()).resolves.toBe('First tab');

    await page.keys(['ArrowLeft']);
    await expect(page.getFocusedElementText()).resolves.toBe('Second tab');

    await page.keys(['ArrowLeft']);
    await expect(page.getFocusedElementText()).resolves.toBe('First tab');
  })
);
