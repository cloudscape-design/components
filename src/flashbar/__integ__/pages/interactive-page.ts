// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FlashbarBasePage, flashbar } from './base';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

export class FlashbarInteractivePage extends FlashbarBasePage {
  async addInfoFlash() {
    await this.click('[data-id="add-info"]');
  }

  async addErrorFlash() {
    await this.click('[data-id="add-error"]');
  }

  async addErrorFlashToBottom() {
    await this.click('[data-id="add-error-to-bottom"]');
  }

  async addSequentialErrorFlashes() {
    await this.click('[data-id="add-multiple"]');
  }

  async toggleStackingFeature() {
    await this.click('[data-id="stack-items"]');
  }
}

export const setupTest = (testFn: (page: FlashbarInteractivePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new FlashbarInteractivePage(browser);
    await browser.url(`#/light/flashbar/interactive`);
    await page.waitForVisible(flashbar.toSelector());
    await testFn(page);
  });
};
