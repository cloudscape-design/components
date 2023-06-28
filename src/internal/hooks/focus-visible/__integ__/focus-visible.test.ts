// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

describe('focus-visible', () => {
  const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);
      await browser.url('#/light/focus-visible');
      await page.waitForVisible(wrapper.findButton().toSelector());
      await testFn(page);
    });
  };

  test(
    'focus ring updates when switching from keyboard to mouse and back',
    setupTest(async page => {
      await page.click('#first-button');
      await expect(page.getElementAttribute('body', 'data-awsui-focus-visible')).resolves.toBeNull();
      await page.keys('Tab');
      await expect(page.getElementAttribute('body', 'data-awsui-focus-visible')).resolves.toBe('true');
      await page.click('#second-button');
      await expect(page.getElementAttribute('body', 'data-awsui-focus-visible')).resolves.toBeNull();
    })
  );
});
