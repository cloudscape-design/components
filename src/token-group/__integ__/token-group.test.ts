// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const tokenGroupWrapper = createWrapper().findTokenGroup('#test');

class TokenGroupPage extends BasePageObject {
  getActiveElementAttribute(attributeName: string) {
    return this.browser.execute(function (attributeName) {
      return document.activeElement!.getAttribute(attributeName);
    }, attributeName);
  }

  clickDismissButton(itemIndex: number) {
    return this.click(tokenGroupWrapper.findToken(itemIndex).findDismiss().getElement());
  }

  countItems() {
    return this.getElementsCount(tokenGroupWrapper.findTokens().toSelector());
  }

  async resetFocus() {
    await this.click('.focus-element');
  }
}

const setupTest = (testFn: (page: TokenGroupPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new TokenGroupPage(browser);
    await browser.url('#/light/token-group/index');
    await page.waitForVisible(tokenGroupWrapper.findToken(1).toSelector());
    await testFn(page);
  });
};

test(
  'should fire the dismiss event when clicking on the dismiss button',
  setupTest(async page => {
    await page.clickDismissButton(3);
    await expect(page.countItems()).resolves.toBe(2);
  })
);

describe('Keyboard interaction', () => {
  ['Space', 'Enter'].forEach(confirmKey => {
    test(
      `should fire the dismiss event on ${confirmKey} key`,
      setupTest(async page => {
        await page.resetFocus();
        await page.keys(['Tab', confirmKey]);
        await expect(page.countItems()).resolves.toBe(2);
      })
    );
  });
  test(
    'should not focus on a dismiss button of a disabled token when tabbing',
    setupTest(async page => {
      await page.resetFocus();
      await page.keys(['Tab', 'Tab']);
      await expect(page.getActiveElementAttribute('aria-label')).resolves.toBe('Remove item 3');
    })
  );
});
