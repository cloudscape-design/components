// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

class ScreenshotAreaPage extends BasePageObject {
  async clickAddItems() {
    await this.click('button*=Add');
  }

  async clickRemoveItems() {
    await this.click('button*=Remove');
  }

  isWarningDisplayed() {
    return this.isDisplayed('p*=Warning');
  }
}

function setupTest(testFn: (page: ScreenshotAreaPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new ScreenshotAreaPage(browser);
    await browser.url('#light/utils/screenshot-area-warning');
    await page.waitForVisible('.screenshot-area');
    await testFn(page);
  });
}

test(
  'shows warning message when the page height exceeds the limit and hides when it does not',
  setupTest(async page => {
    await expect(page.isWarningDisplayed()).resolves.toBe(false);
    await page.clickAddItems();
    await expect(page.isWarningDisplayed()).resolves.toBe(true);
    await page.clickRemoveItems();
    await expect(page.isWarningDisplayed()).resolves.toBe(false);
  })
);
