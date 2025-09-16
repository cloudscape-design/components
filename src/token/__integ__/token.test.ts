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
  describe('Basic token properties', () => {
    test(
      'basic inline token displays correct label',
      setupTest(async page => {
        const label = await page.getTokenLabel('[data-testid="basic-inline-token"]');
        const labelText = await page.getText(label.toSelector());
        expect(labelText).toBe('Inline token');
      })
    );

    test(
      'normal token with JSX displays correct label',
      setupTest(async page => {
        const label = await page.getTokenLabel('[data-testid="normal-token-with-popover"]');
        const popover = label.findPopover();
        expect(popover).not.toBeNull();
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
        const selector = '[data-testid="inline-token-with-icon-dismissable-with-popover"]';
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
        const labelText = await page.getText(label.toSelector());
        const descriptionText = await page.getText(description.toSelector());
        expect(labelText).toBe('Dismissable token');
        expect(descriptionText).toBe('some description');
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
        const labelTagText = await page.getText(labelTag.toSelector());
        expect(labelTagText).toBe('test');
      })
    );
  });

  describe('Tooltip behavior', () => {
    test(
      'tooltip shows full label for truncated inline token',
      setupTest(async page => {
        const inlineSelector = '[data-testid="inline-token-long-text"]';

        const label = await page.getTokenLabel(inlineSelector);
        const labelText = await page.getText(label.toSelector());

        await page.hoverToken(inlineSelector);
        const isInlineTooltipVisible = await page.isTooltipVisible();
        expect(isInlineTooltipVisible).toBe(true);

        const tooltipContent = await page.getTooltipContent();
        expect(tooltipContent).toBe(labelText);
      })
    );

    test(
      'tooltip does not show for short inline tokens',
      setupTest(async page => {
        const shortSelector = '[data-testid="basic-inline-token"]';
        await page.hoverToken(shortSelector);
        // Wait a bit to ensure tooltip would have appeared if it was going to
        await page.pause(500);
        const isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(false);
      })
    );

    test(
      'tooltip appears on focus for truncated inline token',
      setupTest(async page => {
        const inlineSelector = '[data-testid="inline-token-long-text"]';

        const label = await page.getTokenLabel(inlineSelector);
        const labelText = await page.getText(label.toSelector());

        // Focus the token instead of hovering
        await page.focusElement(page.getTokenWrapper(inlineSelector).toSelector());
        const isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(true);

        const tooltipContent = await page.getTooltipContent();
        expect(tooltipContent).toBe(labelText);
      })
    );

    test(
      'tooltip disappears when mouse leaves token',
      setupTest(async page => {
        const inlineSelector = '[data-testid="inline-token-long-text"]';
        // First hover to show tooltip
        await page.hoverToken(inlineSelector);
        let isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(true);

        // Move mouse away from token
        await page.hoverElement('h1'); // Hover over page title instead
        await page.pause(200); // Wait for tooltip to disappear

        isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(false);
      })
    );

    test(
      'tooltip disappears when token loses focus',
      setupTest(async page => {
        const inlineSelector = '[data-testid="inline-token-long-text"]';
        // Focus to show tooltip
        await page.focusElement(page.getTokenWrapper(inlineSelector).toSelector());
        let isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(true);

        // Focus something else to hide tooltip
        await page.focusElement('h1');
        await page.pause(200); // Wait for tooltip to disappear

        isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(false);
      })
    );

    test(
      'normal variant tokens do not show tooltips',
      setupTest(async page => {
        const normalSelector = '[data-testid="normal-token-with-icon-dismissable"]';
        await page.hoverToken(normalSelector);
        await page.pause(500); // Wait to ensure tooltip would have appeared
        const isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(false);
      })
    );
  });

  describe('Accessibility and keyboard navigation', () => {
    test(
      'inline token with long text is focusable and shows tooltip',
      setupTest(async page => {
        const inlineSelector = '[data-testid="inline-token-long-text"]';
        const tokenElement = page.getTokenWrapper(inlineSelector).toSelector();

        // Check if token is focusable (has tabindex)
        const tabIndex = await page.getElementAttribute(tokenElement, 'tabindex');
        expect(tabIndex).toBe('0');

        // Focus and verify tooltip appears
        await page.focusElement(tokenElement);
        const isTooltipVisible = await page.isTooltipVisible();
        expect(isTooltipVisible).toBe(true);
      })
    );

    test(
      'short inline tokens are not focusable',
      setupTest(async page => {
        const shortSelector = '[data-testid="basic-inline-token"]';
        const tokenElement = page.getTokenWrapper(shortSelector).toSelector();

        // Check that short tokens don't have tabindex (not focusable)
        const tabIndex = await page.getElementAttribute(tokenElement, 'tabindex');
        expect(tabIndex).toBeNull();
      })
    );

    test(
      'dismissable tokens with JSX element labels have proper role attribute',
      setupTest(async page => {
        // This token has a JSX element label (Popover component), so it should get role="group"
        const jsxLabelSelector = '[data-testid="inline-token-with-icon-dismissable-with-popover"]';
        const jsxTokenElement = page.getTokenWrapper(jsxLabelSelector).toSelector();

        const jsxRole = await page.getElementAttribute(jsxTokenElement, 'role');
        expect(jsxRole).toBe('group');
      })
    );

    test(
      'normal variant tokens with string labels have role attribute',
      setupTest(async page => {
        // This normal token has a string label, so it should get role attribute (normal variant gets role regardless of content type)
        const normalStringSelector = '[data-testid="normal-token-dismissable"]';
        const normalStringElement = page.getTokenWrapper(normalStringSelector).toSelector();

        const normalRole = await page.getElementAttribute(normalStringElement, 'role');
        expect(normalRole).toBe('group');
      })
    );

    test(
      'inline variant tokens with string labels have no role attribute',
      setupTest(async page => {
        // This inline token has a string label, so it should NOT get role attribute (inline variant requires JSX element)
        const inlineStringSelector = '[data-testid="inline-token-dismissable"]';
        const inlineStringElement = page.getTokenWrapper(inlineStringSelector).toSelector();

        const inlineRole = await page.getElementAttribute(inlineStringElement, 'role');
        expect(inlineRole).toBeNull();
      })
    );

    test(
      'dismissable tokens with JSX element labels have aria-disabled attribute',
      setupTest(async page => {
        // This token has a JSX element label (Popover component), so it should get aria-disabled
        const jsxLabelSelector = '[data-testid="inline-token-with-icon-dismissable-with-popover"]';
        const jsxTokenElement = page.getTokenWrapper(jsxLabelSelector).toSelector();

        const ariaDisabled = await page.getElementAttribute(jsxTokenElement, 'aria-disabled');
        expect(ariaDisabled).toBe('false'); // Should be 'false' since token is not disabled
      })
    );

    test(
      'normal variant tokens with string labels have aria-disabled attribute',
      setupTest(async page => {
        // This normal token has a string label, so it should get aria-disabled (normal variant gets aria-disabled regardless of content type)
        const normalStringSelector = '[data-testid="normal-token-dismissable"]';
        const normalStringElement = page.getTokenWrapper(normalStringSelector).toSelector();

        const ariaDisabled = await page.getElementAttribute(normalStringElement, 'aria-disabled');
        expect(ariaDisabled).toBe('false'); // Should be 'false' since token is not disabled
      })
    );

    test(
      'inline variant tokens with string labels have no aria-disabled attribute',
      setupTest(async page => {
        // This inline token has a string label, so it should NOT get aria-disabled (inline variant requires JSX element)
        const inlineStringSelector = '[data-testid="inline-token-dismissable"]';
        const inlineStringElement = page.getTokenWrapper(inlineStringSelector).toSelector();

        const ariaDisabled = await page.getElementAttribute(inlineStringElement, 'aria-disabled');
        expect(ariaDisabled).toBeNull();
      })
    );

    test(
      'non-dismissable tokens have no accessibility attributes',
      setupTest(async page => {
        const basicSelector = '[data-testid="basic-inline-token"]';
        const tokenElement = page.getTokenWrapper(basicSelector).toSelector();

        const role = await page.getElementAttribute(tokenElement, 'role');
        const ariaDisabled = await page.getElementAttribute(tokenElement, 'aria-disabled');

        // Non-dismissable tokens should not have role or aria-disabled regardless of label type
        expect(role).toBeNull();
        expect(ariaDisabled).toBeNull();
      })
    );
  });
});
