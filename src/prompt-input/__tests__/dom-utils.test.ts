// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Mock styles.css.js since it's a build artifact not available in unit tests
jest.mock('../styles.css.js', () => ({ paragraph: 'paragraph' }), { virtual: true });

import { ElementType } from '../core/constants';
import {
  createParagraph,
  createTrailingBreak,
  findAdjacentToken,
  findAllParagraphs,
  findElement,
  getTokenType,
  hasOnlyTrailingBR,
  insertAfter,
  isElementEffectivelyEmpty,
  isEmptyState,
  normalizeCaretIntoTrigger,
  scrollCaretIntoView,
  setEmptyState,
} from '../core/dom-utils';

describe('getTokenType', () => {
  test('returns data-type attribute value for known types', () => {
    const el = document.createElement('span');
    el.setAttribute('data-type', 'reference');
    expect(getTokenType(el)).toBe('reference');
  });

  test('returns null when no data-type', () => {
    const el = document.createElement('span');
    expect(getTokenType(el)).toBeNull();
  });

  test('returns null for unknown data-type values', () => {
    const el = document.createElement('span');
    el.setAttribute('data-type', 'unknown-type');
    expect(getTokenType(el)).toBeNull();
  });

  test('returns correct type for all element types', () => {
    const types = ['reference', 'trigger', 'pinned', 'cursor-spot-before', 'cursor-spot-after', 'trailing-break'];
    for (const type of types) {
      const el = document.createElement('span');
      el.setAttribute('data-type', type);
      expect(getTokenType(el)).toBe(type);
    }
  });
});

describe('insertAfter', () => {
  test('inserts node after reference node with next sibling', () => {
    const parent = document.createElement('div');
    const first = document.createElement('span');
    const second = document.createElement('span');
    parent.appendChild(first);
    parent.appendChild(second);

    const newNode = document.createElement('em');
    insertAfter(newNode, first);

    expect(parent.childNodes[1]).toBe(newNode);
    expect(parent.childNodes[2]).toBe(second);
  });

  test('appends node when reference is last child', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);

    const newNode = document.createElement('em');
    insertAfter(newNode, child);

    expect(parent.lastChild).toBe(newNode);
  });

  test('does nothing when reference has no parent', () => {
    const orphan = document.createElement('span');
    const newNode = document.createElement('em');
    insertAfter(newNode, orphan);
    expect(newNode.parentNode).toBeNull();
  });
});

describe('createParagraph', () => {
  test('creates a paragraph element', () => {
    const p = createParagraph();
    expect(p.tagName).toBe('P');
  });
});

describe('createTrailingBreak', () => {
  test('creates a BR with trailing-break data-id', () => {
    const br = createTrailingBreak();
    expect(br.tagName).toBe('BR');
    expect(br.getAttribute('data-id')).toBe(ElementType.TrailingBreak);
  });
});

describe('findElement', () => {
  test('finds first matching element', () => {
    const container = document.createElement('div');
    const el = document.createElement('span');
    el.setAttribute('data-type', 'trigger');
    container.appendChild(el);

    expect(findElement(container, { tokenType: 'trigger' })).toBe(el);
  });

  test('returns null when no match', () => {
    const container = document.createElement('div');
    expect(findElement(container, { tokenType: 'trigger' })).toBeNull();
  });

  test('returns null when no options', () => {
    const container = document.createElement('div');
    expect(findElement(container, {})).toBeNull();
  });
});

describe('findAllParagraphs', () => {
  test('finds all paragraph elements', () => {
    const container = document.createElement('div');
    container.appendChild(document.createElement('p'));
    container.appendChild(document.createElement('p'));
    container.appendChild(document.createElement('span'));

    expect(findAllParagraphs(container)).toHaveLength(2);
  });

  test('returns empty array when no paragraphs', () => {
    const container = document.createElement('div');
    expect(findAllParagraphs(container)).toHaveLength(0);
  });
});

describe('isElementEffectivelyEmpty', () => {
  test('returns true for element with no children', () => {
    const el = document.createElement('p');
    expect(isElementEffectivelyEmpty(el)).toBe(true);
  });

  test('returns true for element with only whitespace text nodes', () => {
    const el = document.createElement('p');
    el.appendChild(document.createTextNode('   '));
    el.appendChild(document.createTextNode(''));
    expect(isElementEffectivelyEmpty(el)).toBe(true);
  });

  test('returns false for element with non-whitespace text', () => {
    const el = document.createElement('p');
    el.appendChild(document.createTextNode('hello'));
    expect(isElementEffectivelyEmpty(el)).toBe(false);
  });

  test('returns false for element with child elements', () => {
    const el = document.createElement('p');
    el.appendChild(document.createElement('span'));
    expect(isElementEffectivelyEmpty(el)).toBe(false);
  });

  test('returns true for element with only BR and whitespace text nodes', () => {
    const el = document.createElement('p');
    el.appendChild(document.createTextNode('   '));
    el.appendChild(document.createElement('br'));
    el.appendChild(document.createTextNode(''));
    expect(isElementEffectivelyEmpty(el)).toBe(true);
  });
});

