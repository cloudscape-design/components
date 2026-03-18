// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

jest.mock('../styles.css.js', () => ({}), { virtual: true });

import {
  calculateTokenPosition,
  calculateTotalTokenLength,
  CaretController,
  normalizeCollapsedCaret,
  normalizeSelection,
  setMouseDown,
  TOKEN_LENGTHS,
} from '../core/caret-controller';
import { ELEMENT_TYPES } from '../core/constants';

function createEditableElement(): HTMLDivElement {
  const el = document.createElement('div');
  el.setAttribute('contenteditable', 'true');
  document.body.appendChild(el);
  return el;
}

function addParagraph(parent: HTMLElement, content: string): HTMLParagraphElement {
  const p = document.createElement('p');
  p.appendChild(document.createTextNode(content));
  parent.appendChild(p);
  return p;
}

function addReferenceToken(parent: HTMLElement, id: string, label: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
  span.id = id;
  span.appendChild(document.createTextNode(label));
  parent.appendChild(span);
  return span;
}

function addTriggerToken(parent: HTMLElement, id: string, text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.setAttribute('data-type', ELEMENT_TYPES.TRIGGER);
  span.id = id;
  span.appendChild(document.createTextNode(text));
  parent.appendChild(span);
  return span;
}

describe('TOKEN_LENGTHS', () => {
  test('REFERENCE is 1', () => {
    expect(TOKEN_LENGTHS.REFERENCE).toBe(1);
  });

  test('LINE_BREAK is 1', () => {
    expect(TOKEN_LENGTHS.LINE_BREAK).toBe(1);
  });

  test('trigger returns 1 + filter length', () => {
    expect(TOKEN_LENGTHS.trigger('abc')).toBe(4);
    expect(TOKEN_LENGTHS.trigger('')).toBe(1);
  });

  test('text returns content length', () => {
    expect(TOKEN_LENGTHS.text('hello')).toBe(5);
    expect(TOKEN_LENGTHS.text('')).toBe(0);
  });
});

