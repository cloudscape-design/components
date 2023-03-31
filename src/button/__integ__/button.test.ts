// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class ButtonPageObject extends BasePageObject {
  getClickMessage() {
    return this.getText('#clickMessage');
  }
}

describe('Button', () => {
  test(
    'enter key in form triggers button click',
    useBrowser(async browser => {
      await browser.url('#/light/button/form-submit');
      const page = new ButtonPageObject(browser);
      await page.waitForVisible('#keyInput');
      await expect(page.getClickMessage()).resolves.toBe('');
      await page.click('#keyInput');
      await page.keys('Enter');
      await expect(page.getClickMessage()).resolves.toBe('Submit button is triggered');
    })
  );

  test(
    'switches to next button by tab skipping the disabled ones',
    useBrowser(async browser => {
      await browser.url('#/light/button/tab-navigation');
      const page = new ButtonPageObject(browser);
      await page.waitForVisible(wrapper.findButton('#focusButton').toSelector());
      await page.click(wrapper.findButton('#focusButton').toSelector());
      await expect(page.getFocusedElementText()).resolves.toBe('Start button');
      await page.keys('Tab');
      await expect(page.getFocusedElementText()).resolves.toBe('Active with href');
      await page.keys('Tab');
      // disabled button in the middle should be skipped
      await expect(page.getFocusedElementText()).resolves.toBe('Loading');
      await page.keys('Tab');
      await expect(page.getFocusedElementText()).resolves.toBe('Last button');
    })
  );
});
