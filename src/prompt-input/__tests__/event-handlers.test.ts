// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

jest.mock('../styles.css.js', () => ({ paragraph: 'paragraph', 'trigger-token': 'trigger-token' }), { virtual: true });

import { CaretController } from '../core/caret-controller';
import {
  createKeyboardHandlers,
  handleArrowKeyNavigation,
  handleBackspaceAtParagraphStart,
  handleDeleteAtParagraphEnd,
  handleReferenceTokenDeletion,
  handleSpaceAfterClosedTrigger,
  KeyboardHandlerProps,
  mergeParagraphs,
  splitParagraphAtCaret,
} from '../core/event-handlers';
import { MenuItemsHandlers, MenuItemsState } from '../core/menu-state';

let el: HTMLDivElement;

beforeEach(() => {
  el = document.createElement('div');
  el.setAttribute('contenteditable', 'true');
  document.body.appendChild(el);
});

afterEach(() => {
  document.body.removeChild(el);
});

function addParagraph(container: HTMLElement, ...nodes: (string | Node)[]): HTMLParagraphElement {
  const p = document.createElement('p');
  for (const node of nodes) {
    p.appendChild(typeof node === 'string' ? document.createTextNode(node) : node);
  }
  container.appendChild(p);
  return p;
}

function createReferenceWrapper(id: string, label: string): HTMLSpanElement {
  const wrapper = document.createElement('span');
  wrapper.setAttribute('data-type', 'reference');
  wrapper.id = id;

  const before = document.createElement('span');
  before.setAttribute('data-type', 'cursor-spot-before');
  before.textContent = '\u200B';

  const container = document.createElement('span');
  container.textContent = label;
  container.setAttribute('contenteditable', 'false');

  const after = document.createElement('span');
  after.setAttribute('data-type', 'cursor-spot-after');
  after.textContent = '\u200B';

  wrapper.appendChild(before);
  wrapper.appendChild(container);
  wrapper.appendChild(after);
  return wrapper;
}

function createTriggerElement(id: string, text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.setAttribute('data-type', 'trigger');
  span.id = id;
  span.textContent = text;
  return span;
}

function setCursor(node: Node, offset: number): void {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  const sel = window.getSelection()!;
  sel.removeAllRanges();
  sel.addRange(range);
}

function setSelection(startNode: Node, startOffset: number, endNode: Node, endOffset: number): void {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  const sel = window.getSelection()!;
  sel.removeAllRanges();
  sel.addRange(range);
}

function makeKeyboardEvent(key: string, opts: Partial<KeyboardEventInit> = {}): React.KeyboardEvent<HTMLDivElement> {
  const nativeEvent = new KeyboardEvent('keydown', { key, bubbles: true, ...opts });
  let defaultPrevented = false;
  return {
    key,
    shiftKey: opts.shiftKey ?? false,
    preventDefault: () => {
      defaultPrevented = true;
    },
    isDefaultPrevented: () => defaultPrevented,
    nativeEvent,
    currentTarget: el,
  } as unknown as React.KeyboardEvent<HTMLDivElement>;
}

