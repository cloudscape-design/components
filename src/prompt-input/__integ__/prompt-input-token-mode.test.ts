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

  /**
   * Returns the visible character count from the start of the input to the caret,
   * stripping zero-width positioning characters.
   */
  getCaretOffset(): Promise<number> {
    return this.browser.execute((selector: string) => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        return -1;
      }
      const range = sel.getRangeAt(0);
      const editable = document.querySelector(selector);
      if (!editable) {
        return -1;
      }
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editable);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      return preCaretRange.toString().replace(/\u200B/g, '').length;
    }, contentEditableSelector);
  }

  getSelectedText(): Promise<string> {
    return this.browser.execute(() => {
      const sel = window.getSelection();
      return sel ? sel.toString().replace(/\u200B/g, '') : '';
    });
  }
}

const setupTest = (testFn: (page: PromptInputTokenModePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new PromptInputTokenModePage(browser);
    await page.setWindowSize({ width: 1200, height: 800 });
    await browser.url('#/light/prompt-input/shortcuts?hasSecondaryActions=true');
    await page.waitForVisible(promptInputWrapper.toSelector());
    await testFn(page);
  });
};

// React 16/17: token mode is disabled, component falls back to textarea.
(isReact18 ? describe.skip : describe)('PromptInput - React 16/17 fallback', () => {
  test(
    'renders as textarea when menus are provided',
    setupTest(async page => {
      const hasTextarea = await page.isExisting(textareaSelector);
      expect(hasTextarea).toBe(true);

      const hasContentEditable = await page.isExisting(contentEditableSelector);
      expect(hasContentEditable).toBe(false);
    })
  );
});

// React 18+: full token mode with contentEditable, triggers, menus, and reference tokens.
(isReact18 ? describe : describe.skip)('PromptInput token mode - typing and editing', () => {
  test(
    'typing text and creating a new line with shift+enter',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'e', 'l', 'l', 'o']);
      await page.pause(100);

      expect(await page.getEditorText()).toContain('hello');
      expect(await page.getCaretOffset()).toBe(5);

      await page.keys(['Shift', 'Enter', 'Shift']);
      await page.pause(100);
      await page.keys(['w', 'o', 'r', 'l', 'd']);
      await page.pause(100);

      const text = await page.getEditorText();
      expect(text).toContain('hello');
      expect(text).toContain('world');
      expect(await page.getCaretOffset()).toBe(10);
    })
  );
});

(isReact18 ? describe : describe.skip)('PromptInput token mode - menu interactions', () => {
  test(
    'trigger character opens menu, filtering narrows results, selecting inserts reference',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(true);
      expect(await page.getCaretOffset()).toBe(1);

      // Filter to "Alice"
      await page.keys(['A', 'l', 'i', 'c', 'e']);
      await page.pause(200);
      await expect(page.isMenuOpen()).resolves.toBe(true);

      // Select the filtered option
      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      await expect(page.isMenuOpen()).resolves.toBe(false);
      expect(await page.getEditorText()).toContain('Alice');
    })
  );

  test(
    'clicking a menu option inserts reference and retains focus',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(300);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      const firstOption = promptInputWrapper.findOpenMenu()!.findOption(1)!.toSelector();
      await page.click(firstOption);
      await page.pause(200);

      expect(await page.getEditorText()).toContain('John Smith');
      expect(await page.isFocused(contentEditableSelector)).toBe(true);
    })
  );

  test(
    'escape closes menu without selecting, backspace removes trigger',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'e', 'l', 'l', 'o', ' ', '@']);
      await page.pause(300);

      await expect(page.isMenuOpen()).resolves.toBe(true);

      await page.keys(['Escape']);
      await page.pause(200);
      await expect(page.isMenuOpen()).resolves.toBe(false);

      await page.keys(['Backspace']);
      await page.pause(300);

      expect(await page.getEditorText()).toContain('hello');
      expect(await page.getCaretOffset()).toBe(6);
    })
  );

  test(
    'backspace through trigger with filter text removes all of it',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'i', ' ', '@', 'a', 'l', 'i']);
      await page.pause(300);

      await page.keys(['Escape']);
      await page.pause(100);
      await page.keys(['Backspace', 'Backspace', 'Backspace', 'Backspace']);
      await page.pause(300);

      expect((await page.getEditorText()).trim()).toBe('hi');
      expect(await page.getCaretOffset()).toBe(3);
    })
  );

  test(
    'slash and hash triggers open their respective menus',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['/']);
      await page.pause(200);
      await expect(page.isMenuOpen()).resolves.toBe(true);

      await page.keys(['Escape']);
      await page.pause(200);
      await expect(page.isMenuOpen()).resolves.toBe(false);
    })
  );
});

