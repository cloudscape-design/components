// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FlashbarBasePage, flashbar } from './base';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../../lib/components/test-utils/selectors';

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

  async dismissFirstItem() {
    await this.click(createWrapper().findFlashbar().findItems().get(1).findDismissButton().toSelector());
  }

  getItem(index: number) {
    return createWrapper().findFlashbar().findItems().get(index);
  }

  async removeAll() {
    await this.click('[data-id="remove-all"]');
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
