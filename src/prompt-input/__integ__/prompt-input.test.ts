// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

const promptInputWrapper = createWrapper().findPromptInput();

class PromptInputPage extends BasePageObject {
  async getPromptInputHeight() {
    const { height } = await this.getBoundingBox(promptInputWrapper.toSelector());
    return height;
  }
}

const setupTest = (testFn: (page: PromptInputPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new PromptInputPage(browser);
    await browser.url(`#/light/prompt-input/simple`);
    await page.waitForVisible(promptInputWrapper.toSelector());
    await testFn(page);
  });
};
describe('Prompt input', () => {
  test(
    'Height should update based on maxRows property',
    setupTest(async page => {
      await expect(page.getPromptInputHeight()).resolves.toEqual(32);
      await page.click('#placeholder-text-button');
      await expect(page.getPromptInputHeight()).resolves.toEqual(92);
    })
  );
});
