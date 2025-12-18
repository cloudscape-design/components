// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import tooltipStyles from '../../../lib/components/tooltip/styles.selectors.js';

class TooltipPageObject extends BasePageObject {
  async waitForTooltip() {
    console.log('Waiting for tooltip with selector:', `.${tooltipStyles.root}`);
    await this.waitForVisible(`.${tooltipStyles.root}`);
  }

  isTooltipVisible() {
    return this.isDisplayed(`.${tooltipStyles.root}`);
  }

  getTooltipContent() {
    return this.getText(`.${tooltipStyles.root}`);
  }
}

describe('Tooltip', () => {
  test(
    'shows tooltip on hover, checks content and closes with escape',
    useBrowser(async browser => {
      await browser.url('/#/light/tooltip/simple');
      const page = new TooltipPageObject(browser);

      // Wait for page to load
      await page.waitForVisible('[data-testid="hover-button"]');

      // // Test hover
      await page.hoverElement('[data-testid="hover-button"]');

      // await page.waitForTooltip();
      await expect(page.isTooltipVisible()).resolves.toBe(true);
      console.log('JJAAAA');

      const content = await page.getTooltipContent();
      expect(content).toBe('Tooltip positioned on top');
      console.log(content);

      await browser.keys('Escape');
      await expect(page.isTooltipVisible()).resolves.toBe(false);

      // await expect(page.isTooltipVisible()).resolves.toBe(false);

      // Verify content is not accessible when tooltip is hidden
      // await expect(page.getTooltipContent()).resolves.toBe('');
      // expect(content).toBe('Expected tooltip text');
      // // Move away to hide tooltip
      // await page.hoverElement('body');
      // await expect(page.isTooltipVisible()).resolves.toBe(false);

      // // Test keyboard focus
      // await page.click('[data-testid="hover-button"]');
      // await page.waitForTooltip();
      // await expect(page.isTooltipVisible()).resolves.toBe(true);
    })
  );
});
