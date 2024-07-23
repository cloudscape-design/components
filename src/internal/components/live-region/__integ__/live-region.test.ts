// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

class LiveRegionPageObject extends BasePageObject {
  getInnerHTML(selector: string): Promise<string> {
    return this.browser.execute(function (selector) {
      return document.querySelector(selector)!.innerHTML;
    }, selector);
  }
}

function setupTest(testFn: (pageObject: LiveRegionPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('#/light/live-region');
    const pageObject = new LiveRegionPageObject(browser);
    await pageObject.waitForVisible('h1');
    return testFn(pageObject);
  });
}

describe('Live region', () => {
  test(
    `Live region doesn't render child contents as HTML`,
    setupTest(async page => {
      await expect(page.getInnerHTML('[aria-live]')).resolves.toBe('&lt;p&gt;Testing&lt;/p&gt; Testing');
    })
  );
});
