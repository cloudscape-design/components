// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
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
});