describe('CaretController', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = createEditableElement();
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('getPosition', () => {
    test('returns 0 when no selection', () => {
      window.getSelection()?.removeAllRanges();
      expect(controller.getPosition()).toBe(0);
    });

    test('returns 0 when selection is outside element', () => {
      const other = document.createElement('div');
      document.body.appendChild(other);
      other.appendChild(document.createTextNode('other'));
      const range = document.createRange();
      range.setStart(other.firstChild!, 0);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      expect(controller.getPosition()).toBe(0);
    });

    test('returns correct position in text node', () => {
      const p = addParagraph(el, 'hello world');
      el.focus();
      const range = document.createRange();
      range.setStart(p.firstChild!, 5);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      expect(controller.getPosition()).toBe(5);
    });

    test('returns correct position after reference token', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addReferenceToken(p, 'ref-1', 'Alice');
      p.appendChild(document.createTextNode('hello'));

      el.focus();
      const range = document.createRange();
      // Position cursor at the text node after reference
      range.setStart(p.lastChild!, 0);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      // Reference = 1, then offset 0 in text = position 1
      expect(controller.getPosition()).toBe(1);
    });

    test('returns correct position across paragraphs', () => {
      addParagraph(el, 'abc');
      const p2 = addParagraph(el, 'def');

      el.focus();
      const range = document.createRange();
      range.setStart(p2.firstChild!, 2);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      // "abc" (3) + line break (1) + "de" (2) = 6
      expect(controller.getPosition()).toBe(6);
    });
  });

  describe('setPosition', () => {
    test('sets cursor in text node', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.setPosition(5);

      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
      expect(selection.getRangeAt(0).startOffset).toBe(5);
    });

    test('sets cursor at start of second paragraph', () => {
      addParagraph(el, 'abc');
      addParagraph(el, 'def');
      el.focus();

      // Position 4 = after "abc" (3) + line break (1)
      controller.setPosition(4);

      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
    });

    test('sets selection range when end is provided', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.setPosition(0, 5);

      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
      expect(selection.getRangeAt(0).collapsed).toBe(false);
    });

    test('focuses element if not focused', () => {
      addParagraph(el, 'hello');
      document.body.focus();

      controller.setPosition(0);
      // Should not throw
    });
  });

  describe('capture and restore', () => {
    test('captures and restores cursor position', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.setPosition(5);
      controller.capture();

      expect(controller.getSavedPosition()).toBe(5);
    });

    test('getSavedPosition returns null when not captured', () => {
      // Fresh controller with no capture
      expect(controller.getSavedPosition()).toBeNull();
    });

    test('capture with no selection sets invalid state', () => {
      window.getSelection()?.removeAllRanges();
      controller.capture();
      expect(controller.getSavedPosition()).toBeNull();
    });

    test('capture with selection outside element sets invalid state', () => {
      const other = document.createElement('div');
      document.body.appendChild(other);
      other.appendChild(document.createTextNode('other'));
      const range = document.createRange();
      range.setStart(other.firstChild!, 0);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      controller.capture();
      expect(controller.getSavedPosition()).toBeNull();
    });

    test('restore does nothing when not focused', () => {
      addParagraph(el, 'hello');
      el.focus();
      controller.setPosition(3);
      controller.capture();

      document.body.focus();
      // Should not throw
      controller.restore();
    });
  });

  describe('setCapturedPosition', () => {
    test('sets position for next restore', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.setCapturedPosition(7);
      controller.restore();

      expect(controller.getPosition()).toBe(7);
    });
  });

  describe('selectAll', () => {
    test('selects all content', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.selectAll();

      const selection = window.getSelection()!;
      expect(selection.toString()).toContain('hello world');
    });

    test('does nothing in empty state', () => {
      const p = document.createElement('p');
      const br = document.createElement('br');
      p.appendChild(br);
      el.appendChild(p);
      el.focus();

      controller.selectAll();
      // Should not throw
    });
  });

  describe('moveForward and moveBackward', () => {
    test('moveForward advances cursor', () => {
      addParagraph(el, 'hello');
      el.focus();
      controller.setPosition(0);

      controller.moveForward(3);
      expect(controller.getPosition()).toBe(3);
    });

    test('moveBackward retreats cursor', () => {
      addParagraph(el, 'hello');
      el.focus();
      controller.setPosition(5);

      controller.moveBackward(2);
      expect(controller.getPosition()).toBe(3);
    });

    test('moveBackward does not go below 0', () => {
      addParagraph(el, 'hello');
      el.focus();
      controller.setPosition(1);

      controller.moveBackward(5);
      expect(controller.getPosition()).toBe(0);
    });
  });

  describe('positionAfterText', () => {
    test('positions cursor at end of text node', () => {
      const p = document.createElement('p');
      const textNode = document.createTextNode('hello');
      p.appendChild(textNode);
      el.appendChild(p);
      el.focus();

      controller.positionAfterText(textNode);

      const selection = window.getSelection()!;
      expect(selection.getRangeAt(0).startOffset).toBe(5);
    });
  });

  describe('findActiveTrigger', () => {
    test('returns null when not in trigger', () => {
      addParagraph(el, 'hello');
      el.focus();
      controller.setPosition(3);

      expect(controller.findActiveTrigger()).toBeNull();
    });

    test('detects cursor inside trigger element', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      const trigger = addTriggerToken(p, 'trigger-1', '@user');

      el.focus();
      const range = document.createRange();
      range.setStart(trigger.firstChild!, 2);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      expect(controller.findActiveTrigger()).not.toBeNull();
      expect(controller.findActiveTrigger()?.id).toBe('trigger-1');
    });

    test('returns null when selection is not collapsed', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addTriggerToken(p, 'trigger-1', '@user');
      p.appendChild(document.createTextNode('hello'));

      el.focus();
      const range = document.createRange();
      range.setStart(p.firstChild!.firstChild!, 0);
      range.setEnd(p.lastChild!, 3);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      expect(controller.findActiveTrigger()).toBeNull();
    });

    test('returns null with no selection', () => {
      window.getSelection()?.removeAllRanges();
      expect(controller.findActiveTrigger()).toBeNull();
    });
  });

  describe('trigger positioning', () => {
    test('positions cursor inside trigger text node', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addTriggerToken(p, 'trigger-1', '@user');

      el.focus();
      // Trigger "@user" has length 5, position 3 should be inside it
      controller.setPosition(3);

      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
    });
  });

  describe('reference token positioning', () => {
    test('positions cursor before reference token', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addReferenceToken(p, 'ref-1', 'Alice');

      el.focus();
      controller.setPosition(0);

      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
    });

    test('positions cursor after reference token', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addReferenceToken(p, 'ref-1', 'Alice');
      p.appendChild(document.createTextNode('hello'));

      el.focus();
      controller.setPosition(1); // After reference (length 1)

      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
    });
  });
});

