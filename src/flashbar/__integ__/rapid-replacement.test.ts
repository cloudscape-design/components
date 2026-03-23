// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { FlashbarBasePage } from './pages/base';

const flashbar = createWrapper().findFlashbar();

class RapidReplacementPage extends FlashbarBasePage {
  async triggerLoadingToSuccess() {
    await this.click('[data-id="loading-to-success"]');
  }

  async triggerRapidCycle() {
    await this.click('[data-id="rapid-cycle"]');
  }

  async clear() {
    await this.click('[data-id="clear"]');
  }

  getItemCount() {
    return this.getElementsCount(flashbar.findItems().toSelector());
  }

  getFirstItemText() {
    const selector = flashbar.findItems().get(1).toSelector();
    return this.getText(selector);
  }
}

const setupTest = (testFn: (page: RapidReplacementPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new RapidReplacementPage(browser);
    await browser.url('#/light/flashbar/rapid-replacement');
    await page.waitForVisible('h1');
    await testFn(page);
  });
};

describe('Flashbar rapid item replacement', () => {
  test(
    'replacing a loading flash with a success flash shows only the success flash',
    setupTest(async page => {
      await page.triggerLoadingToSuccess();

      await page.pause(500);

      const count = await page.getItemCount();
      expect(count).toBe(1);

      const text = await page.getFirstItemText();
      expect(text).toContain('Success');
    })
  );

  test(
    'rapidly cycling through three items shows only the final item',
    setupTest(async page => {
      await page.triggerRapidCycle();

      await page.pause(500);

      const count = await page.getItemCount();
      expect(count).toBe(1);

      const text = await page.getFirstItemText();
      expect(text).toContain('Complete');
    })
  );
});