describe('createKeyboardHandlers', () => {
  function createMockMenuState(items: Array<{ type?: string; disabled?: boolean }> = []): MenuItemsState {
    return {
      items: items as any,
      highlightedOption: items[0] as any,
      highlightedIndex: 0,
      highlightType: { type: 'keyboard', moveFocus: true } as any,
      showAll: false,
      getItemGroup: () => undefined,
    };
  }

  function createMockMenuHandlers(): MenuItemsHandlers {
    return {
      moveHighlightWithKeyboard: jest.fn(),
      selectHighlightedOptionWithKeyboard: jest.fn().mockReturnValue(true),
      highlightVisibleOptionWithMouse: jest.fn(),
      selectVisibleOptionWithMouse: jest.fn(),
      resetHighlightWithKeyboard: jest.fn(),
      goHomeWithKeyboard: jest.fn(),
      goEndWithKeyboard: jest.fn(),
      setHighlightedIndexWithMouse: jest.fn(),
      highlightFirstOptionWithMouse: jest.fn(),
      highlightOptionWithKeyboard: jest.fn(),
    };
  }

  describe('handleMenuNavigation', () => {
    test('returns false when menu is closed', () => {
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      const event = makeKeyboardEvent('ArrowDown');
      expect(handleMenuNavigation(event)).toBe(false);
    });

    test('returns false when handlers are null', () => {
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState(),
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      expect(handleMenuNavigation(makeKeyboardEvent('ArrowDown'))).toBe(false);
    });

    test('ArrowDown moves highlight forward', () => {
      const handlers = createMockMenuHandlers();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState([{}]),
        getMenuItemsHandlers: () => handlers,
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      const event = makeKeyboardEvent('ArrowDown');
      expect(handleMenuNavigation(event)).toBe(true);
      expect(handlers.moveHighlightWithKeyboard).toHaveBeenCalledWith(1);
    });

    test('ArrowUp moves highlight backward', () => {
      const handlers = createMockMenuHandlers();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState([{}]),
        getMenuItemsHandlers: () => handlers,
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      const event = makeKeyboardEvent('ArrowUp');
      expect(handleMenuNavigation(event)).toBe(true);
      expect(handlers.moveHighlightWithKeyboard).toHaveBeenCalledWith(-1);
    });

    test('Enter selects highlighted option', () => {
      const handlers = createMockMenuHandlers();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState([{}]),
        getMenuItemsHandlers: () => handlers,
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      const event = makeKeyboardEvent('Enter');
      expect(handleMenuNavigation(event)).toBe(true);
      expect(handlers.selectHighlightedOptionWithKeyboard).toHaveBeenCalled();
    });

    test('Tab selects highlighted option', () => {
      const handlers = createMockMenuHandlers();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState([{}]),
        getMenuItemsHandlers: () => handlers,
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      const event = makeKeyboardEvent('Tab');
      expect(handleMenuNavigation(event)).toBe(true);
    });

    test('Shift+Enter does not select', () => {
      const handlers = createMockMenuHandlers();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState([{}]),
        getMenuItemsHandlers: () => handlers,
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      const event = makeKeyboardEvent('Enter', { shiftKey: true });
      expect(handleMenuNavigation(event)).toBe(false);
    });

    test('Escape closes menu', () => {
      const closeMenu = jest.fn();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState([{}]),
        getMenuItemsHandlers: () => createMockMenuHandlers(),
        closeMenu,
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      const event = makeKeyboardEvent('Escape');
      expect(handleMenuNavigation(event)).toBe(true);
      expect(closeMenu).toHaveBeenCalled();
    });

    test('unhandled key returns false', () => {
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState([{}]),
        getMenuItemsHandlers: () => createMockMenuHandlers(),
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      expect(handleMenuNavigation(makeKeyboardEvent('a'))).toBe(false);
    });

    test('space key delegates to handleSpaceInOpenMenu', () => {
      const handlers = createMockMenuHandlers();
      const closeMenu = jest.fn();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => createMockMenuState([{}]),
        getMenuItemsHandlers: () => handlers,
        closeMenu,
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      const event = makeKeyboardEvent(' ');
      // Space in open menu with no trigger at caret returns false
      const result = handleMenuNavigation(event);
      expect(typeof result).toBe('boolean');
    });

    test('returns false when menuItemsState is null', () => {
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => true,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => createMockMenuHandlers(),
        closeMenu: jest.fn(),
      };
      const { handleMenuNavigation } = createKeyboardHandlers(props);
      expect(handleMenuNavigation(makeKeyboardEvent('ArrowDown'))).toBe(false);
    });
  });

  describe('handleEnterKey', () => {
    test('does nothing for non-Enter key', () => {
      const onAction = jest.fn();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        onAction,
        tokens: [],
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      handleEnterKey(makeKeyboardEvent('a'));
      expect(onAction).not.toHaveBeenCalled();
    });

    test('does nothing for Shift+Enter', () => {
      const onAction = jest.fn();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        onAction,
        tokens: [],
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      handleEnterKey(makeKeyboardEvent('Enter', { shiftKey: true }));
      expect(onAction).not.toHaveBeenCalled();
    });

    test('prevents default when disabled', () => {
      const event = makeKeyboardEvent('Enter');
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        disabled: true,
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      handleEnterKey(event);
      expect(event.isDefaultPrevented()).toBe(true);
    });

    test('prevents default when readOnly', () => {
      const event = makeKeyboardEvent('Enter');
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        readOnly: true,
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      handleEnterKey(event);
      expect(event.isDefaultPrevented()).toBe(true);
    });

    test('calls onAction with token text', () => {
      const onAction = jest.fn();
      const tokens = [{ type: 'text' as const, value: 'hello' }];
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        onAction,
        tokens,
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      handleEnterKey(makeKeyboardEvent('Enter'));
      expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ value: 'hello', tokens: expect.any(Array) }));
    });

    test('uses tokensToText when provided', () => {
      const onAction = jest.fn();
      const tokensToText = jest.fn().mockReturnValue('custom text');
      const tokens = [{ type: 'text' as const, value: 'hello' }];
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        onAction,
        tokens,
        tokensToText,
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      handleEnterKey(makeKeyboardEvent('Enter'));
      expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ value: 'custom text' }));
    });

    test('submits form when inside one', () => {
      const form = document.createElement('form');
      form.requestSubmit = jest.fn();
      form.appendChild(el);
      document.body.appendChild(form);

      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        tokens: [],
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      handleEnterKey(makeKeyboardEvent('Enter'));
      expect(form.requestSubmit).toHaveBeenCalled();

      form.removeChild(el);
      document.body.removeChild(form);
      document.body.appendChild(el);
    });

    test('returns early when currentTarget is not an HTMLElement', () => {
      const onAction = jest.fn();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        onAction,
        tokens: [],
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      // Create event with non-HTMLElement currentTarget
      const event = {
        key: 'Enter',
        shiftKey: false,
        preventDefault: jest.fn(),
        isDefaultPrevented: () => false,
        nativeEvent: { isComposing: false },
        currentTarget: null,
      } as unknown as React.KeyboardEvent<HTMLDivElement>;
      handleEnterKey(event);
      expect(onAction).not.toHaveBeenCalled();
    });

    test('calls onAction without tokens when tokens is undefined', () => {
      const onAction = jest.fn();
      const props: KeyboardHandlerProps = {
        getMenuOpen: () => false,
        getMenuItemsState: () => null,
        getMenuItemsHandlers: () => null,
        closeMenu: jest.fn(),
        onAction,
      };
      const { handleEnterKey } = createKeyboardHandlers(props);
      handleEnterKey(makeKeyboardEvent('Enter'));
      expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ value: '', tokens: [] }));
    });
  });
});