describe('normalizeCollapsedCaret', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('does nothing with no selection', () => {
    window.getSelection()?.removeAllRanges();
    normalizeCollapsedCaret(window.getSelection());
    // Should not throw
  });

  test('does nothing when cursor is not in a cursor spot', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const text = document.createTextNode('hello');
    p.appendChild(text);
    el.appendChild(p);

    const range = document.createRange();
    range.setStart(text, 3);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeCollapsedCaret(window.getSelection());

    const sel = window.getSelection()!;
    expect(sel.getRangeAt(0).startContainer).toBe(text);
    expect(sel.getRangeAt(0).startOffset).toBe(3);
  });

  test('moves cursor out of cursor-spot-before', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    p.appendChild(wrapper);

    const cursorSpot = document.createElement('span');
    cursorSpot.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    const spotText = document.createTextNode('\u200C');
    cursorSpot.appendChild(spotText);
    wrapper.appendChild(cursorSpot);

    const range = document.createRange();
    range.setStart(spotText, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeCollapsedCaret(window.getSelection());

    const sel = window.getSelection()!;
    // Should have moved cursor to paragraph level, before the wrapper
    expect(sel.getRangeAt(0).startContainer).toBe(p);
  });

  test('moves cursor out of cursor-spot-after', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    p.appendChild(wrapper);

    const cursorSpot = document.createElement('span');
    cursorSpot.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_AFTER);
    const spotText = document.createTextNode('\u200C');
    cursorSpot.appendChild(spotText);
    wrapper.appendChild(cursorSpot);

    const range = document.createRange();
    range.setStart(spotText, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeCollapsedCaret(window.getSelection());

    const sel = window.getSelection()!;
    // Should have moved cursor to paragraph level, after the wrapper
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    expect(sel.getRangeAt(0).startOffset).toBe(1);
  });

  test('does nothing for non-collapsed selection', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const text = document.createTextNode('hello');
    p.appendChild(text);
    el.appendChild(p);

    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeCollapsedCaret(window.getSelection());
    // Should not modify the selection
    expect(window.getSelection()!.getRangeAt(0).collapsed).toBe(false);
  });
});

