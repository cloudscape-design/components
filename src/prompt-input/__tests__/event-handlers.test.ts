// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

jest.mock('../styles.css.js', () => ({ paragraph: 'paragraph', 'trigger-token': 'trigger-token' }), { virtual: true });

import './jsdom-polyfills';
import { KeyCode } from '../../internal/keycode';
import { CaretController } from '../core/caret-controller';
import {
  handleBackspaceAtParagraphStart,
  handleDeleteAtParagraphEnd,
  handleEditableKeyDown,
  handleInlineEnd,
  handleInlineStart,
  handleReferenceTokenDeletion,
  handleSpaceAfterClosedTrigger,
  KeyboardHandlerProps,
  mergeParagraphs,
  splitParagraphAtCaret,
} from '../core/event-handlers';
import { MenuItemsHandlers, MenuItemsState } from '../core/menu-state';
import { handleDeleteAfterTrigger } from '../core/trigger-utils';
import { PromptInputProps } from '../interfaces';

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

function makeKeyboardEvent(
  keyCode: number,
  opts: Partial<KeyboardEventInit> = {}
): React.KeyboardEvent<HTMLDivElement> {
  const keyNames: Record<number, string> = {
    [KeyCode.down]: 'ArrowDown',
    [KeyCode.up]: 'ArrowUp',
    [KeyCode.left]: 'ArrowLeft',
    [KeyCode.right]: 'ArrowRight',
    [KeyCode.enter]: 'Enter',
    [KeyCode.tab]: 'Tab',
    [KeyCode.escape]: 'Escape',
    [KeyCode.backspace]: 'Backspace',
    [KeyCode.delete]: 'Delete',
    [KeyCode.space]: ' ',
    [KeyCode.home]: 'Home',
    [KeyCode.end]: 'End',
    [KeyCode.pageUp]: 'PageUp',
    [KeyCode.pageDown]: 'PageDown',
    [KeyCode.a]: 'a',
  };
  const key = keyNames[keyCode] ?? '';
  const nativeEvent = new KeyboardEvent('keydown', { key, keyCode, bubbles: true, ...opts });
  let defaultPrevented = false;
  return {
    key,
    keyCode,
    shiftKey: opts.shiftKey ?? false,
    ctrlKey: opts.ctrlKey ?? false,
    metaKey: opts.metaKey ?? false,
    preventDefault: () => {
      defaultPrevented = true;
    },
    isDefaultPrevented: () => defaultPrevented,
    nativeEvent,
    currentTarget: el,
  } as unknown as React.KeyboardEvent<HTMLDivElement>;
}

