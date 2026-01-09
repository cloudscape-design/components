// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import tooltipStyles from '../../../lib/components/tooltip/styles.selectors.js';

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
    'shows tooltip on hover',
    useBrowser(async browser => {
      await browser.url('/#/light/tooltip/simple');
      const page = new TooltipPageObject(browser);

      // Wait for page to load
      await page.waitForVisible('[data-testid="hover-button"]');

      // Test hover - tooltip should appear
      await page.hoverElement('[data-testid="hover-button"]');

      await expect(page.isTooltipVisible()).resolves.toBe(true);
    })
  );

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
    'changes tooltip position when SegmentedControl changes',
    useBrowser(async browser => {
      await browser.url('/#/light/tooltip/simple');
      const page = new TooltipPageObject(browser);

      await page.waitForVisible('[data-testid="hover-button"]');

      // Start with 'top' position (default)
      await page.hoverElement('[data-testid="hover-button"]');
      await page.waitForTooltip();
      let content = await page.getTooltipContent();
      expect(content).toBe('Tooltip positioned on top');

      // Move mouse away to hide tooltip
      await page.hoverElement('body');
      await page.waitForTooltipToDisappear();

      // Click 'Right' in SegmentedControl
      await page.click('[data-testid="right"]');

      // Hover again to show tooltip with new position
      await page.hoverElement('[data-testid="hover-button"]');
      await page.waitForTooltip();
      content = await page.getTooltipContent();
      expect(content).toBe('Tooltip positioned on right');

      // Move mouse away
      await page.hoverElement('body');
      await page.waitForTooltipToDisappear();

      // Click 'Bottom' in SegmentedControl
      await page.click('[data-testid="bottom"]');

      // Hover again to show tooltip with new position
      await page.hoverElement('[data-testid="hover-button"]');
      await page.waitForTooltip();
      content = await page.getTooltipContent();
      expect(content).toBe('Tooltip positioned on bottom');

      // Move mouse away
      await page.hoverElement('body');
      await page.waitForTooltipToDisappear();

      // Click 'Left' in SegmentedControl
      await page.click('[data-testid="left"]');

      // Hover again to show tooltip with new position
      await page.hoverElement('[data-testid="hover-button"]');
      await page.waitForTooltip();
      content = await page.getTooltipContent();
      expect(content).toBe('Tooltip positioned on left');
    })
  );

  test(
    'shows full text in tooltip for truncated content',
    useBrowser(async browser => {
      await browser.url('/#/light/tooltip/simple');
      const page = new TooltipPageObject(browser);

      await page.waitForVisible('[data-testid="truncated-text-button"]');

      // Hover over the truncated text button
      await page.hoverElement('[data-testid="truncated-text-button"]');
      await page.waitForTooltip();

      // Verify tooltip shows the complete text
      const content = await page.getTooltipContent();
      expect(content).toBe('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt');
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
