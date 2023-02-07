// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import selectors from '../../../../lib/components/flashbar/styles.selectors.js';
import createWrapper from '../../../../lib/components/test-utils/selectors';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { FlashbarInteractivePage } from './interactive-page';

export const flashbar = createWrapper().findFlashbar();

export class FlashbarBasePage extends BasePageObject {
  async toggleCollapsedState() {
    const selector = this.getNotificationBar();
    await this.click(selector);
  }

  countFlashes() {
    return this.getElementsCount(createWrapper().findFlashbar().findItems().toSelector());
  }

  getNotificationBar() {
    return createWrapper().findFlashbar().findByClassName(selectors['notification-bar']).toSelector();
  }

  isFlashFocused(index: number) {
    return this.isFocused(
      flashbar.findItems().get(index).findByClassName(selectors['flash-focus-container']).toSelector()
    );
  }
}

export const setupTest = (path: string, testFn: (page: FlashbarInteractivePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new FlashbarInteractivePage(browser);
    await browser.url(`#/light/flashbar/${path}`);
    await page.waitForVisible(flashbar.toSelector());
    await testFn(page);
  });
};