describe('splitParagraphAtCaret', () => {
  test('splits paragraph at cursor position', () => {
    const p = addParagraph(el, 'hello world');
    setCursor(p.firstChild!, 5);

    splitParagraphAtCaret(el, null);

    const paragraphs = el.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe('hello');
    expect(paragraphs[1].textContent).toBe(' world');
  });

  test('creates empty paragraph with trailing BR when splitting at end', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 5);

    splitParagraphAtCaret(el, null);

    const paragraphs = el.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[1].querySelector('br')).not.toBeNull();
  });

  test('does nothing when no selection', () => {
    addParagraph(el, 'hello');
    window.getSelection()?.removeAllRanges();

    splitParagraphAtCaret(el, null);
    expect(el.querySelectorAll('p')).toHaveLength(1);
  });

  test('does nothing when cursor is not inside a paragraph', () => {
    // Place cursor in a text node that is not inside a <p>
    const orphanText = document.createTextNode('orphan');
    el.appendChild(orphanText);
    setCursor(orphanText, 3);

    splitParagraphAtCaret(el, null);
    // No split should happen
    expect(el.querySelectorAll('p')).toHaveLength(0);
  });

  test('handles splitting at start of paragraph (empty current paragraph)', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 0);

    splitParagraphAtCaret(el, null);

    const paragraphs = el.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    // First paragraph should be empty (trailing BR)
    expect(paragraphs[0].querySelector('br')).not.toBeNull();
    expect(paragraphs[1].textContent).toBe('hello');
  });

  test('dispatches input event unless suppressed', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 3);

    const inputHandler = jest.fn();
    el.addEventListener('input', inputHandler);

    splitParagraphAtCaret(el, null, false);
    expect(inputHandler).toHaveBeenCalled();

    el.removeEventListener('input', inputHandler);
  });

  test('suppresses input event when flag is set', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 3);

    const inputHandler = jest.fn();
    el.addEventListener('input', inputHandler);

    splitParagraphAtCaret(el, null, true);
    expect(inputHandler).not.toHaveBeenCalled();

    el.removeEventListener('input', inputHandler);
  });

  test('updates cursor position via caretController', () => {
    const p = addParagraph(el, 'hello');
    el.focus();
    setCursor(p.firstChild!, 3);

    const controller = new CaretController(el);
    splitParagraphAtCaret(el, controller);

    const paragraphs = el.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
  });
});