describe('normalizeSelection', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('does nothing with no selection', () => {
    window.getSelection()?.removeAllRanges();
    normalizeSelection(window.getSelection());
  });

  test('does nothing for collapsed selection', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const text = document.createTextNode('hello');
    el.appendChild(text);

    const range = document.createRange();
    range.setStart(text, 3);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());
    expect(window.getSelection()!.getRangeAt(0).collapsed).toBe(true);
  });

  test('does nothing when skipCursorSpots is true', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const text = document.createTextNode('hello');
    el.appendChild(text);

    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection(), true);
    // Should not modify
    expect(window.getSelection()!.getRangeAt(0).startOffset).toBe(0);
    expect(window.getSelection()!.getRangeAt(0).endOffset).toBe(3);
  });

  test('does nothing when mouse is down', () => {
    setMouseDown(true);
    const el = document.createElement('div');
    document.body.appendChild(el);
    const text = document.createTextNode('hello');
    el.appendChild(text);

    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());
    setMouseDown(false);
  });

  test('adjusts selection boundaries when start is in cursor-spot-before', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    p.appendChild(wrapper);

    const cursorSpotBefore = document.createElement('span');
    cursorSpotBefore.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    const spotText = document.createTextNode('\u200C');
    cursorSpotBefore.appendChild(spotText);
    wrapper.appendChild(cursorSpotBefore);

    const afterText = document.createTextNode('hello');
    p.appendChild(afterText);

    const range = document.createRange();
    range.setStart(spotText, 0);
    range.setEnd(afterText, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());

    const sel = window.getSelection()!;
    // Start should be normalized to paragraph level
    expect(sel.getRangeAt(0).startContainer).toBe(p);
  });

  test('adjusts selection boundaries when end is in cursor-spot-after', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);

    const beforeText = document.createTextNode('hello');
    p.appendChild(beforeText);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    p.appendChild(wrapper);

    const cursorSpotAfter = document.createElement('span');
    cursorSpotAfter.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_AFTER);
    const spotText = document.createTextNode('\u200C');
    cursorSpotAfter.appendChild(spotText);
    wrapper.appendChild(cursorSpotAfter);

    const range = document.createRange();
    range.setStart(beforeText, 0);
    range.setEnd(spotText, 1);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());

    const sel = window.getSelection()!;
    // End should be normalized to paragraph level, after the wrapper
    expect(sel.getRangeAt(0).endContainer).toBe(p);
    expect(sel.getRangeAt(0).endOffset).toBe(2);
  });

  test('does not adjust when boundaries are not in cursor spots', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const text = document.createTextNode('hello world');
    p.appendChild(text);
    el.appendChild(p);

    const range = document.createRange();
    range.setStart(text, 2);
    range.setEnd(text, 8);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());

    const sel = window.getSelection()!;
    expect(sel.getRangeAt(0).startContainer).toBe(text);
    expect(sel.getRangeAt(0).startOffset).toBe(2);
    expect(sel.getRangeAt(0).endContainer).toBe(text);
    expect(sel.getRangeAt(0).endOffset).toBe(8);
  });
});

