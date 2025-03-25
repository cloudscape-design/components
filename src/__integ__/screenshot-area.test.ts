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

test('shows warning message when the page height exceeds the limit and hides when it does not', async () => {
  try {
    await useBrowser(async browser => {
      const page = new ScreenshotAreaPage(browser);
      await browser.url('#light/utils/screenshot-area-warning');
      await page.waitForVisible('.screenshot-area');
      await expect(page.isWarningDisplayed()).resolves.toBe(false);
      await page.clickAddItems();
      await expect(page.isWarningDisplayed()).resolves.toBe(true);
      await page.clickRemoveItems();
      await expect(page.isWarningDisplayed()).resolves.toBe(false);
    })();
  } catch (error: any) {
    if (error.message.includes('Unexpected errors in browser console')) {
      // The console errors are expected in this test
    } else {
      throw error;
    }
  }
});
