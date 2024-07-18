// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { CardsWrapper } from '../../../lib/components/test-utils/selectors';

export default class CardsPage extends BasePageObject {
  wrapper: CardsWrapper = new CardsWrapper(createWrapper('body').find(`.${CardsWrapper.rootSelector}`).getElement());

  isSelectionInputFocused = (index: number) => {
    return this.isFocused(this.wrapper.findItems().get(index).find('input').toSelector());
  };

  getActiveElement = async () => {
    const element = await this.browser.getActiveElement();
    return this.browser.$(element);
  };
}

function setupTest(testFn: (page: CardsPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new CardsPage(browser);
    await browser.url('/#/light/cards/selection');
    await testFn(page);
  });
}

describe('Cards selection', () => {
  test(
    'Clicking the wrapper focuses the selection control',
    setupTest(async page => {
      await page.click(page.wrapper.findItems().get(1).findSelectionArea().toSelector());
      expect(await page.isSelectionInputFocused(1)).toBeTruthy();
    })
  );
  test(
    'Keyboard interactions',
    setupTest(async page => {
      await page.click(page.wrapper.findItems().get(1).findSelectionArea().toSelector());
      // keeps the first item focused, when going "up" from it
      await page.keys('ArrowUp');
      expect(await page.isSelectionInputFocused(1)).toBeTruthy();
      // moves the focus to the second item
      await page.keys('ArrowDown');
      expect(await page.isSelectionInputFocused(2)).toBeTruthy();
    })
  );
});
