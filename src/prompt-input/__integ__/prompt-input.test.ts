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

  setPaddingBlock(selector: string, value: string) {
    return this.browser.execute(
      (selector: string, value: string) => {
        (document.querySelector(selector) as HTMLElement).style.paddingBlock = value;
      },
      selector,
      value
    );
  }
}

interface SetupTestOptions {
  isReadOnly?: boolean;
  hasInfiniteMaxRows?: boolean;
}

const setupTest = (
  { isReadOnly = true, hasInfiniteMaxRows = false }: SetupTestOptions,
  testFn: (page: PromptInputPage) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new PromptInputPage(browser);
    const params = new URLSearchParams({
      isReadOnly: String(isReadOnly),
      hasInfiniteMaxRows: String(hasInfiniteMaxRows),
    });
    await browser.url(`#/light/prompt-input/simple/?${params}`);
    await page.waitForVisible(getPromptInputWrapper().toSelector());
    await testFn(page);
  });
};
describe('Prompt input', () => {
  test(
    'Height should update based on maxRows property',
    setupTest({}, async page => {
      await expect(page.getPromptInputHeight()).resolves.toEqual(32);
      await page.click('#placeholder-text-button');
      await expect(page.getPromptInputHeight()).resolves.toEqual(92);

      const clientHeight = await page.getElementProperty(
        getPromptInputWrapper().findNativeTextarea().toSelector(),
        'clientHeight'
      );
      const scrollHeight = await page.getElementProperty(
        getPromptInputWrapper().findNativeTextarea().toSelector(),
        'scrollHeight'
      );

      await expect(Number(clientHeight)).toBeLessThan(Number(scrollHeight));
    })
  );

  test(
    'Height follows a padding change made outside React',
    setupTest({}, async page => {
      const textarea = getPromptInputWrapper().findNativeTextarea().toSelector();
      const stockHeight = Number(await page.getElementProperty(textarea, 'clientHeight'));
      await page.setPaddingBlock(textarea, '10px');
      await page.pause(100);
      // 5px -> 10px on each side: the one-row height grows by 10px without any React render.
      await expect(page.getElementProperty(textarea, 'clientHeight')).resolves.toEqual(stockHeight + 10);

      await page.click('#placeholder-text-button');
      // maxRows 4: four 20px rows plus the 20px of padding, content beyond that scrolls.
      await expect(page.getElementProperty(textarea, 'clientHeight')).resolves.toEqual(100);
      const scrollHeight = await page.getElementProperty(textarea, 'scrollHeight');
      await expect(Number(scrollHeight)).toBeGreaterThan(100);
    })
  );

  test(
    'Height should update infinitely based on maxRows property being set to -1',
    setupTest({ hasInfiniteMaxRows: true }, async page => {
      await expect(page.getPromptInputHeight()).resolves.toEqual(32);
      await page.click('#placeholder-text-button');

      const clientHeight = await page.getElementProperty(
        getPromptInputWrapper().findNativeTextarea().toSelector(),
        'clientHeight'
      );
      const scrollHeight = await page.getElementProperty(
        getPromptInputWrapper().findNativeTextarea().toSelector(),
        'scrollHeight'
      );

      await expect(Number(clientHeight)).toEqual(Number(scrollHeight));
    })
  );

  test(
    'Action button should be focusable in read-only state',
    setupTest({}, async page => {
      await page.click('#focus-button');
      await page.keys('Tab');
      await expect(page.isFocused(getPromptInputWrapper().find('button').toSelector())).resolves.toBe(true);
    })
  );

  test(
    'Should has one row height in Split Panel',
    setupTest({}, async page => {
      await page.click(createWrapper().findAppLayout().findSplitPanelOpenButton().toSelector());
      await expect(page.getPromptInputHeight('Prompt-input-in-split-panel')).resolves.toEqual(32);
    })
  );
});
