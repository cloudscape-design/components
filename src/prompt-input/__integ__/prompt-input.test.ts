// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

const getPromptInputWrapper = (testid = 'prompt-input') => createWrapper().findPromptInput(`[data-testid="${testid}"]`);

class PromptInputPage extends BasePageObject {
  async getPromptInputHeight(testid = 'prompt-input') {
    const { height } = await this.getBoundingBox(getPromptInputWrapper(testid).toSelector());
    return height;
  }
}

const setupTest = (testFn: (page: PromptInputPage) => Promise<void>, additionalUrlParams?: string[]) => {
  return useBrowser(async browser => {
    const page = new PromptInputPage(browser);
    await browser.url(
      `#/light/prompt-input/simple/?isReadOnly=true${additionalUrlParams ? '&' + additionalUrlParams.join('&') : ''}`
    );
    await page.waitForVisible(getPromptInputWrapper().toSelector());
    await testFn(page);
  });
};
describe('Prompt input', () => {
  test(
    'Height should update based on maxRows property',
    setupTest(async page => {
      await expect(page.getPromptInputHeight()).resolves.toEqual(32);
      await page.click('#placeholder-text-button');
      await expect(page.getPromptInputHeight()).resolves.toEqual(96);
    })
  );

  test(
    'Height should update infinitely based on maxRows property being set to -1',
    setupTest(
      async page => {
        await expect(page.getPromptInputHeight()).resolves.toEqual(32);
        await page.click('#placeholder-text-button');
        await expect(page.getPromptInputHeight()).resolves.toEqual(192);
      },
      ['hasInfiniteMaxRows=true']
    )
  );

  test(
    'Action button should be focusable in read-only state',
    setupTest(async page => {
      await page.click('#focus-button');
      await page.keys('Tab');
      await expect(page.isFocused(getPromptInputWrapper().find('button').toSelector())).resolves.toBe(true);
    })
  );

  test(
    'Should has one row height in Split Panel',
    setupTest(async page => {
      await page.click(createWrapper().findAppLayout().findSplitPanelOpenButton().toSelector());
      await expect(page.getPromptInputHeight('Prompt-input-in-split-panel')).resolves.toEqual(32);
    })
  );
});