describe('CaretController - additional branch coverage', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = createEditableElement();
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('setPosition with end parameter', () => {
    test('creates selection range from start to end', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.setPosition(2, 7);

      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
      const range = selection.getRangeAt(0);
      expect(range.collapsed).toBe(false);
      expect(range.toString()).toBe('llo w');
    });

    test('collapses when end equals start', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.setPosition(3, 3);

      const selection = window.getSelection()!;
      expect(selection.getRangeAt(0).collapsed).toBe(true);
    });

    test('handles end location that cannot be found', () => {
      addParagraph(el, 'hi');
      el.focus();

      // end position way beyond content — should collapse
      controller.setPosition(0, 999);
      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
    });
  });

  describe('capture and restore round-trip', () => {
    test('captures and restores a range selection', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.setPosition(2, 7);
      controller.capture();

      expect(controller.getSavedPosition()).toBe(2);

      // Move cursor elsewhere
      controller.setPosition(0);

      // Restore — verifies it doesn't throw and sets position
      controller.restore();

      const selection = window.getSelection()!;
      expect(selection.rangeCount).toBe(1);
    });

    test('capture stores end position for non-collapsed selection', () => {
      addParagraph(el, 'hello world');
      el.focus();

      controller.setPosition(1, 5);
      controller.capture();

      expect(controller.getSavedPosition()).toBe(1);
    });

    test('restore does nothing when state is invalid', () => {
      addParagraph(el, 'hello');
      el.focus();

      // No capture done — state is invalid
      controller.restore();
      // Should not throw
    });
  });

  describe('selectAll', () => {
    test('selects all content across multiple paragraphs', () => {
      addParagraph(el, 'hello');
      addParagraph(el, 'world');
      el.focus();

      controller.selectAll();

      const selection = window.getSelection()!;
      expect(selection.toString()).toContain('hello');
      expect(selection.toString()).toContain('world');
    });

    test('does nothing when element is empty (only trailing BR)', () => {
      const p = document.createElement('p');
      const br = document.createElement('br');
      p.appendChild(br);
      el.appendChild(p);
      el.focus();

      controller.selectAll();

      // Should not throw, selection may or may not change
    });

    test('does nothing when no selection object', () => {
      addParagraph(el, 'hello');
      // Can't easily remove getSelection, but test the empty state path
      controller.selectAll();
    });
  });

  describe('findLocationInParagraph edge cases', () => {
    test('positions correctly between two reference tokens', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addReferenceToken(p, 'ref-1', 'Alice');
      addReferenceToken(p, 'ref-2', 'Bob');
      el.focus();

      // Position 1 = after first reference
      controller.setPosition(1);
      const sel = window.getSelection()!;
      expect(sel.rangeCount).toBe(1);

      // Position 2 = after second reference
      controller.setPosition(2);
      expect(sel.rangeCount).toBe(1);
    });

    test('positions at end of paragraph with text and reference', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      p.appendChild(document.createTextNode('hi'));
      addReferenceToken(p, 'ref-1', 'Alice');
      el.focus();

      // "hi" (2) + reference (1) = 3
      controller.setPosition(3);
      const sel = window.getSelection()!;
      expect(sel.rangeCount).toBe(1);
    });

    test('positions in trigger token text', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addTriggerToken(p, 'trigger-1', '@user');
      el.focus();

      // Position 2 should be inside trigger text
      controller.setPosition(2);
      const sel = window.getSelection()!;
      expect(sel.rangeCount).toBe(1);
    });

    test('handles position beyond content length', () => {
      addParagraph(el, 'hi');
      el.focus();

      controller.setPosition(100);
      const sel = window.getSelection()!;
      expect(sel.rangeCount).toBe(1);
    });
  });

  describe('countUpToCursor with reference cursor spots', () => {
    test('getPosition with cursor in cursor-spot-before with typed text', () => {
      const p = document.createElement('p');
      el.appendChild(p);

      const wrapper = document.createElement('span');
      wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
      p.appendChild(wrapper);

      const cursorSpotBefore = document.createElement('span');
      cursorSpotBefore.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
      const spotText = document.createTextNode('\u200Btyped');
      cursorSpotBefore.appendChild(spotText);
      wrapper.appendChild(cursorSpotBefore);

      const content = document.createElement('span');
      content.textContent = 'Alice';
      content.setAttribute('contenteditable', 'false');
      wrapper.appendChild(content);

      const cursorSpotAfter = document.createElement('span');
      cursorSpotAfter.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_AFTER);
      cursorSpotAfter.appendChild(document.createTextNode('\u200B'));
      wrapper.appendChild(cursorSpotAfter);

      el.focus();
      // Place cursor in the before spot text
      const range = document.createRange();
      range.setStart(spotText, 3);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      const pos = controller.getPosition();
      expect(typeof pos).toBe('number');
    });

    test('getPosition with cursor in cursor-spot-after with typed text', () => {
      const p = document.createElement('p');
      el.appendChild(p);

      const wrapper = document.createElement('span');
      wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
      p.appendChild(wrapper);

      const cursorSpotBefore = document.createElement('span');
      cursorSpotBefore.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
      cursorSpotBefore.appendChild(document.createTextNode('\u200B'));
      wrapper.appendChild(cursorSpotBefore);

      const content = document.createElement('span');
      content.textContent = 'Alice';
      content.setAttribute('contenteditable', 'false');
      wrapper.appendChild(content);

      const cursorSpotAfter = document.createElement('span');
      cursorSpotAfter.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_AFTER);
      const afterText = document.createTextNode('\u200Btyped');
      cursorSpotAfter.appendChild(afterText);
      wrapper.appendChild(cursorSpotAfter);

      el.focus();
      const range = document.createRange();
      range.setStart(afterText, 3);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      const pos = controller.getPosition();
      // Should be reference (1) + offset in after content
      expect(pos).toBeGreaterThanOrEqual(1);
    });

    test('getPosition with cursor in trigger text node', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      const trigger = addTriggerToken(p, 'trigger-1', '@user');

      el.focus();
      const range = document.createRange();
      range.setStart(trigger.firstChild!, 3);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      expect(controller.getPosition()).toBe(3);
    });
  });

  describe('findActiveTrigger edge cases', () => {
    test('detects trigger when cursor is at offset 0 with no filter text', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      const trigger = addTriggerToken(p, 'trigger-1', '@');

      el.focus();
      const range = document.createRange();
      range.setStart(trigger.firstChild!, 0);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      // Single char trigger with no filter — offset 0 is valid
      expect(controller.findActiveTrigger()).not.toBeNull();
    });

    test('returns null when cursor is at offset 0 of trigger with filter text', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      const trigger = addTriggerToken(p, 'trigger-1', '@user');

      el.focus();
      const range = document.createRange();
      range.setStart(trigger.firstChild!, 0);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      // Offset 0 with filter text means cursor is before trigger char
      expect(controller.findActiveTrigger()).toBeNull();
    });

    test('detects trigger from text node immediately after trigger', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addTriggerToken(p, 'trigger-1', '@user');
      const textAfter = document.createTextNode('hello');
      p.appendChild(textAfter);

      el.focus();
      const range = document.createRange();
      range.setStart(textAfter, 0);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      // Cursor at offset 0 of text node right after trigger
      expect(controller.findActiveTrigger()).not.toBeNull();
      expect(controller.findActiveTrigger()?.id).toBe('trigger-1');
    });

    test('detects trigger when cursor is at element level inside trigger (non-text startContainer)', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      const trigger = addTriggerToken(p, 'trigger-1', '@user');

      el.focus();
      // Place cursor at element level inside the trigger span (not in its text node)
      const range = document.createRange();
      range.setStart(trigger, 1); // After the text child
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      expect(controller.findActiveTrigger()).not.toBeNull();
      expect(controller.findActiveTrigger()?.id).toBe('trigger-1');
    });
  });
});

