// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

class LiveRegionPageObject extends BasePageObject {
  getInnerHTML(selector: string): Promise<string> {
    return this.browser.execute(function (selector) {
      return document.querySelector(selector)!.innerHTML;
    }, selector);
  }
}

function setupTestLiveRegion(testFn: (pageObject: LiveRegionPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('#/light/live-region');
    const pageObject = new LiveRegionPageObject(browser);
    await pageObject.waitForVisible('h1');
    return testFn(pageObject);
  });
}

function setupTestDynamicAria(testFn: (pageObject: LiveRegionPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('#/light/dynamic-aria-live');
    const pageObject = new LiveRegionPageObject(browser);
    await pageObject.waitForVisible('h1');
    return testFn(pageObject);
  });
}

describe('Live region components', () => {
  test(
    `Live region doesn't render child contents as HTML`,
    setupTestLiveRegion(async page => {
      await expect(page.getInnerHTML('[aria-live]')).resolves.toBe('&lt;p&gt;Testing&lt;/p&gt; Testing');
    })
  );

  test(
    `Dynamic aria-live announce changes not more often then given interval`,
    setupTestDynamicAria(async page => {
      await expect(page.getInnerHTML('[aria-live]')).resolves.toBe('Initial text');
      await page.click('#activation-button');

      await page.waitForJsTimers(3000);
      await expect(page.getInnerHTML('[aria-live]')).resolves.not.toBe('Skipped text');
      await page.waitForJsTimers(3000);
      await expect(page.getInnerHTML('[aria-live]')).resolves.toBe('Delayed text');
    })
  );
});