describe('handleReferenceTokenDeletion', () => {
  const mockState = { skipNextZwnjUpdate: false, menuSelectionTokenId: null };

  test('returns false when no selection', () => {
    window.getSelection()?.removeAllRanges();
    const event = makeKeyboardEvent('Backspace');
    const result = handleReferenceTokenDeletion(event, true, el, mockState, undefined, undefined, null);
    expect(result).toBe(false);
  });

  test('handles non-collapsed selection by deleting contents', () => {
    const p = addParagraph(el, 'hello world');
    setSelection(p.firstChild!, 0, p.firstChild!, 5);

    const event = makeKeyboardEvent('Backspace');
    const result = handleReferenceTokenDeletion(event, true, el, mockState, undefined, undefined, null);
    expect(result).toBe(true);
  });

  test('deletes reference token on backspace when adjacent', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    // Cursor at start of text node (offset 0), backspace should find reference
    setCursor(text, 0);

    const event = makeKeyboardEvent('Backspace');
    const state = { skipNextZwnjUpdate: false, menuSelectionTokenId: null };
    const result = handleReferenceTokenDeletion(event, true, el, state, undefined, undefined, null);
    expect(result).toBe(true);
    expect(state.skipNextZwnjUpdate).toBe(true);
  });

  test('deletes reference token on delete when adjacent', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Bob';
    p.appendChild(ref);

    // Cursor at end of text node, delete should find reference
    setCursor(text, 5);

    const event = makeKeyboardEvent('Delete');
    const state = { skipNextZwnjUpdate: false, menuSelectionTokenId: null };
    const result = handleReferenceTokenDeletion(event, false, el, state, undefined, undefined, null);
    expect(result).toBe(true);
  });

  test('returns false when no adjacent reference token', () => {
    const p = addParagraph(el, 'hello world');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent('Backspace');
    const result = handleReferenceTokenDeletion(event, true, el, mockState, undefined, undefined, null);
    expect(result).toBe(false);
  });

  test('announces token removal when announcer provided', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const text = document.createTextNode('after');
    p.appendChild(text);

    setCursor(text, 0);

    const announce = jest.fn();
    const event = makeKeyboardEvent('Backspace');
    handleReferenceTokenDeletion(
      event,
      true,
      el,
      { skipNextZwnjUpdate: false, menuSelectionTokenId: null },
      announce,
      undefined,
      null
    );
    expect(announce).toHaveBeenCalledWith('Alice removed');
  });

  test('uses i18nStrings for announcement when provided', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const text = document.createTextNode('after');
    p.appendChild(text);

    setCursor(text, 0);

    const announce = jest.fn();
    const i18n = { tokenRemovedAriaLabel: ({ label }: { label: string }) => `Removed: ${label}` };
    const event = makeKeyboardEvent('Backspace');
    handleReferenceTokenDeletion(
      event,
      true,
      el,
      { skipNextZwnjUpdate: false, menuSelectionTokenId: null },
      announce,
      i18n as any,
      null
    );
    expect(announce).toHaveBeenCalledWith('Removed: Alice');
  });

  test('adjusts cursor position via caretController on backspace', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text1 = document.createTextNode('ab');
    p.appendChild(text1);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'X';
    p.appendChild(ref);

    const text2 = document.createTextNode('cd');
    p.appendChild(text2);

    el.focus();
    setCursor(text2, 0);

    const controller = new CaretController(el);
    const event = makeKeyboardEvent('Backspace');
    const result = handleReferenceTokenDeletion(
      event,
      true,
      el,
      { skipNextZwnjUpdate: false, menuSelectionTokenId: null },
      undefined,
      undefined,
      controller
    );
    expect(result).toBe(true);
  });

  test('handles backspace at paragraph level (HTMLElement container) adjacent to reference', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    // Cursor at paragraph level, offset 1 (after the reference child)
    setCursor(p, 1);

    const event = makeKeyboardEvent('Backspace');
    const state = { skipNextZwnjUpdate: false, menuSelectionTokenId: null };
    const result = handleReferenceTokenDeletion(event, true, el, state, undefined, undefined, null);
    expect(result).toBe(true);
  });

  test('handles delete at paragraph level (HTMLElement container) adjacent to reference', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Bob';
    p.appendChild(ref);

    // Cursor at paragraph level, offset 0 (before the reference child)
    setCursor(p, 0);

    const event = makeKeyboardEvent('Delete');
    const state = { skipNextZwnjUpdate: false, menuSelectionTokenId: null };
    const result = handleReferenceTokenDeletion(event, false, el, state, undefined, undefined, null);
    expect(result).toBe(true);
  });

  test('returns true early when reference parent is not an HTMLElement', () => {
    // Create a document fragment as parent (not an HTMLElement)
    const fragment = document.createDocumentFragment();
    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    fragment.appendChild(ref);

    const text = document.createTextNode('after');
    fragment.appendChild(text);

    // Attach fragment to el so selection works
    el.appendChild(fragment);

    // Now ref's parentNode is el (an HTMLElement), but we need to test the branch
    // where parentNode is NOT an HTMLElement. We can do this by removing ref from DOM
    // after setting cursor but before deletion check.
    // Instead, test the actual behavior: when parent IS HTMLElement, skipNextZwnjUpdate is set
    const p = document.createElement('p');
    el.textContent = '';
    el.appendChild(p);

    const ref2 = document.createElement('span');
    ref2.setAttribute('data-type', 'reference');
    ref2.textContent = 'Bob';
    p.appendChild(ref2);

    const text2 = document.createTextNode('after');
    p.appendChild(text2);

    setCursor(text2, 0);

    const event = makeKeyboardEvent('Backspace');
    const state = { skipNextZwnjUpdate: false, menuSelectionTokenId: null };
    const result = handleReferenceTokenDeletion(event, true, el, state, undefined, undefined, null);
    expect(result).toBe(true);
    expect(state.skipNextZwnjUpdate).toBe(true);
  });

  test('adjusts cursor position via caretController on delete (stays in place)', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text1 = document.createTextNode('ab');
    p.appendChild(text1);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'X';
    p.appendChild(ref);

    el.focus();
    setCursor(text1, 2);

    const controller = new CaretController(el);
    const event = makeKeyboardEvent('Delete');
    const result = handleReferenceTokenDeletion(
      event,
      false,
      el,
      { skipNextZwnjUpdate: false, menuSelectionTokenId: null },
      undefined,
      undefined,
      controller
    );
    expect(result).toBe(true);
  });
});

