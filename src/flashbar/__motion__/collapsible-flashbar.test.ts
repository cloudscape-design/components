// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { flashbar } from '../__integ__/pages/base';
import { FlashbarInteractivePage } from '../__integ__/pages/interactive-page';

const setupTest = (testFn: (page: FlashbarInteractivePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new FlashbarInteractivePage(browser);
    await browser.url('#/light/flashbar/interactive');
    await page.waitForVisible(flashbar.toSelector());
    await testFn(page);
  });
};

describe('Collapsible flashbar', () => {
  it(
    'can dismiss all items',
    setupTest(async page => {
      await page.removeAll();
      await page.toggleStackingFeature();
      await expect(page.countFlashes()).resolves.toBe(0);
      await page.addInfoFlash();
      await expect(page.countFlashes()).resolves.toBe(1);
      await page.waitForVisible(page.getItem(1).findDismissButton().toSelector());
      await page.dismissFirstItem();
      await page.waitForAssertion(() => expect(page.countFlashes()).resolves.toBe(0));
    })
  );
});
