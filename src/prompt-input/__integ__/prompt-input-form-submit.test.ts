// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

const promptInputWrapper = createWrapper().findPromptInput();

class PromptInputPage extends BasePageObject {
  async focusPromptInput() {
    await this.click(promptInputWrapper.findNativeTextarea().toSelector());
  }

  async clickActionButton() {
    await this.click(promptInputWrapper.findActionButton().toSelector());
  }

  async disableFormSubmitting() {
    await this.click('#disable-form-submitting');
  }

  isFormSubmitted() {
    return this.isExisting('#submit-success');
  }
}
const setupTest = (testFn: (page: PromptInputPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new PromptInputPage(browser);
    await browser.url(`#/light/prompt-input/prompt-input-integ`);
    await page.waitForVisible(promptInputWrapper.toSelector());
    await testFn(page);
  });
};
describe('Prompt input', () => {
  test(
    'Should submit the form via key press on action button',
    setupTest(async page => {
      await page.focusPromptInput();
      await page.keys(['Tab']);
      await page.keys(['Enter']);
      await expect(page.isFormSubmitted()).resolves.toBe(true);
    })
  );

  test(
    'Should submit the form via enter key in textarea',
    setupTest(async page => {
      await page.focusPromptInput();
      await page.keys(['Enter']);
      await expect(page.isFormSubmitted()).resolves.toBe(true);
    })
  );

  test(
    'Should submit the form via action button click',
    setupTest(async page => {
      await page.clickActionButton();
      await expect(page.isFormSubmitted()).resolves.toBe(true);
    })
  );

  test(
    'Should not submit the form via keyboard if keyboard event is prevented',
    setupTest(async page => {
      await page.disableFormSubmitting();
      await page.focusPromptInput();
      await page.keys(['Enter']);
      await expect(page.isFormSubmitted()).resolves.toBe(false);
    })
  );
});
