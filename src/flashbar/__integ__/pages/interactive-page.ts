// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import selectors from '../../../../lib/components/flashbar/styles.selectors.js';
import createWrapper from '../../../../lib/components/test-utils/selectors';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

export const flashbar = createWrapper().findFlashbar();

export class FlashbarInteractivePage extends BasePageObject {
  async addInfoFlash() {
    await this.click('[data-id="add-info"]');
  }

  async addErrorFlash() {
    await this.click('[data-id="add-error"]');
  }

  async addErrorFlashToTop() {
    await this.click('[data-id="add-to-top"]');
  }

  async addSequentialErrorFlashes() {
    await this.click('[data-id="add-multiple"]');
  }

  async toggleCollapsibleFeature() {
    await this.click('[data-id="stack-items"]');
  }

  async toggleCollapsedState() {
    const selector = createWrapper().findFlashbar().findByClassName(selectors.toggle).toSelector();
    await this.click(selector);
  }

  findFlashes() {
    return this.getElementsCount(createWrapper().findFlashbar().findItems().toSelector());
  }

  isFlashFocused(index: number) {
    return this.isFocused(
      flashbar.findItems().get(index).findByClassName(selectors['flash-focus-container']).toSelector()
    );
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
