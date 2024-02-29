// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { flashbar } from '../__integ__/pages/base';
import { FlashbarInteractivePage } from '../__integ__/pages/interactive-page';

const setupTest = (options: { visualRefresh?: boolean }, testFn: (page: FlashbarInteractivePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new FlashbarInteractivePage(browser);
    const baseUrl = '#/light/flashbar/interactive';
    const url =
      options.visualRefresh === undefined
        ? baseUrl
        : `${baseUrl}?${new URLSearchParams({
            visualRefresh: `${options.visualRefresh}`,
          }).toString()}`;
    await browser.url(url);
    await page.waitForVisible(flashbar.toSelector());
    await testFn(page);
  });
};

describe('Collapsible flashbar', () => {
  describe('can dismiss all items', () => {
    it.each([true, false])('visualRefresh=%s', visualRefresh =>
      setupTest({ visualRefresh }, async page => {
        await page.removeAll();
        await page.toggleStackingFeature();
        await expect(page.countFlashes()).resolves.toBe(0);
        await page.addInfoFlash();
        await expect(page.countFlashes()).resolves.toBe(1);
        await page.waitForVisible(page.getItem(1).findDismissButton().toSelector());
        await page.dismissFirstItem();
        await page.waitForAssertion(() => expect(page.countFlashes()).resolves.toBe(0));
      })()
    );
  });
});
