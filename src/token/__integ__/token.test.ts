// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

class TokenPage extends BasePageObject {
  getTokenWrapper(selector: string) {
    return createWrapper().findToken(selector);
  }

  async hoverToken(selector: string) {
    await this.hoverElement(this.getTokenWrapper(selector).toSelector());
  }

  isTooltipVisible() {
    return this.isExisting(createWrapper().findByClassName('token-tooltip').toSelector());
  }

  async getTooltipContent() {
    await this.waitForVisible(createWrapper().findByClassName('token-tooltip').toSelector());
    return this.getText(createWrapper().find('[data-testid="tooltip-live-region-content"]').toSelector());
  }

  isTokenDismissButtonPresent(selector: string) {
    const tokenWrapper = this.getTokenWrapper(selector);
    const dismissButton = tokenWrapper.findDismiss();
    return this.isExisting(dismissButton.toSelector());
  }

  isIconVisible(iconTestId: string) {
    return this.isExisting(`[data-testid="${iconTestId}"]`);
  }

  async focusElement(selector: string) {
    await this.click(selector);
  }

  async pause(ms: number) {
    await this.browser.pause(ms);
  }

  getTokenLabelTag(selector: string) {
    const tokenWrapper = this.getTokenWrapper(selector);
    return tokenWrapper.findLabelTag();
  }

  getTokenLabel(selector: string) {
    const tokenWrapper = this.getTokenWrapper(selector);
    return tokenWrapper.findLabel();
  }

  getTokenDescription(selector: string) {
    const tokenWrapper = this.getTokenWrapper(selector);
    return tokenWrapper.findDescription();
  }
}

function setupTest(testFn: (page: TokenPage) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('#/light/token/simple');
    const page = new TokenPage(browser);
    await page.waitForVisible('h1');
    await testFn(page);
  });
}

describe('Token component', () => {
  describe('Basic rendering', () => {
    test(
      'inline token displays correct label',
      setupTest(async page => {
        const label = await page.getTokenLabel('[data-testid="basic-inline-token"]');
        const labelText = await page.getText(label.toSelector());
        expect(labelText).toBe('Inline token');
      })
    );

    test(
      'dismissable token has dismiss button',
      setupTest(async page => {
        const hasDismissButton = await page.isTokenDismissButtonPresent('[data-testid="inline-token-dismissable"]');
        expect(hasDismissButton).toBe(true);
      })
    );
  });

  describe('Tooltip behavior', () => {
    test(
      'tooltip shows for truncated inline token on hover',
      setupTest(async page => {
        const selector = '[data-testid="inline-token-long-text"]';
        const label = await page.getTokenLabel(selector);
        const labelText = await page.getText(label.toSelector());

        await page.hoverToken(selector);
        const isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(true);

        const tooltipContent = await page.getTooltipContent();
        expect(tooltipContent).toBe(labelText);
      })
    );

    test(
      'tooltip shows for truncated inline token on focus',
      setupTest(async page => {
        const selector = '[data-testid="inline-token-long-text"]';
        await page.focusElement(page.getTokenWrapper(selector).toSelector());
        const isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(true);
      })
    );

    test(
      'no tooltip for short inline tokens',
      setupTest(async page => {
        const selector = '[data-testid="basic-inline-token"]';
        await page.hoverToken(selector);
        await page.pause(300);
        const isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(false);
      })
    );
  });

  describe('Accessibility', () => {
    test(
      'truncated inline token is focusable',
      setupTest(async page => {
        const selector = '[data-testid="inline-token-long-text"]';
        const tokenElement = page.getTokenWrapper(selector).toSelector();
        const tabIndex = await page.getElementAttribute(tokenElement, 'tabindex');
        expect(tabIndex).toBe('0');
      })
    );

    test(
      'short inline tokens are not focusable',
      setupTest(async page => {
        const selector = '[data-testid="basic-inline-token"]';
        const tokenElement = page.getTokenWrapper(selector).toSelector();
        const tabIndex = await page.getElementAttribute(tokenElement, 'tabindex');
        expect(tabIndex).toBeNull();
      })
    );

    test(
      'tokens have proper accessibility attributes',
      setupTest(async page => {
        const selector = '[data-testid="basic-inline-token"]';
        const tokenElement = page.getTokenWrapper(selector).toSelector();
        const role = await page.getElementAttribute(tokenElement, 'role');
        const ariaDisabled = await page.getElementAttribute(tokenElement, 'aria-disabled');
        const ariaLabelledby = await page.getElementAttribute(tokenElement, 'aria-labelledby');

        expect(role).toBe('group');
        expect(ariaDisabled).toBe('false');
        expect(ariaLabelledby).toBeTruthy();
      })
    );
  });
});
