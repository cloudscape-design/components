// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import tooltipStyles from '../../../lib/components/tooltip/test-classes/styles.selectors.js';

class TooltipPageObject extends BasePageObject {
  async waitForTooltip() {
    await this.waitForVisible(`.${tooltipStyles.root}`);
  }

  async waitForTooltipToDisappear() {
    await this.waitForVisible(`.${tooltipStyles.root}`, false);
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
    'shows tooltip on hover and verifies content',
    useBrowser(async browser => {
      await browser.url('/#/light/tooltip/simple');
      const page = new TooltipPageObject(browser);

      await page.waitForVisible('[data-testid="hover-button"]');
      await page.hoverElement('[data-testid="hover-button"]');
      await page.waitForTooltip();

      const content = await page.getTooltipContent();
      expect(content).toBe('Tooltip positioned on top');
    })
  );

  test(
    'hides tooltip when mouse leaves',
    useBrowser(async browser => {
      await browser.url('/#/light/tooltip/simple');
      const page = new TooltipPageObject(browser);

      await page.waitForVisible('[data-testid="hover-button"]');
      await page.hoverElement('[data-testid="hover-button"]');
      await page.waitForTooltip();
      await expect(page.isTooltipVisible()).resolves.toBe(true);

      // Move mouse away
      await page.hoverElement('body');
      await page.waitForTooltipToDisappear();
      await expect(page.isTooltipVisible()).resolves.toBe(false);
    })
  );

  test(
    'closes tooltip on Escape key',
    useBrowser(async browser => {
      await browser.url('/#/light/tooltip/simple');
      const page = new TooltipPageObject(browser);

      await page.waitForVisible('[data-testid="hover-button"]');
      await page.hoverElement('[data-testid="hover-button"]');
      await page.waitForTooltip();
      await expect(page.isTooltipVisible()).resolves.toBe(true);

      await browser.keys('Escape');
      await page.waitForTooltipToDisappear();
      await expect(page.isTooltipVisible()).resolves.toBe(false);
    })
  );

  test(
    'tooltip content can be selected and copied - medium length',
    useBrowser(async browser => {
      await browser.url('/#/light/tooltip/simple');
      const page = new TooltipPageObject(browser);

      await page.waitForVisible('[data-testid="medium-length-button"]');

      // Hover over the medium length button
      await page.hoverElement('[data-testid="medium-length-button"]');
      await page.waitForTooltip();

      // Get the expected text from the tooltip
      const tooltipText = await page.getTooltipContent();
      expect(tooltipText).toBe(
        'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.'
      );

      // Select all text in tooltip
      await browser.execute(() => {
        const tooltip = document.querySelector('[role="tooltip"]');
        if (tooltip) {
          const range = document.createRange();
          range.selectNodeContents(tooltip);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      });

      // Verify text is selected
      const hasSelection = await browser.execute(() => {
        const selection = window.getSelection();
        return selection && selection.toString().length > 0;
      });

      expect(hasSelection).toBe(true);

      // Verify selected text matches tooltip content (normalized)
      const selectedText = await browser.execute(() => {
        return window.getSelection()?.toString().replace(/\s+/g, ' ').trim();
      });

      const expectedText =
        'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.';
      expect(selectedText).toBe(expectedText);

      // Simulate copy operation
      await browser.keys(['Control', 'c']);

      // Verify selection persists after copy
      const stillHasSelection = await browser.execute(() => {
        const selection = window.getSelection();
        return selection && selection.toString().length > 0;
      });

      expect(stillHasSelection).toBe(true);
    })
  );
});
