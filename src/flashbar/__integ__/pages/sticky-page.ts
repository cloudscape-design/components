// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { flashbar, FlashbarBasePage } from './base';

export class StickyFlashbarPage extends FlashbarBasePage {
  async getNotificationBarBottom() {
    const notificationBar = this.getNotificationBar();
    return (await this.getBoundingBox(notificationBar)).bottom;
  }
}

export const setupTest = (testFn: (page: StickyFlashbarPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new StickyFlashbarPage(browser);
    await browser.url(`#/light/flashbar/sticky-app-layout`);
    await page.waitForVisible(flashbar.toSelector());
    await testFn(page);
  });
};
