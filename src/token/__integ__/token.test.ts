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

  async isTooltipVisible() {
    try {
      return await this.isExisting(createWrapper().findByClassName('token-tooltip').toSelector());
    } catch {
      return false;
    }
  }

  async getTooltipContent() {
    await this.waitForVisible(createWrapper().findByClassName('token-tooltip').toSelector());
    return this.getText(createWrapper().findByClassName('token-tooltip').toSelector());
  }

  async isTokenDismissButtonPresent(selector: string) {
    try {
      const tokenWrapper = this.getTokenWrapper(selector);
      const dismissButton = await tokenWrapper.findDismiss();
      return await this.isExisting(dismissButton.toSelector());
    } catch {
      return false;
    }
  }

  async isIconVisible(iconTestId: string) {
    try {
      return await this.isExisting(`[data-testid="${iconTestId}"]`);
    } catch {
      return false;
    }
  }

  async getTokenLabelTag(selector: string) {
    try {
      const tokenWrapper = this.getTokenWrapper(selector);
      const labelTag = await tokenWrapper.findLabelTag();
      return await this.getText(labelTag.toSelector());
    } catch {
      return '';
    }
  }

  async getTokenLabel(selector: string) {
    try {
      const tokenWrapper = this.getTokenWrapper(selector);
      const label = await tokenWrapper.findLabel();
      return await this.getText(label.toSelector());
    } catch {
      return '';
    }
  }

  async getTokenDescription(selector: string) {
    try {
      const tokenWrapper = this.getTokenWrapper(selector);
      const description = await tokenWrapper.findDescription();
      return await this.getText(description.toSelector());
    } catch {
      return '';
    }
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
  describe('Basic token properties', () => {
    test(
      'basic inline token displays correct label',
      setupTest(async page => {
        const label = await page.getTokenLabel('[data-testid="basic-inline-token"]');
        expect(label).toBe('Inline token');
      })
    );

    test(
      'dismissable token has dismiss button',
      setupTest(async page => {
        const hasDismissButton = await page.isTokenDismissButtonPresent('[data-testid="inline-token-dismissable"]');
        expect(hasDismissButton).toBe(true);
      })
    );

    test(
      'token with icon and dismiss button has both elements',
      setupTest(async page => {
        const selector = '[data-testid="inline-token-with-icon-dismissable"]';
        const hasDismissButton = await page.isTokenDismissButtonPresent(selector);
        const hasIcon = await page.isIconVisible('edit-icon-small');
        expect(hasDismissButton).toBe(true);
        expect(hasIcon).toBe(true);
      })
    );

    test(
      'normal token with icon and description displays correctly',
      setupTest(async page => {
        const selector = '[data-testid="normal-token-with-icon-dismissable"]';
        const label = await page.getTokenLabel(selector);
        const description = await page.getTokenDescription(selector);
        const hasIcon = await page.isIconVisible('bug-icon-big');
        const hasDismissButton = await page.isTokenDismissButtonPresent(selector);
        expect(label).toBe('Dismissable token');
        expect(description).toBe('some description');
        expect(hasIcon).toBe(true);
        expect(hasDismissButton).toBe(true);
      })
    );
  });

  describe('Token additional properties', () => {
    test(
      'normal token with labelTag displays the tag correctly',
      setupTest(async page => {
        const selector = '[data-testid="normal-token-dismissable"]';
        const labelTag = await page.getTokenLabelTag(selector);
        expect(labelTag).toBe('test');
      })
    );
  });

  describe('Tooltip behavior', () => {
    test(
      'tooltip shows full label for truncated inline token',
      setupTest(async page => {
        const inlineSelector = '[data-testid="inline-token-long-text"]';
        const tokenLabel = await page.getTokenLabel(inlineSelector);
        await page.hoverToken(inlineSelector);
        const isInlineTooltipVisible = await page.isTooltipVisible();
        expect(isInlineTooltipVisible).toBe(true);
        const tooltipContent = await page.getTooltipContent();
        expect(tooltipContent).toEqual(tokenLabel);
      })
    );
  });
});
