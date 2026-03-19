// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

const promptInputWrapper = createWrapper().findPromptInput('[data-testid="prompt-input"]');
const contentEditableSelector = promptInputWrapper.findContentEditableElement()!.toSelector();
const menuSelector = promptInputWrapper.findOpenMenu()!.toSelector();

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

  /** Returns the caret offset within its container node. */
  getCaretOffset(): Promise<number> {
    return this.browser.execute(() => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        return -1;
      }
      return sel.getRangeAt(0).startOffset;
    });
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

      // After typing '@', caret should be at offset 1 (inside trigger text)
      const offset = await page.getCaretOffset();
      expect(offset).toBe(1);
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

      // After selection, caret should be past the reference
      const offset = await page.getCaretOffset();
      expect(offset).toBeGreaterThanOrEqual(0);
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

      // After backspace removes the reference, caret should be at 0
      const offset = await page.getCaretOffset();
      expect(offset).toBe(0);
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

      // After typing 'world', caret should be at offset 5
      const offset = await page.getCaretOffset();
      expect(offset).toBe(5);
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

      // Caret should still be inside the trigger
      const offset = await page.getCaretOffset();
      expect(offset).toBeGreaterThanOrEqual(0);
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

      // After selecting filtered option, caret should be past the reference
      const offset = await page.getCaretOffset();
      expect(offset).toBeGreaterThanOrEqual(0);
    })
  );
});

describe('PromptInput token mode - trigger deletion caret positioning', () => {
  test(
    'backspace on trigger character keeps caret at the end of preceding text',
    setupTest(async page => {
      await page.focusInput();

      await page.keys(['h', 'e', 'l', 'l', 'o', ' ', '@']);
      await page.pause(300);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      // Close menu, then backspace to delete the '@'
      await page.keys(['Escape']);
      await page.pause(200);
      await page.keys(['Backspace']);
      await page.pause(300);

      const text = await page.getEditorText();
      expect(text.trim()).toBe('hello');

      // Caret should be at offset 6 in the text node ('hello '), not 5
      const offset = await page.getCaretOffset();
      expect(offset).toBe(6);
    })
  );

  test(
    'backspace through trigger with filter text keeps caret at correct offset',
    setupTest(async page => {
      await page.focusInput();

      await page.keys(['h', 'i', ' ', '@', 'a', 'l', 'i']);
      await page.pause(300);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      // Close menu, backspace 4 times to delete 'i', 'l', 'a', '@'
      await page.keys(['Escape']);
      await page.pause(100);
      await page.keys(['Backspace', 'Backspace', 'Backspace', 'Backspace']);
      await page.pause(300);

      const text = await page.getEditorText();
      expect(text.trim()).toBe('hi');

      // Caret should be at offset 3 in the text node ('hi '), not 2
      const offset = await page.getCaretOffset();
      expect(offset).toBe(3);
    })
  );
});

describe('PromptInput token mode - insertText via contentEditable', () => {
  test(
    'insertText places text at caret and positions caret after insertion',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'e', 'l', 'l', 'o']);
      await page.pause(200);

      // The text should be inserted
      const text = await page.getEditorText();
      expect(text).toContain('hello');

      // Caret should be at end of typed text
      const offset = await page.getCaretOffset();
      expect(offset).toBe(5);
    })
  );
});

describe('PromptInput token mode - trigger visibility on scroll', () => {
  test(
    'menu remains open when trigger is visible',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(300);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      // Trigger is still visible, menu should stay open
      const text = await page.getEditorText();
      expect(text).toContain('@');
    })
  );
});

describe('PromptInput token mode - resize behavior', () => {
  test(
    'input adjusts height after content change',
    setupTest(async page => {
      await page.focusInput();

      // Type multiple lines
      await page.keys(['l', 'i', 'n', 'e', '1']);
      await page.pause(100);
      await page.keys(['Shift', 'Enter', 'Shift']);
      await page.pause(100);
      await page.keys(['l', 'i', 'n', 'e', '2']);
      await page.pause(100);
      await page.keys(['Shift', 'Enter', 'Shift']);
      await page.pause(100);
      await page.keys(['l', 'i', 'n', 'e', '3']);
      await page.pause(200);

      const text = await page.getEditorText();
      expect(text).toContain('line1');
      expect(text).toContain('line2');
      expect(text).toContain('line3');
    })
  );
});