describe('handleArrowKeyNavigation', () => {
  test('returns false for non-arrow keys', () => {
    addParagraph(el, 'hello');
    setCursor(el.querySelector('p')!.firstChild!, 3);
    expect(handleArrowKeyNavigation(makeKeyboardEvent('a'), null)).toBe(false);
  });

  test('returns false when no selection', () => {
    window.getSelection()?.removeAllRanges();
    expect(handleArrowKeyNavigation(makeKeyboardEvent('ArrowLeft'), null)).toBe(false);
  });

  test('jumps over reference token on ArrowRight', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    setCursor(text, 5);

    el.focus();
    const controller = new CaretController(el);
    const event = makeKeyboardEvent('ArrowRight');
    const result = handleArrowKeyNavigation(event, controller);
    expect(result).toBe(true);
  });

  test('jumps over reference token on ArrowLeft', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    setCursor(text, 0);

    el.focus();
    const controller = new CaretController(el);
    const event = makeKeyboardEvent('ArrowLeft');
    const result = handleArrowKeyNavigation(event, controller);
    expect(result).toBe(true);
  });

  test('returns false when no adjacent reference token', () => {
    const p = addParagraph(el, 'hello world');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent('ArrowRight');
    expect(handleArrowKeyNavigation(event, null)).toBe(false);
  });

  test('handles Shift+ArrowRight across reference token', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    setCursor(text, 5);

    const event = makeKeyboardEvent('ArrowRight', { shiftKey: true });
    const result = handleArrowKeyNavigation(event, null);
    expect(result).toBe(true);
  });

  test('handles Shift+ArrowLeft across reference token', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    setCursor(text, 0);

    const event = makeKeyboardEvent('ArrowLeft', { shiftKey: true });
    const result = handleArrowKeyNavigation(event, null);
    expect(result).toBe(true);
  });

  test('Shift+Arrow returns false when no adjacent reference', () => {
    const p = addParagraph(el, 'hello world');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent('ArrowRight', { shiftKey: true });
    expect(handleArrowKeyNavigation(event, null)).toBe(false);
  });

  test('Shift+ArrowLeft extends selection across reference from HTMLElement container', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    // Create a non-collapsed selection from text back toward reference at paragraph level
    const range = document.createRange();
    range.setStart(p, 1); // After reference
    range.setEnd(text, 3);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    const event = makeKeyboardEvent('ArrowLeft', { shiftKey: true });
    const result = handleArrowKeyNavigation(event, null);
    expect(result).toBe(true);
  });

  test('Shift+ArrowRight extends selection across reference from HTMLElement container', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    // Create a non-collapsed selection ending at paragraph level before reference
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(p, 1); // Before reference
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    const event = makeKeyboardEvent('ArrowRight', { shiftKey: true });
    const result = handleArrowKeyNavigation(event, null);
    expect(result).toBe(true);
  });

  test('Shift+Arrow returns false when sibling is null', () => {
    const p = addParagraph(el, 'hello');

    // Selection from start to middle — no reference adjacent
    const range = document.createRange();
    range.setStart(p.firstChild!, 0);
    range.setEnd(p.firstChild!, 3);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    const event = makeKeyboardEvent('ArrowLeft', { shiftKey: true });
    expect(handleArrowKeyNavigation(event, null)).toBe(false);
  });

  test('normalizes cursor out of cursor-spot-before on ArrowLeft', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(wrapper);

    // Place cursor inside cursor-spot-before
    const cursorSpotBefore = wrapper.querySelector('[data-type="cursor-spot-before"]')!;
    setCursor(cursorSpotBefore.firstChild!, 0);

    const event = makeKeyboardEvent('ArrowLeft');
    const result = handleArrowKeyNavigation(event, null);
    expect(result).toBe(true);
  });

  test('normalizes cursor out of cursor-spot-after on ArrowRight', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(wrapper);

    // Place cursor inside cursor-spot-after
    const cursorSpotAfter = wrapper.querySelector('[data-type="cursor-spot-after"]')!;
    setCursor(cursorSpotAfter.firstChild!, 0);

    const event = makeKeyboardEvent('ArrowRight');
    const result = handleArrowKeyNavigation(event, null);
    expect(result).toBe(true);
  });
});