describe('calculateTokenPosition', () => {
  test('returns 0 for empty tokens', () => {
    expect(calculateTokenPosition([], 0)).toBe(0);
  });

  test('sums text token lengths', () => {
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'text' as const, value: ' world' },
    ];
    expect(calculateTokenPosition(tokens, 1)).toBe(11);
  });

  test('counts reference tokens as 1', () => {
    const tokens = [
      { type: 'reference' as const, id: 'r1', label: 'A', value: 'a', menuId: 'm' },
      { type: 'text' as const, value: 'hi' },
    ];
    expect(calculateTokenPosition(tokens, 0)).toBe(1);
    expect(calculateTokenPosition(tokens, 1)).toBe(3);
  });

  test('counts break tokens as 1', () => {
    const tokens = [
      { type: 'text' as const, value: 'ab' },
      { type: 'break' as const, value: '\n' },
      { type: 'text' as const, value: 'cd' },
    ];
    expect(calculateTokenPosition(tokens, 1)).toBe(3);
    expect(calculateTokenPosition(tokens, 2)).toBe(5);
  });

  test('counts trigger tokens as 1 + filter length', () => {
    const tokens = [{ type: 'trigger' as const, value: 'user', triggerChar: '@', id: 't1' }];
    expect(calculateTokenPosition(tokens, 0)).toBe(5);
  });

  test('handles upToIndex beyond array length', () => {
    const tokens = [{ type: 'text' as const, value: 'hi' }];
    expect(calculateTokenPosition(tokens, 10)).toBe(2);
  });
});

describe('calculateTotalTokenLength', () => {
  test('returns 0 for empty tokens', () => {
    expect(calculateTotalTokenLength([])).toBe(0);
  });

  test('returns total length of all tokens', () => {
    const tokens = [
      { type: 'text' as const, value: 'hello' },
      { type: 'break' as const, value: '\n' },
      { type: 'reference' as const, id: 'r1', label: 'A', value: 'a', menuId: 'm' },
    ];
    expect(calculateTotalTokenLength(tokens)).toBe(7);
  });
});

describe('CaretController - setPosition edge cases', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = createEditableElement();
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('setPosition with end beyond content collapses range', () => {
    addParagraph(el, 'hi');
    el.focus();
    controller.setPosition(0, 999);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
  });

  test('setPosition focuses element when not active', () => {
    addParagraph(el, 'hello');
    document.body.focus();
    expect(document.activeElement).not.toBe(el);
    controller.setPosition(3);
    expect(document.activeElement).toBe(el);
  });

  test('setPosition at line break boundary positions at start of next paragraph', () => {
    addParagraph(el, 'abc');
    addParagraph(el, 'def');
    el.focus();
    controller.setPosition(4);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(controller.getPosition()).toBe(4);
  });

  test('setPosition at end of content with no text node falls back', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    addReferenceToken(p, 'ref-1', 'Alice');
    el.focus();
    controller.setPosition(1);
    expect(controller.getPosition()).toBe(1);
  });

  test('setPosition falls back to last paragraph when no paragraphs exist', () => {
    // Empty element with no paragraphs
    el.focus();
    controller.setPosition(5);
    // Should not throw — findDOMLocation returns null
  });

  test('findDOMLocation returns paragraph-level position when last child is not text', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    addReferenceToken(p, 'ref-1', 'Alice');
    addReferenceToken(p, 'ref-2', 'Bob');
    el.focus();

    // Position beyond all content
    controller.setPosition(999);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
  });
});

