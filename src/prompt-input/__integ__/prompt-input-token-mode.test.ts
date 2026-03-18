// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

const promptInputWrapper = createWrapper().findPromptInput('[data-testid="prompt-input"]');
const contentEditableSelector = promptInputWrapper.findContentEditableElement()!.toSelector();
const menuSelector = promptInputWrapper.findMenu()!.toSelector();

class PromptInputTokenModePage extends BasePageObject {
  async focusInput() {
    await this.click(contentEditableSelector);
  }

  isMenuOpen(): Promise<boolean> {
    return this.isExisting(menuSelector);
  }

  getEditorText(): Promise<string> {
    return this.getText(contentEditableSelector);
  }
}

const setupTest = (testFn: (page: PromptInputTokenModePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new PromptInputTokenModePage(browser);
    await page.setWindowSize({ width: 1200, height: 800 });
    await browser.url('#/light/prompt-input/shortcuts');
    await page.waitForVisible(promptInputWrapper.toSelector());
    await testFn(page);
  });
};

describe('PromptInput token mode', () => {
  test(
    'typing a trigger character opens the menu dropdown',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(true);
    })
  );

  test(
    'selecting a menu item inserts a reference token',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      // Select the first option from the menu
      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      // Menu should close after selection
      await expect(page.isMenuOpen()).resolves.toBe(false);

      // The editor should contain the selected reference text
      const text = await page.getEditorText();
      expect(text.length).toBeGreaterThan(0);
    })
  );

  test(
    'backspace removes a reference token',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      // Select the first option
      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      // Verify token is present
      let text = await page.getEditorText();
      expect(text.length).toBeGreaterThan(0);

      // Press Backspace to remove the token
      await page.keys(['Backspace']);
      await page.pause(100);

      text = await page.getEditorText();
      expect(text.length).toBe(0);
    })
  );

  test(
    'shift+enter creates a new line without submitting',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'e', 'l', 'l', 'o']);
      await page.pause(100);

      // Shift+Enter should create a new line, not submit
      await page.keys(['Shift', 'Enter', 'Shift']);
      await page.pause(100);
      await page.keys(['w', 'o', 'r', 'l', 'd']);
      await page.pause(100);

      const text = await page.getEditorText();
      expect(text).toContain('hello');
      expect(text).toContain('world');
    })
  );

  test(
    'slash trigger opens command menu',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['/']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(true);
    })
  );

  test(
    'hash trigger opens topics menu',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['#']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(true);
    })
  );

  test(
    'escape closes the menu without selecting',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      // Menu should be open
      await expect(page.isMenuOpen()).resolves.toBe(true);

      // Press Escape to close
      await page.keys(['Escape']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(false);
    })
  );

  test(
    'arrow keys navigate and select menu options',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      // Navigate down through options
      await page.keys(['ArrowDown']);
      await page.pause(100);
      await page.keys(['ArrowDown']);
      await page.pause(100);

      // Select the second option
      await page.keys(['Enter']);
      await page.pause(200);

      const text = await page.getEditorText();
      // Second option was selected after two ArrowDowns
      expect(text.length).toBeGreaterThan(0);
    })
  );

  test(
    'filtering narrows menu options',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      // Verify menu is open with options
      await expect(page.isMenuOpen()).resolves.toBe(true);

      // Type to filter — select the filtered result
      await page.keys(['A', 'l', 'i', 'c', 'e']);
      await page.pause(200);

      // Menu should still be open with filtered results
      await expect(page.isMenuOpen()).resolves.toBe(true);

      // Select the first filtered option
      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      const text = await page.getEditorText();
      expect(text).toContain('Alice');
    })
  );
});
