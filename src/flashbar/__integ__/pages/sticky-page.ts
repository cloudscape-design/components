// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FlashbarBasePage, flashbar } from './base';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

export class StickyFlashbarPage extends FlashbarBasePage {
  async getNotificationBarBottom() {
    const notificationBar = this.getNotificationBar();
    return (await this.getBoundingBox(notificationBar)).bottom;
  }
}

export const setupTest = (testFn: (page: StickyFlashbarPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new StickyFlashbarPage(browser);
    await browser.url(`#/light/flashbar/sticky`);
    await page.waitForVisible(flashbar.toSelector());
    await testFn(page);
  });
};
