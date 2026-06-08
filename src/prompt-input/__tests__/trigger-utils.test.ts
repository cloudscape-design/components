// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

jest.mock('../styles.css.js', () => ({ 'trigger-token': 'trigger-token' }), { virtual: true });

import { CaretController } from '../core/caret-controller';
import { ElementType } from '../core/constants';
import { MenuItemsHandlers, MenuItemsState } from '../core/menu-state';
import { detectTriggerTransition, handleSpaceInOpenMenu } from '../core/trigger-utils';
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

function createTriggerElement(id: string, text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.setAttribute('data-type', ElementType.Trigger);
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

function makeKeyboardEvent(key: string): React.KeyboardEvent {
  let defaultPrevented = false;
  return {
    key,
    shiftKey: false,
    preventDefault: () => {
      defaultPrevented = true;
    },
    isDefaultPrevented: () => defaultPrevented,
    nativeEvent: new KeyboardEvent('keydown', { key }),
  } as unknown as React.KeyboardEvent;
}

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

describe('handleSpaceInOpenMenu', () => {
  test('returns false when cursor is not in a trigger element', () => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello'));
    el.appendChild(p);
    setCursor(p.firstChild!, 3);

    const event = makeKeyboardEvent(' ');
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{ type: 'child' }]),
      menuItemsHandlers: createMockMenuHandlers(),
      closeMenu: jest.fn(),
    });
    expect(result).toBe(false);
  });

  test('auto-selects single match when not loading', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@us');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 3);

    const handlers = createMockMenuHandlers();
    const event = makeKeyboardEvent(' ');
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{ type: 'child' }]),
      menuItemsHandlers: handlers,
      closeMenu: jest.fn(),
    });
    expect(result).toBe(true);
    expect(handlers.selectHighlightedOptionWithKeyboard).toHaveBeenCalled();
  });

  test('does not auto-select single match when loading', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@us');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 3);

    const handlers = createMockMenuHandlers();
    const event = makeKeyboardEvent(' ');
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{ type: 'child' }]),
      menuItemsHandlers: handlers,
      getMenuStatusType: () => 'loading',
      closeMenu: jest.fn(),
    });
    // With loading, single match doesn't auto-select; falls through
    expect(result).toBe(false);
  });

  test('does not auto-select when single item is a parent type', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@us');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 3);

    const handlers = createMockMenuHandlers();
    const event = makeKeyboardEvent(' ');
    // Only a parent item — selectableItems will be empty
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{ type: 'parent' }]),
      menuItemsHandlers: handlers,
      closeMenu: jest.fn(),
    });
    // No selectable items, falls through to other checks
    expect(result).toBe(false);
    expect(handlers.selectHighlightedOptionWithKeyboard).not.toHaveBeenCalled();
  });

  test('double space closes menu and inserts space outside trigger', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@user ');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 6);

    const closeMenu = jest.fn();
    const event = makeKeyboardEvent(' ');
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{}, {}]),
      menuItemsHandlers: createMockMenuHandlers(),
      closeMenu,
    });
    expect(result).toBe(true);
    expect(closeMenu).toHaveBeenCalled();
    // Trigger text should be trimmed
    expect(trigger.textContent).toBe('@user');
  });

  test('empty filter closes menu and inserts space', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 1);

    const closeMenu = jest.fn();
    const event = makeKeyboardEvent(' ');
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{}, {}]),
      menuItemsHandlers: createMockMenuHandlers(),
      closeMenu,
    });
    expect(result).toBe(true);
    expect(closeMenu).toHaveBeenCalled();
  });

  test('returns false when filter has text and multiple items', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@us');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 3);

    const event = makeKeyboardEvent(' ');
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{ type: 'child' }, { type: 'child' }]),
      menuItemsHandlers: createMockMenuHandlers(),
      closeMenu: jest.fn(),
    });
    expect(result).toBe(false);
  });

  test('double space with caretController updates position', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@user ');
    p.appendChild(trigger);
    el.appendChild(p);
    el.focus();
    setCursor(trigger.firstChild!, 6);

    const controller = new CaretController(el);
    const closeMenu = jest.fn();
    const event = makeKeyboardEvent(' ');
    handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{}, {}]),
      menuItemsHandlers: createMockMenuHandlers(),
      closeMenu,
      caretController: controller,
    });
    expect(closeMenu).toHaveBeenCalled();
  });

  test('pending status type is treated as loading', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@us');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 3);

    const handlers = createMockMenuHandlers();
    const event = makeKeyboardEvent(' ');
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{ type: 'child' }]),
      menuItemsHandlers: handlers,
      getMenuStatusType: () => 'pending',
      closeMenu: jest.fn(),
    });
    expect(result).toBe(false);
    expect(handlers.selectHighlightedOptionWithKeyboard).not.toHaveBeenCalled();
  });

  test('space after trigger char splits filter text out as plain text', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@hello');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 1);

    const closeMenu = jest.fn();
    const event = makeKeyboardEvent(' ');
    const result = handleSpaceInOpenMenu(event, {
      menuItemsState: createMockMenuState([{}, {}]),
      menuItemsHandlers: createMockMenuHandlers(),
      closeMenu,
    });
    expect(result).toBe(true);
    expect(closeMenu).toHaveBeenCalled();
    expect(trigger.textContent).toBe('@');
    expect(trigger.getAttribute('data-type')).toBe(ElementType.Trigger);
    expect(trigger.nextSibling?.textContent).toBe(' hello');
  });

  test('space after trigger char preserves trigger element identity', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@world');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 1);

    const closeMenu = jest.fn();
    handleSpaceInOpenMenu(makeKeyboardEvent(' '), {
      menuItemsState: createMockMenuState([{}, {}]),
      menuItemsHandlers: createMockMenuHandlers(),
      closeMenu,
    });
    expect(trigger.id).toBe('t1');
    expect(p.contains(trigger)).toBe(true);
  });

  test('space in middle of filter text does not trigger split', () => {
    const p = document.createElement('p');
    const trigger = createTriggerElement('t1', '@hello');
    p.appendChild(trigger);
    el.appendChild(p);
    setCursor(trigger.firstChild!, 3);

    const closeMenu = jest.fn();
    const result = handleSpaceInOpenMenu(makeKeyboardEvent(' '), {
      menuItemsState: createMockMenuState([{}, {}]),
      menuItemsHandlers: createMockMenuHandlers(),
      closeMenu,
    });
    expect(result).toBe(false);
    expect(closeMenu).not.toHaveBeenCalled();
  });
});