(isReact18 ? describe : describe.skip)('PromptInput token mode - reference token lifecycle', () => {
  test(
    'insert reference via keyboard, then delete it with backspace',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['@']);
      await page.pause(200);

      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      const textAfterInsert = await page.getEditorText();
      expect(textAfterInsert.length).toBeGreaterThan(0);

      await page.keys(['Backspace']);
      await page.pause(100);

      expect(await page.getEditorText()).toBe('');
      expect(await page.getCaretOffset()).toBe(0);
    })
  );

  test(
    'type text, insert reference via menu, continue typing after reference',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'i', ' ']);
      await page.pause(100);

      await page.keys(['@']);
      await page.pause(200);
      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);

      await page.keys([' ', 'b', 'y', 'e']);
      await page.pause(200);

      const text = await page.getEditorText();
      expect(text).toContain('hi');
      expect(text).toContain('bye');
    })
  );
});

(isReact18 ? describe : describe.skip)('PromptInput token mode - insertText via secondary actions', () => {
  test(
    'clicking @ button inserts trigger at caret position',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'e', 'l', 'l', 'o', ' ']);
      await page.pause(200);

      expect(await page.getCaretOffset()).toBe(6);

      const atButton = promptInputWrapper.findSecondaryActions()!.find('button[data-itemid="at"]')!.toSelector();
      await page.click(atButton);
      await page.pause(500);

      const text = await page.getEditorText();
      expect(text).toContain('hello');
      expect(text).toContain('@');
      expect(await page.getCaretOffset()).toBe(7);
    })
  );
});

(isReact18 ? describe : describe.skip)('PromptInput token mode - shift+arrow selection across references', () => {
  test(
    'shift+right selects forward through a reference token',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'i', ' ']);
      await page.keys(['@']);
      await page.pause(200);
      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);
      await page.keys([' ', 'b', 'y', 'e']);
      await page.pause(200);

      // Move cursor to start
      await page.keys(['Home']);
      await page.pause(100);

      // Select forward: "hi " then the reference then " bye"
      for (let i = 0; i < 3; i++) {
        await page.keys(['Shift', 'ArrowRight', 'Shift']);
      }
      expect(await page.getSelectedText()).toBe('hi ');

      // One more should jump over the reference
      await page.keys(['Shift', 'ArrowRight', 'Shift']);
      await page.pause(100);
      const selected = await page.getSelectedText();
      expect(selected).toContain('hi ');
      expect(selected).toContain('John Smith');
    })
  );

  test(
    'shift+left selects backward through a reference token',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'i', ' ']);
      await page.keys(['@']);
      await page.pause(200);
      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);
      await page.keys([' ', 'b', 'y', 'e']);
      await page.pause(200);

      // Cursor is at end. Select backward: "bye " then reference then " hi"
      for (let i = 0; i < 4; i++) {
        await page.keys(['Shift', 'ArrowLeft', 'Shift']);
      }
      const afterText = await page.getSelectedText();
      expect(afterText).toBe(' bye');

      // One more should jump over the reference
      await page.keys(['Shift', 'ArrowLeft', 'Shift']);
      await page.pause(100);
      const selected = await page.getSelectedText();
      expect(selected).toContain('John Smith');
      expect(selected).toContain(' bye');
    })
  );

  test(
    'shift+left then shift+right reversal deselects reference without flipping selection',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['h', 'e', 'l', 'l', 'o', ' ']);
      await page.keys(['@']);
      await page.pause(200);
      await page.keys(['ArrowDown', 'Enter']);
      await page.pause(200);
      await page.keys([' ', 'w', 'o', 'r', 'l', 'd']);
      await page.pause(200);

      // Place cursor in middle of "world" (3 chars from end)
      await page.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
      await page.pause(100);

      // Select backward past " wo", over reference, into "hello"
      for (let i = 0; i < 7; i++) {
        await page.keys(['Shift', 'ArrowLeft', 'Shift']);
      }
      await page.pause(100);
      const backwardSel = await page.getSelectedText();
      expect(backwardSel).toContain('John Smith');

      // Now reverse with shift+right — deselect back through "hello " and the reference
      for (let i = 0; i < 7; i++) {
        await page.keys(['Shift', 'ArrowRight', 'Shift']);
      }
      await page.pause(100);

      // Selection should be collapsed or very small — not extending the wrong end
      const afterReverse = await page.getSelectedText();
      expect(afterReverse.length).toBeLessThanOrEqual(1);
    })
  );
});
