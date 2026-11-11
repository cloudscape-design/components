// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';
import { isReact18 } from './utils';

const textareaWrapper = createWrapper().findPromptInput('[data-testid="sizing-textarea"]');
const tokenWrapper = createWrapper().findPromptInput('[data-testid="sizing-token"]');

class SizingPage extends BasePageObject {
  async getTextareaClientHeight(): Promise<number> {
    return Number(await this.getElementProperty(textareaWrapper.findNativeTextarea().toSelector(), 'clientHeight'));
  }

  async getTextareaScrollHeight(): Promise<number> {
    return Number(await this.getElementProperty(textareaWrapper.findNativeTextarea().toSelector(), 'scrollHeight'));
  }

  async getTokenClientHeight(): Promise<number> {
    return Number(
      await this.getElementProperty(tokenWrapper.findContentEditableElement()!.toSelector(), 'clientHeight')
    );
  }

  async getTokenScrollHeight(): Promise<number> {
    return Number(
      await this.getElementProperty(tokenWrapper.findContentEditableElement()!.toSelector(), 'scrollHeight')
    );
  }
}

function setupTest(urlParams: Record<string, string>, testFn: (page: SizingPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new SizingPage(browser);
    const params = new URLSearchParams(urlParams).toString();
    await browser.url(`#/light/prompt-input/sizing?${params}`);
    await page.waitForVisible(textareaWrapper.toSelector());
    await testFn(page);
  });
}

describe('Prompt input - CSS sizing (textarea mode)', () => {
  test(
    'floor is 40px with 10px padding each side',
    setupTest({ padding: 'large' }, async page => {
      await page.hoverElement('#away');
      const height = await page.getTextareaClientHeight();
      expect(height).toBe(40);
    })
  );

  test(
    'large padding gives taller floor than default padding',
    setupTest({ padding: 'large' }, async page => {
      await page.hoverElement('#away');
      const largePaddingHeight = await page.getTextareaClientHeight();
      // Default 1-row height is 30px; large padding gives 40px
      expect(largePaddingHeight).toBeGreaterThan(30);
    })
  );

  test(
    '3-row cap is 80px with 10px padding and content scrolls beyond cap',
    setupTest({ padding: 'large', maxRows: '3' }, async page => {
      await page.click(textareaWrapper.findNativeTextarea().toSelector());
      for (let i = 0; i < 6; i++) {
        await page.keys(['Shift', 'Enter', 'Shift']);
      }
      await page.hoverElement('#away');
      const clientHeight = await page.getTextareaClientHeight();
      const scrollHeight = await page.getTextareaScrollHeight();
      expect(clientHeight).toBe(80);
      expect(scrollHeight).toBeGreaterThan(clientHeight);
    })
  );

  test(
    'hover grows height and moving away restores it',
    setupTest({ padding: 'large' }, async page => {
      await page.hoverElement('#away');
      const heightBefore = await page.getTextareaClientHeight();

      await page.hoverElement(textareaWrapper.findNativeTextarea().toSelector());
      const heightOnHover = await page.getTextareaClientHeight();
      expect(heightOnHover).toBeGreaterThan(heightBefore);

      await page.hoverElement('#away');
      const heightAfter = await page.getTextareaClientHeight();
      expect(heightAfter).toBe(heightBefore);
    })
  );

  test(
    'maxRows=-1 keeps growing with content and clientHeight equals scrollHeight',
    setupTest({ padding: 'large', maxRows: '-1' }, async page => {
      await page.hoverElement('#away');
      const heightEmpty = await page.getTextareaClientHeight();

      await page.click(textareaWrapper.findNativeTextarea().toSelector());
      for (let i = 0; i < 6; i++) {
        await page.keys(['Shift', 'Enter', 'Shift']);
      }
      await page.hoverElement('#away');
      const heightFilled = await page.getTextareaClientHeight();
      const scrollHeightFilled = await page.getTextareaScrollHeight();

      expect(heightFilled).toBeGreaterThan(heightEmpty);
      expect(scrollHeightFilled).toBe(heightFilled);
    })
  );
});

(isReact18 ? describe : describe.skip)('Prompt input - CSS sizing (token mode)', () => {
  test(
    'floor is 40px with 10px padding each side',
    setupTest({ padding: 'large' }, async page => {
      await page.hoverElement('#away');
      const height = await page.getTokenClientHeight();
      expect(height).toBe(40);
    })
  );

  test(
    '3-row cap is 80px with 10px padding and content scrolls beyond cap',
    setupTest({ padding: 'large', maxRows: '3' }, async page => {
      await page.click(tokenWrapper.findContentEditableElement()!.toSelector());
      for (let i = 0; i < 6; i++) {
        await page.keys(['Shift', 'Enter', 'Shift']);
      }
      await page.hoverElement('#away');
      const clientHeight = await page.getTokenClientHeight();
      const scrollHeight = await page.getTokenScrollHeight();
      expect(clientHeight).toBe(80);
      expect(scrollHeight).toBeGreaterThan(clientHeight);
    })
  );
});
