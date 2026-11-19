// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import InputPage from './page-objects/input';

describe('Input', () => {
  const setupTest = (testFn: (page: InputPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new InputPage(browser);
      await page.visit('#/light/input/input-integ');
      await testFn(page);
    });
  };

  test(
    'Should submit the form via keyboard in awsui-input',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['Enter']);
      await expect(page.isFormSubmitted()).resolves.toBe(true);
    })
  );

  test(
    'Should not submit the form via keyboard in awsui-input if keyboard event is prevented',
    setupTest(async page => {
      await page.disableFormSubmitting();
      await page.focusInput();
      await page.keys(['Enter']);
      await expect(page.isFormSubmitted()).resolves.toBe(false);
    })
  );

  test(
    'Clicking on form field label should focus the input',
    useBrowser(async browser => {
      await browser.url('#/light/input/inputs');
      const page = new InputPage(browser);
      const wrapper = createWrapper();
      await page.click(wrapper.findFormField().findLabel().toSelector());
      await expect(
        page.isFocused(wrapper.find('#formfield-with-input').findInput().findNativeInput().toSelector())
      ).resolves.toBe(true);
    })
  );
});
