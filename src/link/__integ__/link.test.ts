// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class LinkPageObject extends BasePageObject {
  getClickMessage() {
    return this.getText('#click-message');
  }
}

describe('Link', () => {
  describe('role="link"', () => {
    test(
      'enter key triggers link',
      useBrowser(async browser => {
        await browser.url('#/light/link/integration');
        const page = new LinkPageObject(browser);
        await page.waitForVisible(wrapper.findLink('#role-link').toSelector());
        await expect(page.getClickMessage()).resolves.toBe('0 times clicked');
        await page.click('#role-link-focus-target');
        await page.keys(['Tab', 'Enter']);
        await expect(page.getClickMessage()).resolves.toBe('1 times clicked');
      })
    );

    test(
      'space key does not trigger link',
      useBrowser(async browser => {
        await browser.url('#/light/link/integration');
        const page = new LinkPageObject(browser);
        await page.waitForVisible(wrapper.findLink('#role-link').toSelector());
        await expect(page.getClickMessage()).resolves.toBe('0 times clicked');
        await page.click('#role-link-focus-target');
        await page.keys(['Tab', 'Space']);
        await expect(page.getClickMessage()).resolves.toBe('0 times clicked');
      })
    );
  });

  describe('Button Link', () => {
    test(
      'enter key and space key trigger link',
      useBrowser(async browser => {
        await browser.url('#/light/link/integration');
        const page = new LinkPageObject(browser);
        await page.waitForVisible(wrapper.findLink('#role-button').toSelector());
        await expect(page.getClickMessage()).resolves.toBe('0 times clicked');
        await page.click('#role-button-focus-target');
        await page.keys(['Tab', 'Enter', 'Space']);
        await expect(page.getClickMessage()).resolves.toBe('2 times clicked');
      })
    );
  });
});