describe('hasOnlyTrailingBR', () => {
  test('returns true for paragraph with only a BR child', () => {
    const p = document.createElement('p');
    p.appendChild(document.createElement('br'));
    expect(hasOnlyTrailingBR(p)).toBe(true);
  });

  test('returns false for paragraph with text', () => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('text'));
    expect(hasOnlyTrailingBR(p)).toBe(false);
  });

  test('returns false for paragraph with multiple children', () => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('text'));
    p.appendChild(document.createElement('br'));
    expect(hasOnlyTrailingBR(p)).toBe(false);
  });

  test('returns false for empty paragraph', () => {
    const p = document.createElement('p');
    expect(hasOnlyTrailingBR(p)).toBe(false);
  });
});

describe('isEmptyState', () => {
  test('returns true when no paragraphs', () => {
    const el = document.createElement('div');
    expect(isEmptyState(el)).toBe(true);
  });

  test('returns true when single paragraph with only trailing BR', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    p.appendChild(document.createElement('br'));
    el.appendChild(p);
    expect(isEmptyState(el)).toBe(true);
  });

  test('returns false when paragraph has text content', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello'));
    el.appendChild(p);
    expect(isEmptyState(el)).toBe(false);
  });

  test('returns false when multiple paragraphs exist', () => {
    const el = document.createElement('div');
    el.appendChild(document.createElement('p'));
    el.appendChild(document.createElement('p'));
    expect(isEmptyState(el)).toBe(false);
  });
});

describe('setEmptyState', () => {
  test('creates paragraph with trailing break when no paragraphs exist', () => {
    const el = document.createElement('div');
    setEmptyState(el);

    const paragraphs = el.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].childNodes).toHaveLength(1);
    expect(paragraphs[0].firstChild!.nodeName).toBe('BR');
  });

  test('clears content and creates single empty paragraph', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('some text'));
    p.appendChild(document.createElement('span'));
    el.appendChild(p);

    setEmptyState(el);

    expect(el.querySelectorAll('p')).toHaveLength(1);
    expect(el.querySelector('p')!.childNodes).toHaveLength(1);
    expect(el.querySelector('p')!.firstChild!.nodeName).toBe('BR');
  });

  test('leaves single paragraph with only trailing BR untouched', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    const br = document.createElement('br');
    p.appendChild(br);
    el.appendChild(p);

    setEmptyState(el);

    expect(el.querySelectorAll('p')).toHaveLength(1);
    expect(p.firstChild).toBe(br);
  });

  test('removes extra paragraphs and resets to single empty paragraph', () => {
    const el = document.createElement('div');
    const p1 = document.createElement('p');
    p1.appendChild(document.createTextNode('first'));
    const p2 = document.createElement('p');
    p2.appendChild(document.createTextNode('second'));
    const p3 = document.createElement('p');
    p3.appendChild(document.createTextNode('third'));
    el.appendChild(p1);
    el.appendChild(p2);
    el.appendChild(p3);

    setEmptyState(el);

    expect(el.querySelectorAll('p')).toHaveLength(1);
    expect(el.querySelector('p')!.childNodes).toHaveLength(1);
    expect(el.querySelector('p')!.firstChild!.nodeName).toBe('BR');
  });
});

