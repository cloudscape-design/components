// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';
import selectors from '../../../lib/components/flashbar/styles.selectors.js';

const initialCount = 5;
const flashbar = createWrapper().findFlashbar();

class FlashbarInteractivePage extends BasePageObject {
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

  isFlashFocused(index: number) {
    return this.isFocused(
      flashbar.findItems().get(index).findByClassName(selectors['flash-focus-container']).toSelector()
    );
  }
}

const setupTest = (testFn: (page: FlashbarInteractivePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new FlashbarInteractivePage(browser);
    await browser.url(`#/light/flashbar/interactive`);
    await page.waitForVisible(flashbar.toSelector());
    await testFn(page);
  });
};

test(
  'adding flash with ariaRole="status" does not move focus',
  setupTest(async page => {
    await page.addInfoFlash();
    return expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(false);
  })
);

test(
  'adding flash with ariaRole="alert" moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlash();
    return expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(true);
  })
);

test(
  'adding new non-alert flashes does not move focus to previous alert flashes',
  setupTest(async page => {
    await page.addErrorFlash();
    await expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(true);
    await page.addInfoFlash();
    await expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(false);
  })
);

test(
  'adding flash with ariaRole="alert" to the top moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlashToTop();
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);

test(
  'adding multiple flashes with ariaRole="alert" throttles focus moves',
  setupTest(async page => {
    await page.addSequentialErrorFlashes();
    return expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(true);
  })
);