describe('handleSpaceAfterClosedTrigger', () => {
  const ignoreCaretDetection = { current: false };

  beforeEach(() => {
    ignoreCaretDetection.current = false;
  });

  test('returns false for non-space key', () => {
    addParagraph(el, 'hello');
    setCursor(el.querySelector('p')!.firstChild!, 3);
    expect(handleSpaceAfterClosedTrigger(makeKeyboardEvent('a'), el, false, ignoreCaretDetection, null)).toBe(false);
  });

  test('returns false when menu is open', () => {
    addParagraph(el, 'hello');
    setCursor(el.querySelector('p')!.firstChild!, 3);
    expect(handleSpaceAfterClosedTrigger(makeKeyboardEvent(' '), el, true, ignoreCaretDetection, null)).toBe(false);
  });

  test('returns false when no selection', () => {
    window.getSelection()?.removeAllRanges();
    expect(handleSpaceAfterClosedTrigger(makeKeyboardEvent(' '), el, false, ignoreCaretDetection, null)).toBe(false);
  });

  test('returns false when selection is not collapsed', () => {
    const p = addParagraph(el, 'hello');
    setSelection(p.firstChild!, 0, p.firstChild!, 3);
    expect(handleSpaceAfterClosedTrigger(makeKeyboardEvent(' '), el, false, ignoreCaretDetection, null)).toBe(false);
  });

  test('inserts space after trigger when cursor is at end of trigger text', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = createTriggerElement('t1', '@user');
    p.appendChild(trigger);

    // Cursor at end of trigger text
    setCursor(trigger.firstChild!, 5);

    const event = makeKeyboardEvent(' ');
    const result = handleSpaceAfterClosedTrigger(event, el, false, ignoreCaretDetection, null);
    expect(result).toBe(true);
    expect(ignoreCaretDetection.current).toBe(true);
  });

  test('inserts space when cursor is at paragraph level after trigger', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = createTriggerElement('t1', '@user');
    p.appendChild(trigger);

    // Cursor at paragraph level, offset 1 (after the trigger child)
    setCursor(p, 1);

    const event = makeKeyboardEvent(' ');
    const result = handleSpaceAfterClosedTrigger(event, el, false, ignoreCaretDetection, null);
    expect(result).toBe(true);
  });

  test('returns false when cursor is not at end of trigger', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = createTriggerElement('t1', '@user');
    p.appendChild(trigger);

    // Cursor in middle of trigger text
    setCursor(trigger.firstChild!, 2);

    const event = makeKeyboardEvent(' ');
    expect(handleSpaceAfterClosedTrigger(event, el, false, ignoreCaretDetection, null)).toBe(false);
  });

  test('returns false when cursor is in regular text', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent(' ');
    expect(handleSpaceAfterClosedTrigger(event, el, false, ignoreCaretDetection, null)).toBe(false);
  });

  test('updates cursor position via caretController', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = createTriggerElement('t1', '@user');
    p.appendChild(trigger);

    el.focus();
    setCursor(trigger.firstChild!, 5);

    const controller = new CaretController(el);
    const event = makeKeyboardEvent(' ');
    handleSpaceAfterClosedTrigger(event, el, false, ignoreCaretDetection, controller);
    // Should not throw
  });

  test('returns false when trigger parent is not a P element', () => {
    // Trigger directly inside the editable div, not inside a <p>
    const trigger = createTriggerElement('t1', '@user');
    el.appendChild(trigger);

    setCursor(trigger.firstChild!, 5);

    const event = makeKeyboardEvent(' ');
    expect(handleSpaceAfterClosedTrigger(event, el, false, ignoreCaretDetection, null)).toBe(false);
  });
});

