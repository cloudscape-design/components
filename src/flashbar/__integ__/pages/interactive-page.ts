// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../lib/components/test-utils/selectors';
import { FOCUS_DEBOUNCE_DELAY } from '../../utils';
import { flashbar, FlashbarBasePage } from './base';

export class FlashbarInteractivePage extends FlashbarBasePage {
  async addInfoFlash() {
    await this.click('[data-id="add-info"]');
    await this.pause(FOCUS_DEBOUNCE_DELAY);
  }

  async addErrorFlash() {
    await this.click('[data-id="add-error"]');
    await this.pause(FOCUS_DEBOUNCE_DELAY);
  }

  async addErrorFlashToBottom() {
    await this.click('[data-id="add-error-to-bottom"]');
    await this.pause(FOCUS_DEBOUNCE_DELAY);
  }

  async addSequentialErrorFlashes() {
    await this.click('[data-id="add-multiple"]');
    // Extra time for the items to be added on top of the debounce starting from the latest one.
    await this.pause(FOCUS_DEBOUNCE_DELAY * 2);
  }

  async toggleStackingFeature() {
    await this.click('[data-id="stack-items"]');
    await this.pause(FOCUS_DEBOUNCE_DELAY);
  }

  async dismissFirstItem() {
    await this.click(createWrapper().findFlashbar().findItems().get(1).findDismissButton().toSelector());
    await this.pause(FOCUS_DEBOUNCE_DELAY);
  }

  getItem(index: number) {
    return createWrapper().findFlashbar().findItems().get(index);
  }

  async removeAll() {
    await this.click('[data-id="remove-all"]');
    await this.pause(FOCUS_DEBOUNCE_DELAY);
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