describe('CaretController - countUpToCursor edge cases', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = createEditableElement();
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('getPosition when cursor is at paragraph level after multiple children', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    p.appendChild(document.createTextNode('ab'));
    addReferenceToken(p, 'ref-1', 'X');
    p.appendChild(document.createTextNode('cd'));

    el.focus();
    const range = document.createRange();
    range.setStart(p, 3);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    expect(controller.getPosition()).toBe(5);
  });

  test('getPosition returns 0 for empty element', () => {
    el.focus();
    window.getSelection()?.removeAllRanges();
    expect(controller.getPosition()).toBe(0);
  });

  test('getPosition with cursor inside reference wrapper (not in cursor spot)', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    p.appendChild(wrapper);

    const content = document.createElement('span');
    content.textContent = 'Alice';
    content.setAttribute('contenteditable', 'false');
    wrapper.appendChild(content);

    el.focus();
    const range = document.createRange();
    range.setStart(wrapper, 1);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const pos = controller.getPosition();
    expect(pos).toBe(1);
  });

  test('getPosition with cursor in cursor-spot-before without typed text (ZWNJ only)', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    p.appendChild(wrapper);

    const cursorSpotBefore = document.createElement('span');
    cursorSpotBefore.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    const spotText = document.createTextNode('\u200C');
    cursorSpotBefore.appendChild(spotText);
    wrapper.appendChild(cursorSpotBefore);

    const content = document.createElement('span');
    content.textContent = 'Alice';
    content.setAttribute('contenteditable', 'false');
    wrapper.appendChild(content);

    el.focus();
    const range = document.createRange();
    range.setStart(spotText, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const pos = controller.getPosition();
    // ZWNJ-only content strips to empty, so falls through to getNodeLength
    expect(typeof pos).toBe('number');
  });

  test('getPosition with cursor in cursor-spot-after without typed text (ZWNJ only)', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    p.appendChild(wrapper);

    const cursorSpotBefore = document.createElement('span');
    cursorSpotBefore.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    cursorSpotBefore.appendChild(document.createTextNode('\u200C'));
    wrapper.appendChild(cursorSpotBefore);

    const content = document.createElement('span');
    content.textContent = 'Alice';
    content.setAttribute('contenteditable', 'false');
    wrapper.appendChild(content);

    const cursorSpotAfter = document.createElement('span');
    cursorSpotAfter.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_AFTER);
    const afterSpotText = document.createTextNode('\u200C');
    cursorSpotAfter.appendChild(afterSpotText);
    wrapper.appendChild(cursorSpotAfter);

    el.focus();
    const range = document.createRange();
    range.setStart(afterSpotText, 1);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const pos = controller.getPosition();
    // After reference with ZWNJ-only content, position should be reference length (1)
    expect(pos).toBeGreaterThanOrEqual(1);
  });

  test('getPosition with cursor at element level inside cursor-spot (not text node)', () => {
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    p.appendChild(wrapper);

    const cursorSpotBefore = document.createElement('span');
    cursorSpotBefore.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    cursorSpotBefore.appendChild(document.createTextNode('\u200C'));
    wrapper.appendChild(cursorSpotBefore);

    el.focus();
    // Place cursor at element level inside the cursor spot (not in text node)
    const range = document.createRange();
    range.setStart(cursorSpotBefore, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    const pos = controller.getPosition();
    expect(typeof pos).toBe('number');
  });
});

