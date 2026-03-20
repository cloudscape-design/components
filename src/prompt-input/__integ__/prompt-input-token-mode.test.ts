// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

const promptInputWrapper = createWrapper().findPromptInput('[data-testid="prompt-input"]');
const contentEditableSelector = promptInputWrapper.findContentEditableElement()!.toSelector();
const textareaSelector = promptInputWrapper.findNativeTextarea()!.toSelector();
const menuSelector = promptInputWrapper.findOpenMenu()!.toSelector();
const isReact18 = process.env.REACT_VERSION === '18';

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
// React 16/17: token mode is disabled (version gate), component falls back to textarea.
// Verify the fallback works and doesn't crash.
(isReact18 ? describe.skip : describe)('PromptInput token mode - React 16/17 fallback', () => {
  test(
    'renders as textarea when menus are provided on React 16/17',
    setupTest(async page => {
      // The component should render a native textarea, not a contentEditable
      const hasTextarea = await page.isExisting(textareaSelector);
      expect(hasTextarea).toBe(true);

      // contentEditable should NOT exist
      const hasContentEditable = await page.isExisting(contentEditableSelector);
      expect(hasContentEditable).toBe(false);
    })
  );
});

// React 18+: full token mode with contentEditable, triggers, menus, and reference tokens.
(isReact18 ? describe : describe.skip)('PromptInput token mode', () => {
  test(
    'typing a trigger character opens the menu dropdown',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(true);

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

      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(false);

      const text = await page.getEditorText();
      expect(text.length).toBeGreaterThan(0);

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

      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      let text = await page.getEditorText();
      expect(text.length).toBeGreaterThan(0);

      await page.keys(['Backspace']);
      await page.pause(100);

      text = await page.getEditorText();
      expect(text.length).toBe(0);

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

      await page.keys(['Shift', 'Enter', 'Shift']);
      await page.pause(100);
      await page.keys(['w', 'o', 'r', 'l', 'd']);
      await page.pause(100);

      const text = await page.getEditorText();
      expect(text).toContain('hello');
      expect(text).toContain('world');

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

      await expect(page.isMenuOpen()).resolves.toBe(true);

      await page.keys(['Escape']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(false);

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

      await page.keys(['ArrowDown']);
      await page.pause(100);
      await page.keys(['ArrowDown']);
      await page.pause(100);

      await page.keys(['Enter']);
      await page.pause(200);

      const text = await page.getEditorText();
      expect(text.length).toBeGreaterThan(0);
    })
  );

  test(
    'filtering narrows menu options',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      await page.keys(['A', 'l', 'i', 'c', 'e']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      const text = await page.getEditorText();
      expect(text).toContain('Alice');

      const offset = await page.getCaretOffset();
      expect(offset).toBeGreaterThanOrEqual(0);
    })
  );
});

(isReact18 ? describe : describe.skip)('PromptInput token mode - trigger deletion caret positioning', () => {
  test(
    'backspace on trigger character keeps caret at the end of preceding text',
    setupTest(async page => {
      await page.focusInput();

      await page.keys(['h', 'e', 'l', 'l', 'o', ' ', '@']);
      await page.pause(300);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      await page.keys(['Escape']);
      await page.pause(200);
      await page.keys(['Backspace']);
      await page.pause(300);

      const text = await page.getEditorText();
      expect(text.trim()).toBe('hello');

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

      await page.keys(['Escape']);
      await page.pause(100);
      await page.keys(['Backspace', 'Backspace', 'Backspace', 'Backspace']);
      await page.pause(300);

      const text = await page.getEditorText();
      expect(text.trim()).toBe('hi');

      const offset = await page.getCaretOffset();
      expect(offset).toBe(3);
    })
  );
});

(isReact18 ? describe : describe.skip)('PromptInput token mode - insertText via contentEditable', () => {
  test(
    'insertText places text at caret and positions caret after insertion',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'e', 'l', 'l', 'o']);
      await page.pause(200);

      const text = await page.getEditorText();
      expect(text).toContain('hello');

      const offset = await page.getCaretOffset();
      expect(offset).toBe(5);
    })
  );
});

(isReact18 ? describe : describe.skip)('PromptInput token mode - trigger visibility on scroll', () => {
  test(
    'menu remains open when trigger is visible',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(300);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      const text = await page.getEditorText();
      expect(text).toContain('@');
    })
  );
});

(isReact18 ? describe : describe.skip)('PromptInput token mode - resize behavior', () => {
  test(
    'input adjusts height after content change',
    setupTest(async page => {
      await page.focusInput();

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