describe('detectTriggerTransition', () => {
  const trigger = (value: string, id: string): PromptInputProps.TriggerToken => ({
    type: 'trigger',
    value,
    triggerChar: '@',
    id,
  });
  const text = (value: string): PromptInputProps.TextToken => ({ type: 'text', value });

  test('returns 0 for null/undefined inputs', () => {
    expect(detectTriggerTransition(null, null)).toBe(0);
    expect(detectTriggerTransition(undefined, [text('hi')])).toBe(0);
  });

  test('returns 0 for identical tokens (no transition)', () => {
    const tokens = [trigger('bob', 't1'), text(' hello')];
    expect(detectTriggerTransition(tokens, tokens)).toBe(0);
  });

  test('returns 0 for normal single-char typing into trigger', () => {
    const old = [trigger('bo', 't1')];
    const next = [trigger('bob', 't1')];
    expect(detectTriggerTransition(old, next)).toBe(0);
  });

  test('detects empty trigger absorbing adjacent text', () => {
    const old = [trigger('', 't1'), text('hello world')];
    const next = [trigger('hello', 't1'), text(' world')];
    const pos = detectTriggerTransition(old, next);
    // Caret after trigger char: @ = 1
    expect(pos).toBe(1);
  });

  test('detects non-empty trigger absorbing adjacent text (delete-merge)', () => {
    const old = [trigger('bob', 't1'), text('hello world')];
    const next = [trigger('bobhello', 't1'), text(' world')];
    const pos = detectTriggerTransition(old, next);
    // Caret at merge point: @ (1) + bob (3) = 4
    expect(pos).toBe(4);
  });

  test('detects space split: trigger filter pushed to text token', () => {
    const old = [trigger('bob', 't1')];
    const next = [trigger('', 't1'), text(' bob')];
    const pos = detectTriggerTransition(old, next);
    // Caret after space: trigger @ (1) + 1 = 2
    expect(pos).toBe(2);
  });

  test('returns 0 for space added before existing text after trigger', () => {
    const old = [trigger('bob', 't1'), text('rest')];
    const next = [trigger('bob', 't1'), text(' rest')];
    const pos = detectTriggerTransition(old, next);
    // Not a trigger transition — handled by handleSpaceAfterClosedTrigger
    expect(pos).toBe(0);
  });

  test('does not match filter-cleared when next token is space-prefixed text (split case)', () => {
    const old = [trigger('bob', 't1'), text(' hello')];
    const next = [trigger('', 't1'), text(' bob hello')];
    // Split: trigger filter cleared and text absorbed — caret after trigger (position 1) + 1 for space
    const pos = detectTriggerTransition(old, next);
    expect(pos).toBe(2);
  });

  test('detects empty trigger absorbing text when token count stays the same', () => {
    const old = [trigger('', 't1'), text(' hello world')];
    const next = [trigger('hello', 't1'), text(' world')];
    const pos = detectTriggerTransition(old, next);
    expect(pos).toBe(1);
  });
});