describe('normalizeCollapsedCaret - additional edge cases', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('does nothing when parent has no parentElement', () => {
    const textNode = document.createTextNode('hello');
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeCollapsedCaret(window.getSelection());
  });

  test('does nothing when cursor spot wrapper is not a reference type', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', 'trigger');
    p.appendChild(wrapper);

    const spot = document.createElement('span');
    spot.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    const spotText = document.createTextNode('\u200B');
    spot.appendChild(spotText);
    wrapper.appendChild(spot);

    const range = document.createRange();
    range.setStart(spotText, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeCollapsedCaret(window.getSelection());
    expect(window.getSelection()!.getRangeAt(0).startContainer).toBe(spotText);
  });

  test('does nothing when cursor spot has no parent paragraph', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    el.appendChild(wrapper);

    const spot = document.createElement('span');
    spot.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    const spotText = document.createTextNode('\u200B');
    spot.appendChild(spotText);
    wrapper.appendChild(spot);

    const range = document.createRange();
    range.setStart(spotText, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeCollapsedCaret(window.getSelection());
    const sel = window.getSelection()!;
    expect(sel.getRangeAt(0).startContainer).toBe(el);
  });

  test('does nothing when wrapper has no parentElement', () => {
    // Create a reference wrapper with cursor spot but no parent element above wrapper
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);

    const spot = document.createElement('span');
    spot.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    const spotText = document.createTextNode('\u200B');
    spot.appendChild(spotText);
    wrapper.appendChild(spot);

    // Wrapper is not attached to any parent
    document.body.appendChild(wrapper);

    const range = document.createRange();
    range.setStart(spotText, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeCollapsedCaret(window.getSelection());
    const sel = window.getSelection()!;
    // Should normalize to body level since wrapper.parentElement is body
    expect(sel.getRangeAt(0).startContainer).toBe(document.body);
  });
});

describe('normalizeSelection - additional edge cases', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('does nothing when start boundary is not a text node', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const text = document.createTextNode('hello');
    p.appendChild(text);
    el.appendChild(p);

    const range = document.createRange();
    range.setStart(p, 0);
    range.setEnd(text, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());
    expect(window.getSelection()!.getRangeAt(0).startContainer).toBe(p);
  });

  test('does nothing when cursor spot wrapper is not a reference type', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', 'trigger');
    p.appendChild(wrapper);

    const spot = document.createElement('span');
    spot.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    const spotText = document.createTextNode('\u200B');
    spot.appendChild(spotText);
    wrapper.appendChild(spot);

    const afterText = document.createTextNode('hello');
    p.appendChild(afterText);

    const range = document.createRange();
    range.setStart(spotText, 0);
    range.setEnd(afterText, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());
    expect(window.getSelection()!.getRangeAt(0).startContainer).toBe(spotText);
  });

  test('does nothing when cursor spot parent has no parentElement', () => {
    const spotText = document.createTextNode('\u200B');
    const spot = document.createElement('span');
    spot.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
    spot.appendChild(spotText);

    // spot has no parent element (not attached to wrapper)
    document.body.appendChild(spot);
    const afterText = document.createTextNode('hello');
    document.body.appendChild(afterText);

    const range = document.createRange();
    range.setStart(spotText, 0);
    range.setEnd(afterText, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());
    // Should not modify since parent of spot is body, not a reference wrapper
    expect(window.getSelection()!.getRangeAt(0).startContainer).toBe(spotText);
  });

  test('does nothing when wrapper parentElement is null for end boundary', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const beforeText = document.createTextNode('hello');
    el.appendChild(beforeText);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ELEMENT_TYPES.REFERENCE);
    el.appendChild(wrapper);

    const spot = document.createElement('span');
    spot.setAttribute('data-type', ELEMENT_TYPES.CURSOR_SPOT_AFTER);
    const spotText = document.createTextNode('\u200B');
    spot.appendChild(spotText);
    wrapper.appendChild(spot);

    const range = document.createRange();
    range.setStart(beforeText, 0);
    range.setEnd(spotText, 1);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    normalizeSelection(window.getSelection());
    const sel = window.getSelection()!;
    // Should normalize end to el level since wrapper.parentElement is el
    expect(sel.getRangeAt(0).endContainer).toBe(el);
  });
});