describe('findAdjacentToken', () => {
  test('returns null sibling when text node is not at boundary', () => {
    const textNode = document.createTextNode('hello');
    const result = findAdjacentToken(textNode, 2, 'backward');
    expect(result.sibling).toBeNull();
    expect(result.isReferenceToken).toBe(false);
  });

  test('returns previous sibling at backward boundary of text node', () => {
    const p = document.createElement('p');
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    const text = document.createTextNode('hello');
    p.appendChild(ref);
    p.appendChild(text);

    const result = findAdjacentToken(text, 0, 'backward');
    expect(result.sibling).toBe(ref);
    expect(result.isReferenceToken).toBe(true);
  });

  test('returns next sibling at forward boundary of text node', () => {
    const p = document.createElement('p');
    const text = document.createTextNode('hello');
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    p.appendChild(text);
    p.appendChild(ref);

    const result = findAdjacentToken(text, 5, 'forward');
    expect(result.sibling).toBe(ref);
    expect(result.isReferenceToken).toBe(true);
  });

  test('returns child node for element container backward', () => {
    const p = document.createElement('p');
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    const text = document.createTextNode('hello');
    p.appendChild(ref);
    p.appendChild(text);

    const result = findAdjacentToken(p, 1, 'backward');
    expect(result.sibling).toBe(ref);
    expect(result.isReferenceToken).toBe(true);
  });

  test('returns child node for element container forward', () => {
    const p = document.createElement('p');
    const text = document.createTextNode('hello');
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    p.appendChild(text);
    p.appendChild(ref);

    const result = findAdjacentToken(p, 1, 'forward');
    expect(result.sibling).toBe(ref);
    expect(result.isReferenceToken).toBe(true);
  });

  test('returns non-reference sibling with isReferenceToken false', () => {
    const p = document.createElement('p');
    const span = document.createElement('span');
    const text = document.createTextNode('hello');
    p.appendChild(span);
    p.appendChild(text);

    const result = findAdjacentToken(text, 0, 'backward');
    expect(result.sibling).toBe(span);
    expect(result.isReferenceToken).toBe(false);
  });
});

describe('normalizeCaretIntoTrigger', () => {
  function createTrigger(id: string, text: string): HTMLElement {
    const span = document.createElement('span');
    span.setAttribute('data-type', ElementType.Trigger);
    span.id = id;
    span.textContent = text;
    return span;
  }

  test('does nothing when selection has no ranges', () => {
    const el = document.createElement('div');
    // No selection set — should not throw
    normalizeCaretIntoTrigger(el);
  });

  test('does nothing when range is not collapsed', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    const text = document.createTextNode('hello');
    p.appendChild(text);
    el.appendChild(p);
    document.body.appendChild(el);

    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 3);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    normalizeCaretIntoTrigger(el);
    // Range should remain unchanged
    expect(sel.getRangeAt(0).collapsed).toBe(false);
    document.body.removeChild(el);
  });

  test('nudges caret into trigger when at paragraph-level offset after trigger', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    const trigger = createTrigger('trig-1', '@');
    p.appendChild(trigger);
    el.appendChild(p);
    document.body.appendChild(el);

    const range = document.createRange();
    range.setStart(p, 1); // After the trigger element
    range.collapse(true);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    normalizeCaretIntoTrigger(el);

    const newRange = sel.getRangeAt(0);
    expect(newRange.startContainer).toBe(trigger.childNodes[0]);
    expect(newRange.startOffset).toBe(1); // After '@'
    document.body.removeChild(el);
  });

  test('does not nudge into cancelled trigger', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    const trigger = createTrigger('trig-1', '@');
    p.appendChild(trigger);
    el.appendChild(p);
    document.body.appendChild(el);

    const range = document.createRange();
    range.setStart(p, 1);
    range.collapse(true);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    normalizeCaretIntoTrigger(el, new Set(['trig-1']));

    const newRange = sel.getRangeAt(0);
    // Should remain at paragraph level, not nudged into trigger
    expect(newRange.startContainer).toBe(p);
    document.body.removeChild(el);
  });

  test('nudges caret from empty text node after trigger', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    const trigger = createTrigger('trig-1', '@');
    const emptyText = document.createTextNode('');
    p.appendChild(trigger);
    p.appendChild(emptyText);
    el.appendChild(p);
    document.body.appendChild(el);

    const range = document.createRange();
    range.setStart(emptyText, 0);
    range.collapse(true);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    normalizeCaretIntoTrigger(el);

    const newRange = sel.getRangeAt(0);
    expect(newRange.startContainer).toBe(trigger.childNodes[0]);
    document.body.removeChild(el);
  });

  test('does not nudge from non-empty text node after trigger', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    const trigger = createTrigger('trig-1', '@');
    const text = document.createTextNode('hello');
    p.appendChild(trigger);
    p.appendChild(text);
    el.appendChild(p);
    document.body.appendChild(el);

    const range = document.createRange();
    range.setStart(text, 0);
    range.collapse(true);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    normalizeCaretIntoTrigger(el);

    const newRange = sel.getRangeAt(0);
    // Should stay in the text node
    expect(newRange.startContainer).toBe(text);
    expect(newRange.startOffset).toBe(0);
    document.body.removeChild(el);
  });
});