describe('handleEditableKeyDown', () => {
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

  function defaultProps(overrides: Partial<KeyboardHandlerProps> = {}): KeyboardHandlerProps {
    return {
      editableElement: el,
      editableState: { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null },
      caretController: null,
      tokens: [],
      getMenuOpen: () => false,
      getMenuItemsState: () => null,
      getMenuItemsHandlers: () => null,
      closeMenu: jest.fn(),
      menuIsOpen: false,
      onChange: jest.fn(),
      markTokensAsSent: jest.fn(),
      ...overrides,
    };
  }

  describe('menu navigation', () => {
    test('ArrowDown with closed menu does not move highlight', () => {
      const handlers = createMockMenuHandlers();
      const props = defaultProps({ getMenuItemsHandlers: () => handlers });
      handleEditableKeyDown(makeKeyboardEvent(KeyCode.down), props);
      expect(handlers.moveHighlightWithKeyboard).not.toHaveBeenCalled();
    });

    test('ArrowDown with open menu moves highlight forward', () => {
      const handlers = createMockMenuHandlers();
      const event = makeKeyboardEvent(KeyCode.down);
      handleEditableKeyDown(
        event,
        defaultProps({
          getMenuOpen: () => true,
          getMenuItemsState: () => createMockMenuState([{}]),
          getMenuItemsHandlers: () => handlers,
        })
      );
      expect(handlers.moveHighlightWithKeyboard).toHaveBeenCalledWith(1);
      expect(event.isDefaultPrevented()).toBe(true);
    });

    test('ArrowUp with open menu moves highlight backward', () => {
      const handlers = createMockMenuHandlers();
      const event = makeKeyboardEvent(KeyCode.up);
      handleEditableKeyDown(
        event,
        defaultProps({
          getMenuOpen: () => true,
          getMenuItemsState: () => createMockMenuState([{}]),
          getMenuItemsHandlers: () => handlers,
        })
      );
      expect(handlers.moveHighlightWithKeyboard).toHaveBeenCalledWith(-1);
      expect(event.isDefaultPrevented()).toBe(true);
    });

    test('Enter with open menu selects highlighted option', () => {
      const handlers = createMockMenuHandlers();
      const event = makeKeyboardEvent(KeyCode.enter);
      handleEditableKeyDown(
        event,
        defaultProps({
          getMenuOpen: () => true,
          getMenuItemsState: () => createMockMenuState([{}]),
          getMenuItemsHandlers: () => handlers,
        })
      );
      expect(handlers.selectHighlightedOptionWithKeyboard).toHaveBeenCalled();
      expect(event.isDefaultPrevented()).toBe(true);
    });

    test('Tab with open menu selects highlighted option', () => {
      const handlers = createMockMenuHandlers();
      const event = makeKeyboardEvent(KeyCode.tab);
      handleEditableKeyDown(
        event,
        defaultProps({
          getMenuOpen: () => true,
          getMenuItemsState: () => createMockMenuState([{}]),
          getMenuItemsHandlers: () => handlers,
        })
      );
      expect(handlers.selectHighlightedOptionWithKeyboard).toHaveBeenCalled();
      expect(event.isDefaultPrevented()).toBe(true);
    });

    test('Escape with open menu closes it', () => {
      const closeMenu = jest.fn();
      const event = makeKeyboardEvent(KeyCode.escape);
      handleEditableKeyDown(
        event,
        defaultProps({
          getMenuOpen: () => true,
          getMenuItemsState: () => createMockMenuState([{}]),
          getMenuItemsHandlers: () => createMockMenuHandlers(),
          closeMenu,
        })
      );
      expect(closeMenu).toHaveBeenCalled();
      expect(event.isDefaultPrevented()).toBe(true);
    });
  });

  describe('Enter key submit', () => {
    test('calls onAction with token text', () => {
      const onAction = jest.fn();
      const tokens: PromptInputProps.InputToken[] = [{ type: 'text', value: 'hello' }];
      handleEditableKeyDown(makeKeyboardEvent(KeyCode.enter), defaultProps({ onAction, tokens }));
      expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ value: 'hello', tokens: expect.any(Array) }));
    });

    test('uses tokensToText when provided', () => {
      const onAction = jest.fn();
      const tokensToText = jest.fn().mockReturnValue('custom text');
      handleEditableKeyDown(
        makeKeyboardEvent(KeyCode.enter),
        defaultProps({
          onAction,
          tokens: [{ type: 'text', value: 'hello' }],
          tokensToText,
        })
      );
      expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ value: 'custom text' }));
    });

    test('prevents default when disabled', () => {
      const event = makeKeyboardEvent(KeyCode.enter);
      handleEditableKeyDown(event, defaultProps({ disabled: true }));
      expect(event.isDefaultPrevented()).toBe(true);
    });

    test('prevents default when readOnly', () => {
      const event = makeKeyboardEvent(KeyCode.enter);
      handleEditableKeyDown(event, defaultProps({ readOnly: true }));
      expect(event.isDefaultPrevented()).toBe(true);
    });

    test('submits form when inside one', () => {
      const form = document.createElement('form');
      form.requestSubmit = jest.fn();
      form.appendChild(el);
      document.body.appendChild(form);

      handleEditableKeyDown(makeKeyboardEvent(KeyCode.enter), defaultProps());
      expect(form.requestSubmit).toHaveBeenCalled();

      form.removeChild(el);
      document.body.removeChild(form);
      document.body.appendChild(el);
    });

    test('Shift+Enter does not submit', () => {
      const onAction = jest.fn();
      handleEditableKeyDown(makeKeyboardEvent(KeyCode.enter, { shiftKey: true }), defaultProps({ onAction }));
      expect(onAction).not.toHaveBeenCalled();
    });
  });

  describe('Shift+Enter creates new paragraph', () => {
    test('splits paragraph at caret position', () => {
      addParagraph(el, 'hello world');
      setCursor(el.querySelector('p')!.firstChild!, 5);

      const event = makeKeyboardEvent(KeyCode.enter, { shiftKey: true });
      handleEditableKeyDown(
        event,
        defaultProps({
          tokens: [{ type: 'text', value: 'hello world' }],
        })
      );

      expect(event.isDefaultPrevented()).toBe(true);
      expect(el.querySelectorAll('p').length).toBe(2);
    });
  });

  describe('Ctrl+A on empty input', () => {
    test('prevents default when tokens array is empty', () => {
      const event = makeKeyboardEvent(KeyCode.a, { ctrlKey: true });
      handleEditableKeyDown(event, defaultProps({ tokens: [] }));
      expect(event.isDefaultPrevented()).toBe(true);
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
    expect(paragraphs[0].textContent).toBe('hello');
    expect(paragraphs[1].textContent).toBe('');
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
    // First paragraph should be empty, second has the content
    expect(paragraphs[0].textContent).toBe('');
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
  const mockState = { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null };

  test('returns false when no selection', () => {
    window.getSelection()?.removeAllRanges();
    const event = makeKeyboardEvent(KeyCode.backspace);
    handleReferenceTokenDeletion(event, true, el, mockState, undefined, undefined, null);
    expect(event.isDefaultPrevented()).toBe(false);
  });

  test('handles non-collapsed selection by deleting contents', () => {
    const p = addParagraph(el, 'hello world');
    setSelection(p.firstChild!, 0, p.firstChild!, 5);

    const event = makeKeyboardEvent(KeyCode.backspace);
    handleReferenceTokenDeletion(event, true, el, mockState, undefined, undefined, null);
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.backspace);
    const state = { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null };
    handleReferenceTokenDeletion(event, true, el, state, undefined, undefined, null);
    expect(event.isDefaultPrevented()).toBe(true);
    expect(state.skipNextZeroWidthUpdate).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.delete);
    const state = { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null };
    handleReferenceTokenDeletion(event, false, el, state, undefined, undefined, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('returns false when no adjacent reference token', () => {
    const p = addParagraph(el, 'hello world');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent(KeyCode.backspace);
    handleReferenceTokenDeletion(event, true, el, mockState, undefined, undefined, null);
    expect(event.isDefaultPrevented()).toBe(false);
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
    const i18n = { tokenRemovedAriaLabel: ({ label }: { label: string }) => `${label} removed` };
    const event = makeKeyboardEvent(KeyCode.backspace);
    handleReferenceTokenDeletion(
      event,
      true,
      el,
      { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null },
      announce,
      i18n as any,
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
    const event = makeKeyboardEvent(KeyCode.backspace);
    handleReferenceTokenDeletion(
      event,
      true,
      el,
      { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null },
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
    const event = makeKeyboardEvent(KeyCode.backspace);
    handleReferenceTokenDeletion(
      event,
      true,
      el,
      { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null },
      undefined,
      undefined,
      controller
    );
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.backspace);
    const state = { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null };
    handleReferenceTokenDeletion(event, true, el, state, undefined, undefined, null);
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.delete);
    const state = { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null };
    handleReferenceTokenDeletion(event, false, el, state, undefined, undefined, null);
    expect(event.isDefaultPrevented()).toBe(true);
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
    const event = makeKeyboardEvent(KeyCode.delete);
    handleReferenceTokenDeletion(
      event,
      false,
      el,
      { skipNextZeroWidthUpdate: false, menuSelectionTokenId: null },
      undefined,
      undefined,
      controller
    );
    expect(event.isDefaultPrevented()).toBe(true);
  });
});

describe('handleInlineStart and handleInlineEnd', () => {
  test('does not preventDefault when no selection exists', () => {
    window.getSelection()?.removeAllRanges();
    const event = makeKeyboardEvent(KeyCode.left);
    handleInlineStart(event, null);
    expect(event.isDefaultPrevented()).toBe(false);
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
    const event = makeKeyboardEvent(KeyCode.right);
    handleInlineEnd(event, controller);
    expect(event.isDefaultPrevented()).toBe(true);
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
    const event = makeKeyboardEvent(KeyCode.left);
    handleInlineStart(event, controller);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('returns false when no adjacent reference token', () => {
    const p = addParagraph(el, 'hello world');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent(KeyCode.right);
    handleInlineEnd(event, null);
    expect(event.isDefaultPrevented()).toBe(false);
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

    const event = makeKeyboardEvent(KeyCode.right, { shiftKey: true });
    handleInlineEnd(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.left, { shiftKey: true });
    handleInlineStart(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('Shift+Arrow returns false when no adjacent reference', () => {
    const p = addParagraph(el, 'hello world');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent(KeyCode.right, { shiftKey: true });
    handleInlineEnd(event, null);
    expect(event.isDefaultPrevented()).toBe(false);
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

    // Set up selection with focus at the extending (left) edge
    const sel = window.getSelection()!;
    sel.collapse(text, 3); // anchor at text offset 3
    sel.extend(p, 1); // focus at paragraph level after reference

    const event = makeKeyboardEvent(KeyCode.left, { shiftKey: true });
    handleInlineStart(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.right, { shiftKey: true });
    handleInlineEnd(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.left, { shiftKey: true });
    handleInlineStart(event, null);
    expect(event.isDefaultPrevented()).toBe(false);
  });

  test('normalizes cursor out of cursor-spot-before on ArrowLeft', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(wrapper);

    // Place cursor inside cursor-spot-before
    const cursorSpotBefore = wrapper.querySelector('[data-type="cursor-spot-before"]')!;
    setCursor(cursorSpotBefore.firstChild!, 0);

    const event = makeKeyboardEvent(KeyCode.left);
    handleInlineStart(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('normalizes cursor out of cursor-spot-after on ArrowRight', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(wrapper);

    // Place cursor inside cursor-spot-after
    const cursorSpotAfter = wrapper.querySelector('[data-type="cursor-spot-after"]')!;
    setCursor(cursorSpotAfter.firstChild!, 0);

    const event = makeKeyboardEvent(KeyCode.right);
    handleInlineEnd(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });
});

describe('handleSpaceAfterClosedTrigger', () => {
  beforeEach(() => {});

  test('returns false for non-space key', () => {
    addParagraph(el, 'hello');
    setCursor(el.querySelector('p')!.firstChild!, 3);
    expect(handleSpaceAfterClosedTrigger(makeKeyboardEvent(KeyCode.a), el, false, null)).toBe(false);
  });

  test('returns false when menu is open', () => {
    addParagraph(el, 'hello');
    setCursor(el.querySelector('p')!.firstChild!, 3);
    expect(handleSpaceAfterClosedTrigger(makeKeyboardEvent(KeyCode.space), el, true, null)).toBe(false);
  });

  test('returns false when no selection', () => {
    window.getSelection()?.removeAllRanges();
    expect(handleSpaceAfterClosedTrigger(makeKeyboardEvent(KeyCode.space), el, false, null)).toBe(false);
  });

  test('returns false when selection is not collapsed', () => {
    const p = addParagraph(el, 'hello');
    setSelection(p.firstChild!, 0, p.firstChild!, 3);
    expect(handleSpaceAfterClosedTrigger(makeKeyboardEvent(KeyCode.space), el, false, null)).toBe(false);
  });

  test('inserts space after trigger when cursor is at end of trigger text', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = createTriggerElement('t1', '@user');
    p.appendChild(trigger);

    // Cursor at end of trigger text
    setCursor(trigger.firstChild!, 5);

    const event = makeKeyboardEvent(KeyCode.space);
    handleSpaceAfterClosedTrigger(event, el, false, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('inserts space when cursor is at paragraph level after trigger', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = createTriggerElement('t1', '@user');
    p.appendChild(trigger);

    // Cursor at paragraph level, offset 1 (after the trigger child)
    setCursor(p, 1);

    const event = makeKeyboardEvent(KeyCode.space);
    handleSpaceAfterClosedTrigger(event, el, false, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('returns false when cursor is not at end of trigger', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = createTriggerElement('t1', '@user');
    p.appendChild(trigger);

    // Cursor in middle of trigger text
    setCursor(trigger.firstChild!, 2);

    const event = makeKeyboardEvent(KeyCode.space);
    expect(handleSpaceAfterClosedTrigger(event, el, false, null)).toBe(false);
  });

  test('returns false when cursor is in regular text', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent(KeyCode.space);
    expect(handleSpaceAfterClosedTrigger(event, el, false, null)).toBe(false);
  });

  test('updates cursor position via caretController', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = createTriggerElement('t1', '@user');
    p.appendChild(trigger);

    el.focus();
    setCursor(trigger.firstChild!, 5);

    const controller = new CaretController(el);
    const event = makeKeyboardEvent(KeyCode.space);
    handleSpaceAfterClosedTrigger(event, el, false, controller);
    expect(event.isDefaultPrevented()).toBe(true);
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
    const event = makeKeyboardEvent(KeyCode.backspace);
    expect(handleBackspaceAtParagraphStart(event, el, [], undefined, onChange, null)).toBe(false);
  });

  test('returns false when cursor is not at offset 0', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent(KeyCode.backspace);
    expect(handleBackspaceAtParagraphStart(event, el, [], undefined, onChange, null)).toBe(false);
  });

  test('returns false when container is not a P element', () => {
    const p = addParagraph(el, 'hello');
    // Cursor in text node, not in P directly
    setCursor(p.firstChild!, 0);

    const event = makeKeyboardEvent(KeyCode.backspace);
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

    const event = makeKeyboardEvent(KeyCode.backspace);
    handleBackspaceAtParagraphStart(event, el, tokens, undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(true);
    expect(onChange).toHaveBeenCalled();
  });

  test('returns false at first paragraph', () => {
    const tokens = [{ type: 'text' as const, value: 'hello' }];
    const p = addParagraph(el, 'hello');

    setCursor(p, 0);

    const event = makeKeyboardEvent(KeyCode.backspace);
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
    const event = makeKeyboardEvent(KeyCode.delete);
    expect(handleDeleteAtParagraphEnd(event, el, [], undefined, onChange, null)).toBe(false);
  });

  test('returns false when not at end of paragraph', () => {
    const p = addParagraph(el, 'hello');
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent(KeyCode.delete);
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

    const event = makeKeyboardEvent(KeyCode.delete);
    handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.delete);
    handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.delete);
    handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('returns false at last paragraph', () => {
    const tokens = [{ type: 'text' as const, value: 'hello' }];
    const p = addParagraph(el, 'hello');

    setCursor(p.firstChild!, 5);

    const event = makeKeyboardEvent(KeyCode.delete);
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

    const event = makeKeyboardEvent(KeyCode.delete);
    handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(true);
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

    const event = makeKeyboardEvent(KeyCode.delete);
    handleDeleteAtParagraphEnd(event, el, tokens, undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(false);
  });
});

describe('event-handlers - defensive checks', () => {
  test('handleBackspaceAtParagraphStart returns false when paragraph not found in list', () => {
    const p = document.createElement('p');
    // Don't add to el — paragraph won't be found by findAllParagraphs
    p.appendChild(document.createTextNode('orphan'));

    setCursor(p, 0);

    const event = makeKeyboardEvent(KeyCode.backspace);
    const onChange = jest.fn();
    handleBackspaceAtParagraphStart(event, el, [], undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(false);
  });

  test('handleDeleteAtParagraphEnd returns false when paragraph not found in list', () => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('orphan'));
    // Don't add to el

    setCursor(p, 1);

    const event = makeKeyboardEvent(KeyCode.delete);
    const onChange = jest.fn();
    handleDeleteAtParagraphEnd(event, el, [], undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(false);
  });

  test('handleSpaceAfterClosedTrigger with caretController positions caret', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = document.createElement('span');
    trigger.setAttribute('data-type', 'trigger');
    trigger.textContent = '@test';
    p.appendChild(trigger);

    const triggerText = trigger.firstChild!;
    setCursor(triggerText, 5); // at end of trigger text

    const controller = new CaretController(el);
    el.focus();

    const event = makeKeyboardEvent(KeyCode.space);

    handleSpaceAfterClosedTrigger(event, el, false, controller);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('handleShiftArrow returns false when no adjacent sibling', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    // Select middle of text — no reference adjacent
    const range = document.createRange();
    range.setStart(text, 1);
    range.setEnd(text, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const event = makeKeyboardEvent(KeyCode.left, { shiftKey: true });
    handleInlineStart(event, null);
    expect(event.isDefaultPrevented()).toBe(false);
  });

  test('handleShiftArrow from element-level container', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const after = document.createTextNode('world');
    p.appendChild(after);

    // Focus at left edge (p, 1) extending backward toward reference
    const sel = window.getSelection()!;
    sel.collapse(after, 3); // anchor
    sel.extend(p, 1); // focus at paragraph level after ref

    const event = makeKeyboardEvent(KeyCode.left, { shiftKey: true });
    handleInlineStart(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });
});

describe('handleShiftArrow - sibling is not a reference', () => {
  test('returns false when adjacent sibling is a trigger (not reference)', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const trigger = document.createElement('span');
    trigger.setAttribute('data-type', 'trigger');
    trigger.textContent = '@mention';
    p.appendChild(trigger);

    // Select to end of text — shift+right would find the trigger
    const range = document.createRange();
    range.setStart(text, 2);
    range.setEnd(text, 5);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const event = {
      key: 'ArrowRight',
      shiftKey: true,
      preventDefault: jest.fn(),
      currentTarget: el,
    } as unknown as React.KeyboardEvent<HTMLDivElement>;

    handleInlineEnd(event, null);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

describe('event-handlers - defensive guard coverage', () => {
  test('handleReferenceTokenDeletion returns false when element has no parent', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    setCursor(p, 1);

    // Detach the ref so parentNode is null
    ref.remove();

    const state = { skipNextZeroWidthUpdate: false } as any;
    const event = makeKeyboardEvent(KeyCode.backspace);
    const result = handleReferenceTokenDeletion(event, true, el, state, undefined, undefined, null);
    // No reference found at cursor position since it was removed
    expect(result).toBe(false);
  });

  test('handleSpaceAfterClosedTrigger without caretController still works', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const trigger = document.createElement('span');
    trigger.setAttribute('data-type', 'trigger');
    trigger.textContent = '@test';
    p.appendChild(trigger);

    setCursor(trigger.firstChild!, 5);

    const event = makeKeyboardEvent(KeyCode.space);

    handleSpaceAfterClosedTrigger(event, el, false, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('handleBackspaceAtParagraphStart returns false when paragraph not in editable element', () => {
    const p1 = document.createElement('p');
    el.appendChild(p1);
    p1.appendChild(document.createTextNode('first'));

    // Create an orphan paragraph not in el
    const orphanP = document.createElement('p');
    orphanP.appendChild(document.createTextNode('orphan'));
    document.body.appendChild(orphanP);

    setCursor(orphanP, 0);

    const event = makeKeyboardEvent(KeyCode.backspace);
    const onChange = jest.fn();
    handleBackspaceAtParagraphStart(event, el, [], undefined, onChange, null);
    // startContainer is orphanP which is an HTMLElement with nodeName 'P' and offset 0
    // but it's not in el's paragraphs, so pIndex < 0
    expect(event.isDefaultPrevented()).toBe(false);
  });

  test('handleDeleteAtParagraphEnd returns false when paragraph not in editable element', () => {
    const p1 = document.createElement('p');
    el.appendChild(p1);
    p1.appendChild(document.createTextNode('first'));

    // Create an orphan paragraph
    const orphanP = document.createElement('p');
    const orphanText = document.createTextNode('orphan');
    orphanP.appendChild(orphanText);
    document.body.appendChild(orphanP);

    // Cursor at end of orphan text, no next sibling
    setCursor(orphanText, 6);

    const event = makeKeyboardEvent(KeyCode.delete);
    const onChange = jest.fn();
    handleDeleteAtParagraphEnd(event, el, [], undefined, onChange, null);
    expect(event.isDefaultPrevented()).toBe(false);
  });
});

describe('RTL arrow key navigation', () => {
  beforeEach(() => {
    el.style.direction = 'rtl';
  });

  afterEach(() => {
    el.style.direction = '';
  });

  test('ArrowLeft jumps forward over reference in RTL', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const after = document.createTextNode(' world');
    p.appendChild(after);

    // Cursor at end of 'hello' — ArrowLeft in RTL = inline-end (forward)
    setCursor(text, 5);

    const controller = new CaretController(el);
    el.focus();

    const event = makeKeyboardEvent(KeyCode.left);
    // handleKey resolves RTL: ArrowLeft in RTL → onInlineEnd → handleInlineEnd
    handleInlineEnd(event, controller);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('ArrowRight jumps backward over reference in RTL', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const after = document.createTextNode(' world');
    p.appendChild(after);

    // Cursor at start of ' world' — ArrowRight in RTL = inline-start (backward)
    setCursor(after, 0);

    const controller = new CaretController(el);
    el.focus();

    const event = makeKeyboardEvent(KeyCode.right);
    // handleKey resolves RTL: ArrowRight in RTL → onInlineStart → handleInlineStart
    handleInlineStart(event, controller);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('Shift+ArrowLeft extends selection forward in RTL', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const after = document.createTextNode(' world');
    p.appendChild(after);

    const range = document.createRange();
    range.setStart(text, 2);
    range.setEnd(text, 5);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const event = makeKeyboardEvent(KeyCode.left, { shiftKey: true });
    // handleKey resolves RTL: Shift+ArrowLeft in RTL → onShiftInlineEnd → handleInlineEnd
    handleInlineEnd(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });

  test('Shift+ArrowRight extends selection backward in RTL', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const text = document.createTextNode('hello');
    p.appendChild(text);

    const ref = document.createElement('span');
    ref.setAttribute('data-type', 'reference');
    ref.textContent = 'Alice';
    p.appendChild(ref);

    const after = document.createTextNode(' world');
    p.appendChild(after);

    const sel = window.getSelection()!;
    sel.collapse(after, 3);
    sel.extend(after, 0);

    const event = makeKeyboardEvent(KeyCode.right, { shiftKey: true });
    // handleKey resolves RTL: Shift+ArrowRight in RTL → onShiftInlineStart → handleInlineStart
    handleInlineStart(event, null);
    expect(event.isDefaultPrevented()).toBe(true);
  });
});

describe('handleDeleteAfterTrigger', () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  test('removes leading space and fires input when cursor is at end of trigger text node', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const trigger = createTriggerElement('t1', '@bob');
    const textNode = document.createTextNode(' hello world');
    p.appendChild(trigger);
    p.appendChild(textNode);

    setCursor(trigger.firstChild!, 4);

    const inputFired = jest.fn();
    el.addEventListener('input', inputFired);

    const event = new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true });
    const result = handleDeleteAfterTrigger(event as any, el);

    expect(result).toBe(true);
    expect(event.defaultPrevented).toBe(true);
    expect(textNode.textContent).toBe('hello world');
    expect(inputFired).toHaveBeenCalled();
  });

  test('removes the text node entirely when it contains only a space', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const trigger = createTriggerElement('t1', '@bob');
    const textNode = document.createTextNode(' ');
    p.appendChild(trigger);
    p.appendChild(textNode);

    setCursor(trigger.firstChild!, 4);

    const event = new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true });
    handleDeleteAfterTrigger(event as any, el);

    expect(p.childNodes).toHaveLength(1);
    expect(p.firstChild).toBe(trigger);
  });

  test('works when cursor is at paragraph level after the trigger element', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const trigger = createTriggerElement('t1', '@bob');
    const textNode = document.createTextNode(' hello');
    p.appendChild(trigger);
    p.appendChild(textNode);

    setCursor(p, 1);

    const event = new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true });
    const result = handleDeleteAfterTrigger(event as any, el);

    expect(result).toBe(true);
    expect(textNode.textContent).toBe('hello');
  });

  test('does not handle when next text has no leading space', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const trigger = createTriggerElement('t1', '@bob');
    const textNode = document.createTextNode('hello');
    p.appendChild(trigger);
    p.appendChild(textNode);

    setCursor(trigger.firstChild!, 4);

    const event = new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true });
    expect(handleDeleteAfterTrigger(event as any, el)).toBe(false);
    expect(textNode.textContent).toBe('hello');
  });
});
