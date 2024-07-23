// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import TextareaPage from './page-objects/textarea';

describe('Textarea', () => {
  const setupTest = (testFn: (page: TextareaPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new TextareaPage(browser);
      page.visit('#/light/textarea/integration');
      await testFn(page);
    });
  };

  test(
    'Should not submit the form via keyboard in textarea',
    setupTest(async page => {
      await page.focusTextarea();
      await page.keys(['Enter']);
      await expect(page.isFormSubmitted()).resolves.toBe(false);
    })
  );
});
