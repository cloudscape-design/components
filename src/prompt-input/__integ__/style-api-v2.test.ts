// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

const integWrapper = createWrapper().findPromptInput('[data-testid="integ-prompt-input"]');
const tokenWrapper = createWrapper().findPromptInput('[data-testid="integ-token-prompt-input"]');

class StyleApiV2Page extends BasePageObject {
  async getElementClientHeight(selector: string): Promise<number> {
    return Number(await this.getElementProperty(selector, 'clientHeight'));
  }

  async getElementScrollHeight(selector: string): Promise<number> {
    return Number(await this.getElementProperty(selector, 'scrollHeight'));
  }

  async fillTextareaWithLines(selector: string, lineCount: number): Promise<void> {
    // PromptInput intercepts plain Enter and calls preventDefault; use Shift+Enter for newlines.
    await this.click(selector);
    for (let i = 0; i < lineCount; i++) {
      await this.keys([...Array(20).fill('a')]);
      await this.keys(['Shift', 'Enter', 'Shift']);
    }
    await this.pause(200);
  }
}

function setupTest(testFn: (page: StyleApiV2Page) => Promise<void>, urlSearch = '') {
  return useBrowser(async browser => {
    const page = new StyleApiV2Page(browser);
    await browser.url(`#/light/prompt-input/style-api-v2${urlSearch ? `?${urlSearch}` : ''}`);
    await page.waitForVisible(integWrapper.toSelector());
    await testFn(page);
  });
}

const textareaSelector = integWrapper.findNativeTextarea().toSelector();
const tokenEditableSelector = tokenWrapper.findContentEditableElement()!.toSelector();
const awaySelector = '[data-testid="integ-away"]';

describe('Prompt input style-api-v2: padding-aware sizing', () => {
  test(
    'empty textarea has 1-row height with 10px padding-block',
    setupTest(async page => {
      const height = await page.getElementClientHeight(textareaSelector);
      expect(height).toBe(40);
    })
  );

  test(
    'textarea clamps at 3-row height and shows scroll overflow when content exceeds max',
    setupTest(async page => {
      await page.fillTextareaWithLines(textareaSelector, 5);
      // Typing leaves the pointer over the textarea; move it away so the 10px padding applies, not the hover padding.
      await page.hoverElement(awaySelector);
      await page.pause(200);

      const clientHeight = await page.getElementClientHeight(textareaSelector);
      const scrollHeight = await page.getElementScrollHeight(textareaSelector);

      expect(clientHeight).toBe(80);
      expect(scrollHeight).toBeGreaterThan(clientHeight);
    })
  );

  test(
    'extra-padding class swap produces taller 1-row height',
    useBrowser(async browser => {
      const page = new StyleApiV2Page(browser);

      await browser.url('#/light/prompt-input/style-api-v2');
      await page.waitForVisible(integWrapper.toSelector());
      const heightDefault = await page.getElementClientHeight(textareaSelector);

      await browser.url('#/light/prompt-input/style-api-v2?textareaPadding=extra');
      await page.waitForVisible(integWrapper.toSelector());
      await page.pause(200);
      const heightExtra = await page.getElementClientHeight(textareaSelector);

      // Extra class has padding-block: 20px vs default 10px, so height grows by 20px.
      expect(heightExtra).toBeGreaterThan(heightDefault);
      expect(heightExtra).toBe(60);
    })
  );

  test(
    'hover padding change re-measures textarea height',
    setupTest(async page => {
      const heightBefore = await page.getElementClientHeight(textareaSelector);

      await page.hoverElement(textareaSelector);
      await page.pause(200);
      const heightHovered = await page.getElementClientHeight(textareaSelector);

      await page.hoverElement(awaySelector);
      await page.pause(200);
      const heightAfter = await page.getElementClientHeight(textareaSelector);

      // Hover rule adds 5px to padding-block (10 to 15), so total height grows by 10px.
      expect(heightHovered).toBeGreaterThan(heightBefore);
      expect(heightAfter).toBe(heightBefore);
    })
  );

  test(
    'token mode has 1-row floor and 3-row clamp',
    setupTest(async page => {
      await page.waitForVisible(tokenWrapper.toSelector());

      const floorHeight = await page.getElementClientHeight(tokenEditableSelector);
      expect(floorHeight).toBe(40);

      await page.click(tokenEditableSelector);
      // Type enough lines to exceed 3 rows.
      for (let i = 0; i < 4; i++) {
        await page.keys([...Array(10).fill('a'), 'Shift', 'Enter', 'Shift']);
      }
      await page.hoverElement(awaySelector);
      await page.pause(300);

      const cappedHeight = await page.getElementClientHeight(tokenEditableSelector);
      const scrollHeight = await page.getElementScrollHeight(tokenEditableSelector);

      expect(cappedHeight).toBe(80);
      expect(scrollHeight).toBeGreaterThan(cappedHeight);
    })
  );
});
