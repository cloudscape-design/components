// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

class TokenPage extends BasePageObject {
  getTokenWrapper(selector: string) {
    return createWrapper().findToken(selector);
  }

  isTokenDismissButtonPresent(selector: string) {
    const tokenWrapper = this.getTokenWrapper(selector);
    const dismissButton = tokenWrapper.findDismiss();
    return this.isExisting(dismissButton.toSelector());
  }

  isIconVisible(iconTestId: string) {
    return this.isExisting(iconTestId);
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

  getTokenTags(selector: string) {
    const tokenWrapper = this.getTokenWrapper(selector);
    return tokenWrapper.findTags();
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
        const label = page.getTokenLabel('[data-testid="basic-inline-token"]');
        const labelText = await page.getText(label.toSelector());
        expect(labelText).toBe('Inline token');
      })
    );

    test(
      'dismissable token has dismiss button',
      setupTest(async page => {
        const hasDismissButton = await page.isTokenDismissButtonPresent('[data-testid="inline-token-dismissable"]');
        expect(hasDismissButton).toBeTruthy();
      })
    );

    test(
      'token with icon displays icon correctly',
      setupTest(async page => {
        // Check if the token with icon exists
        const tokenSelector = '[data-testid="normal-token-with-icon-dismissable"]';
        const tokenWrapper = page.getTokenWrapper(tokenSelector);
        const tokenExists = await page.isExisting(tokenWrapper.toSelector());
        expect(tokenExists).toBeTruthy();

        // Use the isIconVisible method to check for the specific icon
        const iconExists = await page.isIconVisible('[data-testid="token-bug-icon"]');
        expect(iconExists).toBeTruthy();
      })
    );

    test(
      'token displays label tag',
      setupTest(async page => {
        const labelTag = page.getTokenLabelTag('[data-testid="normal-token-dismissable"]');
        const labelTagText = await page.getText(labelTag.toSelector());
        expect(labelTagText).toBe('test');
      })
    );

    test(
      'token displays description',
      setupTest(async page => {
        const description = page.getTokenDescription('[data-testid="normal-token-with-icon-dismissable"]');
        const descriptionText = await page.getText(description.toSelector());
        expect(descriptionText).toBe('some description');
      })
    );

    test(
      'token displays tags correctly',
      setupTest(async page => {
        const tokenSelector = '[data-testid="normal-token-with-icon-dismissable"]';
        const tags = page.getTokenTags(tokenSelector);
        const tagsExist = await page.isExisting(tags.toSelector());
        expect(tagsExist).toBeTruthy();

        // Check the text content of the tags
        const tagsText = await page.getText(tags.toSelector());
        expect(tagsText).toContain('tag');
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
