// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper, { ElementWrapper } from '../../../../../lib/components/test-utils/selectors';

function setupTest(testFn: (page: BasePageObject, wrapper: ElementWrapper) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('#/light/focus-lock');
    const page = new BasePageObject(browser);
    const wrapper = createWrapper();
    await page.waitForVisible(wrapper.findButton().toSelector());
    await testFn(page, wrapper);
  });
}

describe('FocusLock', () => {
  test(
    'focuses first element with autofocus',
    setupTest(async (page, wrapper) => {
      await expect(page.isFocused(wrapper.findInput().findNativeInput().toSelector())).resolves.toBe(true);
    })
  );

  test(
    'returns focus to first element with focusFirst function',
    setupTest(async (page, wrapper) => {
      // Make sure autofocus focused the first input
      await expect(page.isFocused(wrapper.findInput().findNativeInput().toSelector())).resolves.toBe(true);

      // Tab to the button
      await page.keys('Tab');

      // Activate the button
      await page.keys('Enter');

      // Focus moved back to the first element (the input)
      await expect(page.isFocused(wrapper.findInput().findNativeInput().toSelector())).resolves.toBe(true);
    })
  );
});