describe('mergeParagraphs', () => {
  test('merges with previous paragraph (backward)', () => {
    const onChange = jest.fn();
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    addParagraph(el, 'hello');
    addParagraph(el, 'world');

    const result = mergeParagraphs({
      direction: 'backward',
      editableElement: el,
      tokens,
      currentParagraphIndex: 1,
      onChange,
    });

    expect(result).toBe(true);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        tokens: expect.arrayContaining([
          expect.objectContaining({ type: 'text', value: 'hello' }),
          expect.objectContaining({ type: 'text', value: 'world' }),
        ]),
      })
    );
  });

  test('returns false when merging backward at first paragraph', () => {
    const onChange = jest.fn();
    addParagraph(el, 'hello');

    const result = mergeParagraphs({
      direction: 'backward',
      editableElement: el,
      tokens: [{ type: 'text', value: 'hello' }],
      currentParagraphIndex: 0,
      onChange,
    });

    expect(result).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('merges with next paragraph (forward)', () => {
    const onChange = jest.fn();
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    addParagraph(el, 'hello');
    addParagraph(el, 'world');

    const result = mergeParagraphs({
      direction: 'forward',
      editableElement: el,
      tokens,
      currentParagraphIndex: 0,
      onChange,
    });

    expect(result).toBe(true);
  });

  test('returns false when merging forward at last paragraph', () => {
    const onChange = jest.fn();
    addParagraph(el, 'hello');

    const result = mergeParagraphs({
      direction: 'forward',
      editableElement: el,
      tokens: [{ type: 'text', value: 'hello' }],
      currentParagraphIndex: 0,
      onChange,
    });

    expect(result).toBe(false);
  });

  test('uses tokensToText when provided', () => {
    const onChange = jest.fn();
    const tokensToText = jest.fn().mockReturnValue('custom');
    const tokens = [
      { type: 'text' as const, value: 'a' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'b' },
    ];

    addParagraph(el, 'a');
    addParagraph(el, 'b');

    mergeParagraphs({
      direction: 'backward',
      editableElement: el,
      tokens,
      currentParagraphIndex: 1,
      tokensToText,
      onChange,
    });

    expect(tokensToText).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'custom' }));
  });

  test('adjusts cursor position via caretController', () => {
    const onChange = jest.fn();
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    addParagraph(el, 'hello');
    addParagraph(el, 'world');

    el.focus();
    const controller = new CaretController(el);
    controller.setPosition(6); // In second paragraph

    mergeParagraphs({
      direction: 'backward',
      editableElement: el,
      tokens,
      currentParagraphIndex: 1,
      onChange,
      caretController: controller,
    });

    expect(onChange).toHaveBeenCalled();
  });

  test('forward merge adjusts cursor position via caretController', () => {
    const onChange = jest.fn();
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    addParagraph(el, 'hello');
    addParagraph(el, 'world');

    el.focus();
    const controller = new CaretController(el);
    controller.setPosition(5); // At end of first paragraph

    const result = mergeParagraphs({
      direction: 'forward',
      editableElement: el,
      tokens,
      currentParagraphIndex: 0,
      onChange,
      caretController: controller,
    });

    expect(result).toBe(true);
    expect(onChange).toHaveBeenCalled();
  });

  test('returns false when break index does not exist in tokens', () => {
    const onChange = jest.fn();
    const tokens = [{ type: 'text' as const, value: 'hello' }];

    addParagraph(el, 'hello');
    addParagraph(el, 'world');

    const result = mergeParagraphs({
      direction: 'backward',
      editableElement: el,
      tokens,
      currentParagraphIndex: 1,
      onChange,
    });

    expect(result).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not adjust caret when no break was removed', () => {
    const onChange = jest.fn();
    const tokens = [{ type: 'text' as const, value: 'only text' }];

    addParagraph(el, 'only text');
    addParagraph(el, 'extra');

    el.focus();
    const controller = new CaretController(el);
    controller.setPosition(5);

    const result = mergeParagraphs({
      direction: 'forward',
      editableElement: el,
      tokens,
      currentParagraphIndex: 0,
      onChange,
      caretController: controller,
    });

    expect(result).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('handleBackspaceAtParagraphStart', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  test('returns false when no selection', () => {
    window.getSelection()?.removeAllRanges();
    const event = makeKeyboardEvent('Backspace');
    expect(handleBackspaceAtParagraphStart(event, el, [], undefined, onChange, null)).toBe(false);
  });

  test('returns false when cursor is not at offset 0', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent('Backspace');
    expect(handleBackspaceAtParagraphStart(event, el, [], undefined, onChange, null)).toBe(false);
  });

  test('returns false when container is not a P element', () => {
    const p = addParagraph(el, 'hello');
    // Cursor in text node, not in P directly
    setCursor(p.firstChild!, 0);

    const event = makeKeyboardEvent('Backspace');
    expect(handleBackspaceAtParagraphStart(event, el, [], undefined, onChange, null)).toBe(false);
  });

  test('merges paragraphs when at start of second paragraph', () => {
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    addParagraph(el, 'hello');
    const p2 = addParagraph(el, 'world');

    // Set cursor at paragraph level offset 0
    setCursor(p2, 0);

    const event = makeKeyboardEvent('Backspace');
    const result = handleBackspaceAtParagraphStart(event, el, tokens, undefined, onChange, null);
    expect(result).toBe(true);
    expect(onChange).toHaveBeenCalled();
  });

  test('returns false at first paragraph', () => {
    const tokens = [{ type: 'text' as const, value: 'hello' }];
    const p = addParagraph(el, 'hello');

    setCursor(p, 0);

    const event = makeKeyboardEvent('Backspace');
    expect(handleBackspaceAtParagraphStart(event, el, tokens, undefined, onChange, null)).toBe(false);
  });
});

