// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const fileInputWrapper = wrapper.findFileInput();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/file-input/integ');
    await page.waitForVisible(fileInputWrapper.toSelector());
    await testFn(page);
  });
};

describe('FileInput', () => {
  test(
    'visible in viewport when input is focused',
    setupTest(async page => {
      await page.click('#focus-before');
      await page.keys(['Tab']);

      // Check that the file input is still in the viewport
      await expect(page.isDisplayedInViewport(fileInputWrapper.findTrigger().toSelector())).resolves.toBe(true);
    })
  );

  test(
    'does not scroll the page if the button is already visible',
    setupTest(async page => {
      await page.click('#focus-before');
      await page.keys(['Tab']);
      const beforeScrollPosition = await page.getWindowScroll();

      await page.click('#focus-after');
      await page.keys(['Shift', 'Tab']);
      const afterScrollPosition = await page.getWindowScroll();

      // Check that the positions are the same
      expect(beforeScrollPosition).toStrictEqual(afterScrollPosition);
    })
  );
});
