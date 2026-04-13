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

  async waitForMenuVisibility(visible: boolean) {
    await this.waitForVisible(menuSelector, visible);
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

  getParagraphStructure(): Promise<
    Array<{ childCount: number; hasTrailingBR: boolean; firstChildType: string; firstChildText: string }>
  > {
    return this.browser.execute((selector: string) => {
      const editable = document.querySelector(selector);
      if (!editable) {
        return [];
      }
      const paragraphs = editable.querySelectorAll('p');
      const result: Array<{
        childCount: number;
        hasTrailingBR: boolean;
        firstChildType: string;
        firstChildText: string;
      }> = [];
      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        const firstChild = p.firstChild;
        const lastChild = p.lastChild;
        result.push({
          childCount: p.childNodes.length,
          hasTrailingBR: !!(lastChild && lastChild.nodeName === 'BR'),
          firstChildType: firstChild ? firstChild.nodeName : 'none',
          firstChildText: (firstChild?.textContent ?? '').replace(/\u200B/g, ''),
        });
      }
      return result;
    }, contentEditableSelector);
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
(isReact18 ? describe : describe.skip)('PromptInput token mode', () => {
  describe('typing and editing', () => {
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

  describe('menu interactions', () => {
    test(
      'trigger character opens menu, filtering narrows results, selecting inserts reference',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);

        await expect(page.isMenuOpen()).resolves.toBe(true);
        expect(await page.getCaretOffset()).toBe(1);

        // Filter to "Alice"
        await page.keys(['A', 'l', 'i', 'c', 'e']);
        await page.waitForMenuVisibility(true);
        await expect(page.isMenuOpen()).resolves.toBe(true);

        // Select the filtered option
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);

        await expect(page.isMenuOpen()).resolves.toBe(false);
        expect(await page.getEditorText()).toContain('Alice');
      })
    );

    test(
      'clicking a menu option inserts reference and retains focus',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);

        await expect(page.isMenuOpen()).resolves.toBe(true);

        const firstOption = promptInputWrapper.findOpenMenu()!.findOption(1)!.toSelector();
        await page.click(firstOption);
        await page.waitForMenuVisibility(false);

        expect(await page.getEditorText()).toContain('John Smith');
        expect(await page.isFocused(contentEditableSelector)).toBe(true);
      })
    );

    test(
      'escape closes menu without selecting, backspace removes trigger',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'e', 'l', 'l', 'o', ' ', '@']);
        await page.waitForMenuVisibility(true);

        await expect(page.isMenuOpen()).resolves.toBe(true);

        await page.keys(['Escape']);
        await page.waitForMenuVisibility(false);
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
        await page.keys(['h', 'i', ' ', '@', 'a']);

        // Backspace filter char, then backspace trigger char
        await page.keys(['Backspace']);
        await page.keys(['Backspace']);

        expect(await page.getEditorText()).toBe('hi ');
        expect(await page.getCaretOffset()).toBe(3);
      })
    );

    test(
      'slash and hash triggers open their respective menus',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['/']);
        await page.waitForMenuVisibility(true);
        await expect(page.isMenuOpen()).resolves.toBe(true);

        await page.keys(['Escape']);
        await page.waitForMenuVisibility(false);
        await expect(page.isMenuOpen()).resolves.toBe(false);
      })
    );
  });

  describe('reference token lifecycle', () => {
    test(
      'insert reference via keyboard, then delete it with backspace',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);

        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);

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
        await page.waitForMenuVisibility(true);
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);

        await page.keys([' ', 'b', 'y', 'e']);
        await page.pause(200);

        const text = await page.getEditorText();
        expect(text).toContain('hi');
        expect(text).toContain('bye');
      })
    );
  });

  describe('insertText via secondary actions', () => {
    test(
      'clicking @ button inserts trigger at caret position',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'e', 'l', 'l', 'o', ' ']);
        await page.pause(200);

        expect(await page.getCaretOffset()).toBe(6);

        const atButton = promptInputWrapper.findSecondaryActions()!.find('button[data-itemid="at"]')!.toSelector();
        await page.click(atButton);
        await page.waitForMenuVisibility(true);

        const text = await page.getEditorText();
        expect(text).toContain('hello');
        expect(text).toContain('@');
        expect(await page.getCaretOffset()).toBe(7);
      })
    );
  });

  describe('shift+arrow selection across references', () => {
    test(
      'shift+right selects forward through a reference token',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'i', ' ']);
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);
        await page.keys([' ', 'b', 'y', 'e']);
        await page.pause(200);

        // Move cursor to start
        await page.keys(['Home']);
        await page.pause(100);

        // Select "hi " (3 characters)
        for (let i = 0; i < 3; i++) {
          await page.keys(['Shift', 'ArrowRight', 'Shift']);
        }
        expect(await page.getSelectedText()).toBe('hi ');

        // One more jumps over the atomic reference
        await page.keys(['Shift', 'ArrowRight', 'Shift']);
        await page.pause(100);
        const selected = await page.getSelectedText();
        expect(selected).toContain('hi ');
        expect(selected).toContain('Jane Smith');
      })
    );

    test(
      'shift+left selects backward through a reference token',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'i', ' ']);
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);
        await page.keys([' ', 'b', 'y', 'e']);
        await page.pause(200);

        // Select backward from end: " bye" (4 chars)
        for (let i = 0; i < 4; i++) {
          await page.keys(['Shift', 'ArrowLeft', 'Shift']);
        }
        const afterText = await page.getSelectedText();
        expect(afterText).toBe(' bye');

        // One more jumps over the atomic reference
        await page.keys(['Shift', 'ArrowLeft', 'Shift']);
        await page.pause(100);
        const selected = await page.getSelectedText();
        expect(selected).toContain('Jane Smith');
        expect(selected).toContain(' bye');
      })
    );

    test(
      'shift+left then shift+right reversal deselects correctly around reference',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'e', 'l', 'l', 'o', ' ']);
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);
        await page.keys([' ', 'w', 'o', 'r', 'l', 'd']);
        await page.pause(200);

        // Place cursor in middle of "world"
        await page.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        await page.pause(100);

        // Select backward: " wo" (3) + reference (1) + "hello " (6) = 10 presses
        for (let i = 0; i < 10; i++) {
          await page.keys(['Shift', 'ArrowLeft', 'Shift']);
        }
        await page.pause(100);
        const backwardSel = await page.getSelectedText();
        expect(backwardSel).toContain('hello');
        expect(backwardSel).toContain('Jane Smith');

        // Reverse with shift+right — deselect everything
        for (let i = 0; i < 10; i++) {
          await page.keys(['Shift', 'ArrowRight', 'Shift']);
        }
        await page.pause(100);

        const afterReverse = await page.getSelectedText();
        expect(afterReverse).toBe('');
      })
    );
  });

  describe('delete key with references', () => {
    test(
      'delete key removes reference token ahead of cursor',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);
        await page.keys([' ', 'h', 'i']);
        await page.pause(100);

        // Move cursor to start (before the reference)
        await page.keys(['Home']);
        await page.pause(100);

        // Delete should remove the reference
        await page.keys(['Delete']);
        await page.pause(200);

        const text = await page.getEditorText();
        expect(text).toBe(' hi');
        expect(text).not.toContain('Jane Smith');
      })
    );

    test(
      'backspace removes reference token behind cursor',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'i', ' ']);
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);

        // Cursor is right after the reference — backspace removes it
        await page.keys(['Backspace']);
        await page.pause(200);

        const text = await page.getEditorText();
        expect(text).toBe('hi ');
        expect(text).not.toContain('Jane Smith');
        expect(await page.getCaretOffset()).toBe(3);
      })
    );
  });

  describe('trigger dismissal', () => {
    test(
      'space on empty trigger dismisses it',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'i', ' ', '@']);
        await page.waitForMenuVisibility(true);
        await expect(page.isMenuOpen()).resolves.toBe(true);

        await page.keys([' ']);
        await page.waitForMenuVisibility(false);

        await expect(page.isMenuOpen()).resolves.toBe(false);
        const text = await page.getEditorText();
        expect(text).toContain('hi');
        expect(text).toContain('@');
      })
    );
  });

  describe('multiple references', () => {
    test(
      'insert two references with text between them',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);

        await page.keys([' ', 'a', 'n', 'd', ' ']);

        await page.keys(['@']);
        await page.waitForMenuVisibility(true);
        // Select second option
        await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);

        const text = await page.getEditorText();
        expect(text).toContain('Jane Smith');
        expect(text).toContain('and');
        expect(text).toContain('Bob');
      })
    );
  });

  describe('typing into empty line (isTypingIntoEmptyLine)', () => {
    test(
      'typing on a new line after shift+enter replaces trailing BR with text node',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'e', 'l', 'l', 'o']);
        await page.pause(100);

        await page.keys(['Shift', 'Enter', 'Shift']);
        await page.pause(100);

        // Before typing: second paragraph should have a trailing BR (empty line)
        const beforeStructure = await page.getParagraphStructure();
        expect(beforeStructure.length).toBe(2);
        expect(beforeStructure[1].hasTrailingBR).toBe(true);

        // Type on the empty second line
        await page.keys(['w']);
        await page.pause(200);

        // After typing: second paragraph should have a text node, no trailing BR
        const afterStructure = await page.getParagraphStructure();
        expect(afterStructure.length).toBe(2);
        expect(afterStructure[1].hasTrailingBR).toBe(false);
        expect(afterStructure[1].firstChildType).toBe('#text');
        expect(afterStructure[1].firstChildText).toContain('w');
        expect(await page.getCaretOffset()).toBe(6);
      })
    );

    test(
      'typing trigger on empty line after shift+enter opens menu and replaces BR',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'e', 'l', 'l', 'o']);
        await page.pause(100);

        await page.keys(['Shift', 'Enter', 'Shift']);
        await page.pause(100);

        await page.keys(['@']);
        await page.waitForMenuVisibility(true);

        await expect(page.isMenuOpen()).resolves.toBe(true);

        // The second paragraph should now contain a trigger element, not a trailing BR
        const structure = await page.getParagraphStructure();
        expect(structure.length).toBe(2);
        expect(structure[1].hasTrailingBR).toBe(false);
      })
    );

    test(
      'typing into completely empty input replaces trailing BR with text node',
      setupTest(async page => {
        await page.focusInput();

        // Before typing: single paragraph with trailing BR
        const beforeStructure = await page.getParagraphStructure();
        expect(beforeStructure.length).toBe(1);
        expect(beforeStructure[0].hasTrailingBR).toBe(true);

        await page.keys(['a']);
        await page.pause(200);

        // After typing: paragraph has text node, no trailing BR
        const afterStructure = await page.getParagraphStructure();
        expect(afterStructure.length).toBe(1);
        expect(afterStructure[0].hasTrailingBR).toBe(false);
        expect(afterStructure[0].firstChildType).toBe('#text');
        expect(afterStructure[0].firstChildText).toBe('a');
        expect(await page.getCaretOffset()).toBe(1);
      })
    );
  });

  describe('mouseup selection normalization', () => {
    test(
      'clicking on a reference token and dragging produces a valid selection',
      setupTest(async page => {
        await page.focusInput();
        await page.keys(['h', 'i', ' ']);
        await page.keys(['@']);
        await page.waitForMenuVisibility(true);
        await page.keys(['ArrowDown', 'Enter']);
        await page.waitForMenuVisibility(false);
        await page.keys([' ', 'b', 'y', 'e']);

        // Click at the start of the input to position caret
        await page.click(contentEditableSelector);
        await page.pause(100);

        // The caret should be at a valid position (not inside a reference's internal structure)
        const offset = await page.getCaretOffset();
        expect(offset).toBeGreaterThanOrEqual(0);
      })
    );
  });
});