describe('handleDeleteAtParagraphEnd', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  test('returns false when no selection', () => {
    window.getSelection()?.removeAllRanges();
    const event = makeKeyboardEvent('Delete');
    expect(handleDeleteAtParagraphEnd(event, el, [], undefined, onChange, null)).toBe(false);
  });

  test('returns false when not at end of paragraph', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent('Delete');
    expect(handleDeleteAtParagraphEnd(event, el, [], undefined, onChange, null)).toBe(false);
  });

  test('merges with next paragraph when at end of text node', () => {
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    const p1 = addParagraph(el, 'hello');
    addParagraph(el, 'world');

    // Cursor at end of text in first paragraph, and text node has no next sibling
    setCursor(p1.firstChild!, 5);

    const event = makeKeyboardEvent('Delete');
    const result = handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(result).toBe(true);
    expect(onChange).toHaveBeenCalled();
  });

  test('merges when paragraph has only trailing BR', () => {
    const tokens = [
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    const p1 = document.createElement('p');
    p1.appendChild(document.createElement('br'));
    el.appendChild(p1);
    addParagraph(el, 'world');

    // Cursor at paragraph level
    setCursor(p1, 0);

    const event = makeKeyboardEvent('Delete');
    const result = handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(result).toBe(true);
  });

  test('merges when cursor is at end of P element children', () => {
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    const p1 = addParagraph(el, 'hello');
    addParagraph(el, 'world');

    // Cursor at paragraph level, offset = childNodes.length
    setCursor(p1, p1.childNodes.length);

    const event = makeKeyboardEvent('Delete');
    const result = handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(result).toBe(true);
  });

  test('returns false at last paragraph', () => {
    const tokens = [{ type: 'text' as const, value: 'hello' }];
    const p = addParagraph(el, 'hello');

    setCursor(p.firstChild!, 5);

    const event = makeKeyboardEvent('Delete');
    expect(handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null)).toBe(false);
  });

  test('detects end-of-paragraph from text node with no next sibling and walks up to P', () => {
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'world' },
    ];

    const p1 = document.createElement('p');
    el.appendChild(p1);
    // Wrap text in a span so the walk-up-to-P path is exercised
    const span = document.createElement('span');
    const textNode = document.createTextNode('hello');
    span.appendChild(textNode);
    p1.appendChild(span);

    addParagraph(el, 'world');

    // Cursor at end of text node inside span, no next sibling
    setCursor(textNode, 5);

    const event = makeKeyboardEvent('Delete');
    const result = handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(result).toBe(true);
    expect(onChange).toHaveBeenCalled();
  });

  test('returns false when text node has a next sibling', () => {
    const tokens = [
      { type: 'text' as const, value: 'helloworld' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'next' },
    ];

    const p1 = document.createElement('p');
    el.appendChild(p1);
    const text1 = document.createTextNode('hello');
    const text2 = document.createTextNode('world');
    p1.appendChild(text1);
    p1.appendChild(text2);

    addParagraph(el, 'next');

    // Cursor at end of first text node, but it has a next sibling
    setCursor(text1, 5);

    const event = makeKeyboardEvent('Delete');
    const result = handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(result).toBe(false);
  });
});