describe('findElement with tokenId', () => {
  test('finds element by tokenId', () => {
    const container = document.createElement('div');
    const el = document.createElement('span');
    el.setAttribute('data-id', 'my-id');
    el.setAttribute('data-type', ElementType.Reference);
    container.appendChild(el);

    const found = findElement(container, { tokenId: 'my-id', tokenType: ElementType.Reference });
    expect(found).toBe(el);
  });

  test('returns null when no selector options provided', () => {
    const container = document.createElement('div');
    const found = findElement(container, {});
    expect(found).toBeNull();
  });
});

describe('normalizeCaretIntoTrigger - trigger offset 0 nudge', () => {
  function createTrigger(id: string, text: string): HTMLElement {
    const span = document.createElement('span');
    span.setAttribute('data-type', ElementType.Trigger);
    span.id = id;
    span.textContent = text;
    return span;
  }

  test('nudges caret from offset 0 inside trigger text to paragraph level before trigger', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    const textBefore = document.createTextNode('hello ');
    const trigger = createTrigger('trig-1', '@bob');
    p.appendChild(textBefore);
    p.appendChild(trigger);
    el.appendChild(p);
    document.body.appendChild(el);

    // Place caret at offset 0 inside the trigger's text node
    const triggerText = trigger.childNodes[0];
    const range = document.createRange();
    range.setStart(triggerText, 0);
    range.collapse(true);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    normalizeCaretIntoTrigger(el);

    const newRange = sel.getRangeAt(0);
    // Should be at paragraph level, before the trigger element
    expect(newRange.startContainer).toBe(p);
    expect(newRange.startOffset).toBe(1); // After textBefore, before trigger
    document.body.removeChild(el);
  });

  test('does not nudge when trigger is the first child (idx === 0)', () => {
    const el = document.createElement('div');
    const p = document.createElement('p');
    const trigger = createTrigger('trig-1', '@bob');
    p.appendChild(trigger);
    el.appendChild(p);
    document.body.appendChild(el);

    const triggerText = trigger.childNodes[0];
    const range = document.createRange();
    range.setStart(triggerText, 0);
    range.collapse(true);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    normalizeCaretIntoTrigger(el);

    // idx is 0, so no nudge — caret stays in trigger text
    const newRange = sel.getRangeAt(0);
    expect(newRange.startContainer).toBe(triggerText);
    document.body.removeChild(el);
  });
});

describe('scrollCaretIntoView', () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  test('does nothing when element is not scrollable', () => {
    const p = document.createElement('p');
    p.textContent = 'hello';
    el.appendChild(p);
    const scrollSpy = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;
    scrollCaretIntoView(el);
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  test('does nothing when no selection exists', () => {
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    window.getSelection()!.removeAllRanges();
    const scrollSpy = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;
    scrollCaretIntoView(el);
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  test('scrolls when caret is out of view', () => {
    const p = document.createElement('p');
    p.textContent = 'hello world';
    el.appendChild(p);
    el.focus();

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });

    const range = document.createRange();
    range.setStart(p.firstChild!, 5);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    const mockElementRect = { top: 0, bottom: 100, left: 0, right: 200 };
    const mockSpanRect = { top: 150, bottom: 160, left: 0, right: 10 };
    const origGetBCR = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      return this === el ? (mockElementRect as DOMRect) : (mockSpanRect as DOMRect);
    };
    const scrollSpy = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;

    scrollCaretIntoView(el);

    expect(scrollSpy).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
    // Text node should be merged back (not split) and caret should be valid
    expect(p.childNodes.length).toBe(1);
    expect(p.firstChild!.textContent).toBe('hello world');
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(p.firstChild);
    expect(sel.getRangeAt(0).startOffset).toBe(5);
    HTMLElement.prototype.getBoundingClientRect = origGetBCR;
  });

  test('does not scroll when caret is within view', () => {
    const p = document.createElement('p');
    p.textContent = 'hello';
    el.appendChild(p);
    el.focus();

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });

    const range = document.createRange();
    range.setStart(p.firstChild!, 3);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    const mockRect = { top: 10, bottom: 20, left: 10, right: 20 };
    const origGetBCR = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      return this === el ? ({ top: 0, bottom: 100, left: 0, right: 200 } as DOMRect) : (mockRect as DOMRect);
    };
    const scrollSpy = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;

    scrollCaretIntoView(el);

    expect(scrollSpy).not.toHaveBeenCalled();
    HTMLElement.prototype.getBoundingClientRect = origGetBCR;
  });

  test('removes temp span after measurement', () => {
    const p = document.createElement('p');
    p.textContent = 'hello';
    el.appendChild(p);
    el.focus();

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });

    const range = document.createRange();
    range.setStart(p.firstChild!, 3);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    scrollCaretIntoView(el);

    // No stray span elements should remain
    expect(el.querySelectorAll('span').length).toBe(0);
  });
});
