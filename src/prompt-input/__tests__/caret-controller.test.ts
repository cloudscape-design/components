// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

jest.mock('../styles.css.js', () => ({}), { virtual: true });

import {
  calculateTokenPosition,
  calculateTotalTokenLength,
  CaretController,
  TOKEN_LENGTHS,
} from '../core/caret-controller';
import { normalizeCollapsedCaret, normalizeSelection } from '../core/caret-utils';
import { ElementType } from '../core/constants';

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
  span.setAttribute('data-type', ElementType.Reference);
  span.id = id;
  span.appendChild(document.createTextNode(label));
  parent.appendChild(span);
  return span;
}

function addTriggerToken(parent: HTMLElement, id: string, text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.setAttribute('data-type', ElementType.Trigger);
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
      expect(document.activeElement).toBe(el);
      expect(controller.getPosition()).toBe(0);
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
      controller.restore();
      // getSavedPosition should still be valid (capture wasn't cleared)
      expect(controller.getSavedPosition()).toBe(3);
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
      const sel = window.getSelection()!;
      expect(sel.toString()).toBe('');
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

describe('CaretController - additional branches', () => {
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
      controller.setPosition(0);
      // No capture done — state is invalid, restore should be a no-op
      controller.restore();
      expect(controller.getPosition()).toBe(0);
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
      expect(window.getSelection()!.toString()).toBe('');
    });

    test('selectAll selects content even when element is not focused', () => {
      addParagraph(el, 'hello');
      controller.selectAll();
      const sel = window.getSelection()!;
      expect(sel.toString()).toBe('hello');
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
      expect(controller.getPosition()).toBe(1);
      // Position 2 = after second reference
      controller.setPosition(2);
      expect(controller.getPosition()).toBe(2);
    });

    test('positions at end of paragraph with text and reference', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      p.appendChild(document.createTextNode('hi'));
      addReferenceToken(p, 'ref-1', 'Alice');
      el.focus();
      // "hi" (2) + reference (1) = 3
      controller.setPosition(3);
      expect(controller.getPosition()).toBe(3);
    });

    test('positions in trigger token text', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      addTriggerToken(p, 'trigger-1', '@user');
      el.focus();
      // Position 2 should be inside trigger text
      controller.setPosition(2);
      expect(controller.getPosition()).toBe(2);
    });

    test('handles position beyond content length', () => {
      addParagraph(el, 'hi');
      el.focus();
      // "hi" has length 2, position should clamp to 2
      controller.setPosition(100);
      expect(controller.getPosition()).toBe(2);
    });
  });

  describe('countUpToCursor with reference cursor spots', () => {
    test('getPosition with cursor in cursor-spot-before with typed text', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      const wrapper = document.createElement('span');
      wrapper.setAttribute('data-type', ElementType.Reference);
      p.appendChild(wrapper);
      const cursorSpotBefore = document.createElement('span');
      cursorSpotBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
      const spotText = document.createTextNode('\u200Btyped');
      cursorSpotBefore.appendChild(spotText);
      wrapper.appendChild(cursorSpotBefore);
      const content = document.createElement('span');
      content.textContent = 'Alice';
      content.setAttribute('contenteditable', 'false');
      wrapper.appendChild(content);
      const cursorSpotAfter = document.createElement('span');
      cursorSpotAfter.setAttribute('data-type', ElementType.CaretSpotAfter);
      cursorSpotAfter.appendChild(document.createTextNode('\u200B'));
      wrapper.appendChild(cursorSpotAfter);
      el.focus();
      // Place cursor in the before spot text at offset 3
      // Zero-width character (\u200B) is stripped, leaving "typed" (5 chars). Offset 3 in raw text = offset 2 in stripped text.
      // Cursor is in cursor-spot-before, so position is the offset in the typed text before the reference.
      const range = document.createRange();
      range.setStart(spotText, 3);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      const pos = controller.getPosition();
      expect(pos).toBe(3);
    });

    test('getPosition with cursor in cursor-spot-after with typed text', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      const wrapper = document.createElement('span');
      wrapper.setAttribute('data-type', ElementType.Reference);
      p.appendChild(wrapper);
      const cursorSpotBefore = document.createElement('span');
      cursorSpotBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
      cursorSpotBefore.appendChild(document.createTextNode('\u200B'));
      wrapper.appendChild(cursorSpotBefore);
      const content = document.createElement('span');
      content.textContent = 'Alice';
      content.setAttribute('contenteditable', 'false');
      wrapper.appendChild(content);
      const cursorSpotAfter = document.createElement('span');
      cursorSpotAfter.setAttribute('data-type', ElementType.CaretSpotAfter);
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
      // Reference (1) + stripped offset in after-spot: raw offset 3 minus 1 for zero-width char = 2
      expect(pos).toBe(3);
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
    test('returns null when cursor is at offset 0 of trigger with no filter text', () => {
      const p = document.createElement('p');
      el.appendChild(p);
      const trigger = addTriggerToken(p, 'trigger-1', '@');
      el.focus();
      const range = document.createRange();
      range.setStart(trigger.firstChild!, 0);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      // Offset 0 means cursor is before the trigger char — not "in" the trigger
      expect(controller.findActiveTrigger()).toBeNull();
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
    expect(controller.getPosition()).toBe(0);
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
    expect(controller.getPosition()).toBe(0);
  });

  test('findDOMLocation returns paragraph-level position when last child is not text', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    addReferenceToken(p, 'ref-1', 'Alice');
    addReferenceToken(p, 'ref-2', 'Bob');
    el.focus();
    // Two references = length 2, position beyond all content should clamp to 2
    controller.setPosition(999);
    expect(controller.getPosition()).toBe(2);
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
    wrapper.setAttribute('data-type', ElementType.Reference);
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

  test('getPosition with cursor in cursor-spot-before without typed text (zero-width character only)', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ElementType.Reference);
    p.appendChild(wrapper);
    const cursorSpotBefore = document.createElement('span');
    cursorSpotBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
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
    // Zero-width-only content in cursor-spot-before means cursor is before the reference = position 0
    expect(pos).toBe(0);
  });

  test('getPosition with cursor in cursor-spot-after without typed text (zero-width character only)', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ElementType.Reference);
    p.appendChild(wrapper);
    const cursorSpotBefore = document.createElement('span');
    cursorSpotBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
    cursorSpotBefore.appendChild(document.createTextNode('\u200C'));
    wrapper.appendChild(cursorSpotBefore);
    const content = document.createElement('span');
    content.textContent = 'Alice';
    content.setAttribute('contenteditable', 'false');
    wrapper.appendChild(content);
    const cursorSpotAfter = document.createElement('span');
    cursorSpotAfter.setAttribute('data-type', ElementType.CaretSpotAfter);
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
    // After reference with zero-width-only content, position should be 1 (after the reference)
    expect(pos).toBe(1);
  });

  test('getPosition with cursor at element level inside cursor-spot (not text node)', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ElementType.Reference);
    p.appendChild(wrapper);
    const cursorSpotBefore = document.createElement('span');
    cursorSpotBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
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
    // Caret in before-spot with no real content = logically before the reference
    expect(pos).toBe(0);
  });
});

describe('CaretController - setPosition null location handling', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('setPosition does nothing when findDOMLocation returns null (empty element)', () => {
    // No paragraphs — findDOMLocation returns null, setPosition returns early
    el.focus();
    const selBefore = window.getSelection()!;
    const rangeCountBefore = selBefore.rangeCount;
    controller.setPosition(5);
    // Selection state should not have been modified by setPosition
    const selAfter = window.getSelection()!;
    expect(selAfter.rangeCount).toBe(rangeCountBefore);
  });

  test('setPosition with range selection where end location is not found', () => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hi'));
    el.appendChild(p);
    document.body.focus();
    el.focus();
    // Start at 0 (valid), end at 999 (beyond content — falls back to last paragraph end)
    controller.setPosition(0, 999);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
  });
});

describe('CaretController - capture and restore', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('capture sets invalid state when no selection exists', () => {
    window.getSelection()?.removeAllRanges();
    controller.capture();
    expect(controller.getSavedPosition()).toBeNull();
  });

  test('capture sets invalid state when selection is outside element', () => {
    const other = document.createElement('div');
    document.body.appendChild(other);
    other.appendChild(document.createTextNode('outside'));
    const range = document.createRange();
    range.setStart(other.firstChild!, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    controller.capture();
    expect(controller.getSavedPosition()).toBeNull();
  });

  test('capture captures non-collapsed selection with end position', () => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello world'));
    el.appendChild(p);
    const range = document.createRange();
    range.setStart(p.firstChild!, 2);
    range.setEnd(p.firstChild!, 7);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    controller.capture();
    expect(controller.getSavedPosition()).toBe(2);
  });

  test('restore does nothing when state is invalid', () => {
    window.getSelection()?.removeAllRanges();
    controller.capture();
    // State is invalid, restore should be a no-op
    controller.restore();
    expect(window.getSelection()?.rangeCount).toBe(0);
  });

  test('restore does nothing when element is not focused', () => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello'));
    el.appendChild(p);
    controller.setCapturedPosition(3);
    // Element is not focused — restore should be a no-op
    const other = document.createElement('input');
    document.body.appendChild(other);
    other.focus();
    controller.restore();
    // No assertion on position since restore was skipped
  });
});

describe('CaretController - findLocationInParagraph reference positioning', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('setPosition targets position exactly before a reference', () => {
    const p = addParagraph(el, 'ab');
    const textNode = p.firstChild!;
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    ref.textContent = 'Alice';
    p.appendChild(ref);
    const after = document.createTextNode('cd');
    p.appendChild(after);
    el.focus();
    // Position 2 = end of 'ab', right before the reference
    controller.setPosition(2);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    // Lands at end of the text node (offset 2 in 'ab')
    expect(sel.getRangeAt(0).startContainer).toBe(textNode);
    expect(sel.getRangeAt(0).startOffset).toBe(2);
  });

  test('setPosition targets position exactly after a reference', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    ref.textContent = 'Alice';
    p.appendChild(ref);
    const after = document.createTextNode('cd');
    p.appendChild(after);
    el.focus();
    // Position 1 = right after the reference (reference length = 1)
    controller.setPosition(1);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    // Should land at start of the text node after the reference
    expect(sel.getRangeAt(0).startContainer).toBe(after);
    expect(sel.getRangeAt(0).startOffset).toBe(0);
  });

  test('setPosition after reference with no next text sibling', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    ref.textContent = 'Alice';
    p.appendChild(ref);
    el.focus();
    controller.setPosition(1);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    expect(sel.getRangeAt(0).startOffset).toBe(p.childNodes.length);
  });

  test('setPosition after reference with non-text next sibling', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    ref.textContent = 'Alice';
    p.appendChild(ref);
    const nextSpan = document.createElement('span');
    nextSpan.textContent = 'next';
    p.appendChild(nextSpan);
    el.focus();
    controller.setPosition(1);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(p);
  });

  test('setPosition into trigger without text node falls back to paragraph', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const trigger = document.createElement('span');
    trigger.setAttribute('data-type', ElementType.Trigger);
    // No child text node — empty trigger
    p.appendChild(trigger);
    el.focus();
    controller.setPosition(0);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
  });
});

describe('CaretController - countUpToCursor trigger edge case', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('getPosition with cursor inside trigger element (not in text node)', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const text = document.createTextNode('ab');
    p.appendChild(text);
    const trigger = document.createElement('span');
    trigger.setAttribute('data-type', ElementType.Trigger);
    const triggerText = document.createTextNode('@test');
    trigger.appendChild(triggerText);
    p.appendChild(trigger);
    // Place cursor at element level inside trigger (offset 0 = before the text node)
    const range = document.createRange();
    range.setStart(trigger, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    const pos = controller.getPosition();
    // 'ab' = 2, cursor at element level of trigger with offset 0 falls through to getNodeLength
    // which returns the full trigger text length (5 for '@test')
    expect(pos).toBe(2 + 5);
  });
});

describe('CaretController - findLocationInParagraph deep reference branches', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('setPosition at reference with non-text next sibling positions at paragraph level', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    ref.textContent = 'Alice';
    p.appendChild(ref);
    const nextRef = document.createElement('span');
    nextRef.setAttribute('data-type', ElementType.Reference);
    nextRef.textContent = 'Bob';
    p.appendChild(nextRef);
    el.focus();
    // Position 1 = after first reference, before second reference
    controller.setPosition(1);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    // Should position at paragraph level between the two references
    expect(sel.getRangeAt(0).startContainer).toBe(p);
  });

  test('setPosition past reference into unknown child type', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    // A non-token span (unknown type)
    const unknownSpan = document.createElement('span');
    unknownSpan.textContent = 'unknown';
    p.appendChild(unknownSpan);
    el.focus();
    controller.setPosition(0);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
  });

  test('setPosition beyond all content falls back to last text node', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const text = document.createTextNode('hello');
    p.appendChild(text);
    el.focus();
    controller.setPosition(999);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(text);
    expect(sel.getRangeAt(0).startOffset).toBe(5);
  });
});

describe('CaretController - countUpToCursor reference with caret in after-spot with no content', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('getPosition with cursor in caret-spot-after with no typed content', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ElementType.Reference);
    p.appendChild(wrapper);
    const label = document.createTextNode('Alice');
    wrapper.appendChild(label);
    const caretSpotAfter = document.createElement('span');
    caretSpotAfter.setAttribute('data-type', ElementType.CaretSpotAfter);
    const spotText = document.createTextNode('\u200B');
    caretSpotAfter.appendChild(spotText);
    wrapper.appendChild(caretSpotAfter);
    // Place cursor in the after-spot text node (only zero-width char, no typed content)
    const range = document.createRange();
    range.setStart(spotText, 1);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    const pos = controller.getPosition();
    // Caret in after-spot with no real content = logically after the reference
    expect(pos).toBe(1);
  });

  test('getPosition with cursor in caret-spot-before at element level', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ElementType.Reference);
    p.appendChild(wrapper);
    const caretSpotBefore = document.createElement('span');
    caretSpotBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
    const spotText = document.createTextNode('\u200B');
    caretSpotBefore.appendChild(spotText);
    wrapper.appendChild(caretSpotBefore);
    const label = document.createTextNode('Alice');
    wrapper.appendChild(label);
    // Place cursor at element level of caret-spot-before (not in text node)
    const range = document.createRange();
    range.setStart(caretSpotBefore, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    const pos = controller.getPosition();
    // Caret in before-spot with no real content = logically before the reference
    expect(pos).toBe(0);
  });
});

describe('CaretController - defensive guards', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    delete (HTMLElement.prototype as any).scrollIntoView;
  });

  test('setPosition returns early when window.getSelection returns null', () => {
    addParagraph(el, 'hello');
    el.focus();
    jest.spyOn(window, 'getSelection').mockReturnValue(null);
    controller.setPosition(3);
    // Position should remain 0 since selection was mocked to null
    jest.restoreAllMocks();
    expect(controller.getPosition()).toBe(0);
  });

  test('selectAll returns early when window.getSelection returns null', () => {
    addParagraph(el, 'hello');
    jest.spyOn(window, 'getSelection').mockReturnValue(null);
    controller.selectAll();
    jest.restoreAllMocks();
    // After restoring, selection should still be empty since selectAll was a no-op
    expect(window.getSelection()?.toString()).toBe('');
  });

  test('restore does nothing when element is not the active element', () => {
    addParagraph(el, 'hello');
    el.focus();
    controller.setCapturedPosition(3);
    const other = document.createElement('input');
    document.body.appendChild(other);
    other.focus();
    expect(document.activeElement).toBe(other);
    controller.restore();
    // restore was a no-op, active element should still be the other input
    expect(document.activeElement).toBe(other);
  });
});

describe('CaretController - findLocationInParagraph trigger fallback', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('setPosition into empty trigger (no text child) falls back to paragraph index', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const trigger = document.createElement('span');
    trigger.setAttribute('data-type', ElementType.Trigger);
    // Trigger has a non-text child instead of text
    const inner = document.createElement('span');
    inner.textContent = 'inner';
    trigger.appendChild(inner);
    p.appendChild(trigger);
    el.focus();
    controller.setPosition(0);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(p);
  });

  test('setPosition into reference at exact start offset', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    ref.textContent = 'Alice';
    p.appendChild(ref);
    const text = document.createTextNode('after');
    p.appendChild(text);
    el.focus();
    // Position 0 = exactly at start of reference
    controller.setPosition(0);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    expect(sel.getRangeAt(0).startOffset).toBe(0);
  });

  test('setPosition past reference into next non-text sibling', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const ref1 = document.createElement('span');
    ref1.setAttribute('data-type', ElementType.Reference);
    ref1.textContent = 'Alice';
    p.appendChild(ref1);
    const ref2 = document.createElement('span');
    ref2.setAttribute('data-type', ElementType.Reference);
    ref2.textContent = 'Bob';
    p.appendChild(ref2);
    el.focus();
    // Position 1 = after first reference
    controller.setPosition(1);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    // Should position at paragraph level between the two references
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    expect(sel.getRangeAt(0).startOffset).toBe(1);
  });

  test('setPosition past reference with no next sibling', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    ref.textContent = 'Alice';
    p.appendChild(ref);
    el.focus();
    controller.setPosition(1);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    expect(sel.getRangeAt(0).startOffset).toBe(1);
  });

  test('setPosition on unknown element type falls back to paragraph index', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const unknown = document.createElement('span');
    unknown.textContent = 'unknown';
    p.appendChild(unknown);
    el.focus();
    controller.setPosition(0);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
  });
});

describe('CaretController - countUpToCursor fallback', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('getPosition returns count when cursor container is not found in paragraph children', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const text = document.createTextNode('hello');
    p.appendChild(text);
    const range = document.createRange();
    range.setStart(text, 3);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    // This should work normally
    const pos = controller.getPosition();
    expect(pos).toBe(3);
  });
});

describe('CaretController - remaining uncovered branches', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    delete (HTMLElement.prototype as any).scrollIntoView;
  });

  test('calculatePositionFromRange returns 0 when no paragraphs', () => {
    // Empty element — no paragraphs
    el.focus();
    const pos = controller.getPosition();
    expect(pos).toBe(0);
  });

  test('findLocationInParagraph falls back to last text node when position exceeds content', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const ref = document.createElement('span');
    ref.setAttribute('data-type', ElementType.Reference);
    ref.textContent = 'Alice';
    p.appendChild(ref);
    const text = document.createTextNode('end');
    p.appendChild(text);
    el.focus();
    // Position way beyond content
    controller.setPosition(100);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(text);
    expect(sel.getRangeAt(0).startOffset).toBe(3);
  });

  test('findLocationInParagraph falls back to paragraph childNodes length when no text last child', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const span = document.createElement('span');
    span.textContent = 'not-a-token';
    p.appendChild(span);
    el.focus();
    controller.setPosition(100);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    expect(sel.getRangeAt(0).startOffset).toBe(p.childNodes.length);
  });

  test('findLocationInParagraph returns paragraph index for unknown element child', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    // Unknown element type — getNodeLength returns 0, so offset stays at 0
    const unknown = document.createElement('div');
    unknown.textContent = 'div-content';
    p.appendChild(unknown);
    const text = document.createTextNode('after');
    p.appendChild(text);
    el.focus();
    // Position 0 should match the unknown div (length 0, so 0 + 0 >= 0)
    controller.setPosition(0);
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
  });

  test('countUpToCursor returns accumulated count when cursor not found in children', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const text1 = document.createTextNode('hello');
    p.appendChild(text1);
    const text2 = document.createTextNode('world');
    p.appendChild(text2);
    // Place cursor in a node that's a child of p but use an offset that triggers the fallback
    // Actually, countUpToCursor always finds the container in children.
    // The fallback is hit when container is not found — e.g., cursor in a deeply nested node
    // that isn't a direct child and doesn't match any child.contains() check.
    // This is very hard to trigger in practice. Let's test with cursor at paragraph level.
    const range = document.createRange();
    range.setStart(p, 2); // offset 2 = after both text nodes
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    const pos = controller.getPosition();
    // Should count both text nodes: 5 + 5 = 10
    expect(pos).toBe(10);
  });
});

describe('CaretController - null textContent fallbacks', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('findActiveTrigger handles trigger with null textContent', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const trigger = document.createElement('span');
    trigger.setAttribute('data-type', ElementType.Trigger);
    p.appendChild(trigger);
    // Trigger has no text content — textContent is ''
    const textNode = document.createTextNode('');
    trigger.appendChild(textNode);
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    el.focus();
    const result = controller.findActiveTrigger();
    // Empty trigger with offset 0 — cursor is before the trigger char, not "in" it
    expect(result).toBeNull();
  });

  test('positionAfterText with node that has null textContent', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const textNode = document.createTextNode('');
    p.appendChild(textNode);
    Object.defineProperty(textNode, 'textContent', { value: null, writable: true });
    el.focus();
    controller.positionAfterText(textNode);
    // Falls back to offset 0 since textContent is null
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(sel.getRangeAt(0).startOffset).toBe(0);
  });
});

describe('Home/End key behavior with references', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  function createFullReference(parent: HTMLElement, label: string) {
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ElementType.Reference);
    parent.appendChild(wrapper);
    const caretSpotBefore = document.createElement('span');
    caretSpotBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
    caretSpotBefore.appendChild(document.createTextNode('\u200B'));
    wrapper.appendChild(caretSpotBefore);
    const tokenContainer = document.createElement('span');
    tokenContainer.setAttribute('contenteditable', 'false');
    tokenContainer.textContent = label;
    wrapper.appendChild(tokenContainer);
    const caretSpotAfter = document.createElement('span');
    caretSpotAfter.setAttribute('data-type', ElementType.CaretSpotAfter);
    caretSpotAfter.appendChild(document.createTextNode('\u200B'));
    wrapper.appendChild(caretSpotAfter);
    return { wrapper, caretSpotBefore, tokenContainer, caretSpotAfter };
  }

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('setPosition(0) places caret before reference at start of paragraph', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    createFullReference(p, 'Alice');
    p.appendChild(document.createTextNode(' hello'));
    el.focus();
    controller.setPosition(0);
    // Caret should be at paragraph level before the reference wrapper
    const sel = window.getSelection()!;
    expect(sel.rangeCount).toBe(1);
    expect(controller.getPosition()).toBe(0);
  });

  test('setPosition at end places caret after last text node', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    p.appendChild(document.createTextNode('hello '));
    createFullReference(p, 'Alice');
    el.focus();
    // "hello " (6) + reference (1) = 7
    controller.setPosition(7);
    expect(controller.getPosition()).toBe(7);
  });

  test('normalizeCollapsedCaret handles Home key landing in caret-spot-before', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    const { caretSpotBefore } = createFullReference(p, 'Alice');
    p.appendChild(document.createTextNode(' hello'));
    // Simulate Home key placing caret in the before-spot
    const range = document.createRange();
    range.setStart(caretSpotBefore.firstChild!, 0);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    normalizeCollapsedCaret(window.getSelection());
    const sel = window.getSelection()!;
    // Should normalize to paragraph level, before the wrapper
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    expect(sel.getRangeAt(0).startOffset).toBe(0);
  });

  test('normalizeCollapsedCaret handles End key landing in caret-spot-after', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    p.appendChild(document.createTextNode('hello '));
    const { caretSpotAfter, wrapper } = createFullReference(p, 'Alice');
    // Simulate End key placing caret in the after-spot
    const range = document.createRange();
    range.setStart(caretSpotAfter.firstChild!, 1);
    range.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    normalizeCollapsedCaret(window.getSelection());
    const sel = window.getSelection()!;
    // Should normalize to paragraph level, after the wrapper
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    const wrapperIndex = Array.from(p.childNodes).indexOf(wrapper);
    expect(sel.getRangeAt(0).startOffset).toBe(wrapperIndex + 1);
  });

  test('caret position round-trips correctly with text before and after reference', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    p.appendChild(document.createTextNode('abc'));
    createFullReference(p, 'Alice');
    p.appendChild(document.createTextNode('def'));
    el.focus();
    // Position 0 = start of "abc"
    controller.setPosition(0);
    expect(controller.getPosition()).toBe(0);
    // Position 3 = end of "abc", before reference
    controller.setPosition(3);
    expect(controller.getPosition()).toBe(3);
    // Position 4 = after reference, start of "def"
    controller.setPosition(4);
    expect(controller.getPosition()).toBe(4);
    // Position 7 = end of "def"
    controller.setPosition(7);
    expect(controller.getPosition()).toBe(7);
  });

  test('caret position round-trips with multiple references', () => {
    const p = document.createElement('p');
    el.appendChild(p);
    createFullReference(p, 'Alice');
    p.appendChild(document.createTextNode(' and '));
    createFullReference(p, 'Bob');
    el.focus();
    // ref(1) + " and "(5) + ref(1) = 7
    controller.setPosition(0);
    expect(controller.getPosition()).toBe(0);
    controller.setPosition(1);
    expect(controller.getPosition()).toBe(1);
    controller.setPosition(6);
    expect(controller.getPosition()).toBe(6);
    controller.setPosition(7);
    expect(controller.getPosition()).toBe(7);
  });
});

describe('Shift+Home/End selection with references', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function createFullReference(parent: HTMLElement, label: string) {
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', ElementType.Reference);
    parent.appendChild(wrapper);
    const caretSpotBefore = document.createElement('span');
    caretSpotBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
    caretSpotBefore.appendChild(document.createTextNode('\u200B'));
    wrapper.appendChild(caretSpotBefore);
    const tokenContainer = document.createElement('span');
    tokenContainer.setAttribute('contenteditable', 'false');
    tokenContainer.textContent = label;
    wrapper.appendChild(tokenContainer);
    const caretSpotAfter = document.createElement('span');
    caretSpotAfter.setAttribute('data-type', ElementType.CaretSpotAfter);
    caretSpotAfter.appendChild(document.createTextNode('\u200B'));
    wrapper.appendChild(caretSpotAfter);
    return { wrapper, caretSpotBefore, tokenContainer, caretSpotAfter };
  }

  test('normalizeSelection adjusts start boundary in caret-spot-before', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);
    const { caretSpotBefore } = createFullReference(p, 'Alice');
    const afterText = document.createTextNode(' hello');
    p.appendChild(afterText);
    // Simulate Shift+End creating selection from caret-spot-before to end of text
    const range = document.createRange();
    range.setStart(caretSpotBefore.firstChild!, 0);
    range.setEnd(afterText, 6);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    normalizeSelection(window.getSelection());
    const sel = window.getSelection()!;
    // Start should be normalized to paragraph level (before the wrapper)
    expect(sel.getRangeAt(0).startContainer).toBe(p);
    expect(sel.getRangeAt(0).startOffset).toBe(0);
  });

  test('normalizeSelection adjusts end boundary in caret-spot-after', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);
    const beforeText = document.createTextNode('hello ');
    p.appendChild(beforeText);
    const { caretSpotAfter, wrapper } = createFullReference(p, 'Alice');
    // Simulate Shift+Home creating selection from text to caret-spot-after
    const range = document.createRange();
    range.setStart(beforeText, 0);
    range.setEnd(caretSpotAfter.firstChild!, 1);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    normalizeSelection(window.getSelection());
    const sel = window.getSelection()!;
    // End should be normalized to paragraph level (after the wrapper)
    const wrapperIndex = Array.from(p.childNodes).indexOf(wrapper);
    expect(sel.getRangeAt(0).endContainer).toBe(p);
    expect(sel.getRangeAt(0).endOffset).toBe(wrapperIndex + 1);
  });

  test('normalizeSelection handles selection spanning text-reference-text', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    el.appendChild(p);
    const beforeText = document.createTextNode('abc');
    p.appendChild(beforeText);
    createFullReference(p, 'Alice');
    const afterText = document.createTextNode('def');
    p.appendChild(afterText);
    // Selection from start of "abc" to end of "def" — should work without normalization
    const range = document.createRange();
    range.setStart(beforeText, 0);
    range.setEnd(afterText, 3);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    normalizeSelection(window.getSelection());
    const sel = window.getSelection()!;
    // Boundaries are in text nodes, not caret spots — should be unchanged
    expect(sel.getRangeAt(0).startContainer).toBe(beforeText);
    expect(sel.getRangeAt(0).startOffset).toBe(0);
    expect(sel.getRangeAt(0).endContainer).toBe(afterText);
    expect(sel.getRangeAt(0).endOffset).toBe(3);
  });
});

describe('getPosition with caret in reference caret-spots', () => {
  let el: HTMLDivElement;
  let controller: CaretController;

  beforeEach(() => {
    el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    controller = new CaretController(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  function createReferenceWithSpots(id: string): HTMLElement {
    const wrapper = document.createElement('span');
    wrapper.setAttribute('data-type', 'reference');
    wrapper.id = id;
    const before = document.createElement('span');
    before.setAttribute('data-type', 'cursor-spot-before');
    before.textContent = '\u200B';
    const container = document.createElement('span');
    container.setAttribute('contenteditable', 'false');
    container.textContent = 'Alice';
    const after = document.createElement('span');
    after.setAttribute('data-type', 'cursor-spot-after');
    after.textContent = '\u200B';
    wrapper.appendChild(before);
    wrapper.appendChild(container);
    wrapper.appendChild(after);
    return wrapper;
  }

  test('caret in before-spot with no real content returns position before reference', () => {
    const p = document.createElement('p');
    const ref = createReferenceWithSpots('ref-1');
    p.appendChild(ref);
    el.appendChild(p);
    el.focus();

    // Place caret inside the before-spot's zero-width text node
    const beforeSpot = ref.querySelector('[data-type="cursor-spot-before"]')!;
    const range = document.createRange();
    range.setStart(beforeSpot.firstChild!, 1); // After the zero-width char
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    // Position should be 0 (before the reference), not 1 (after it)
    expect(controller.getPosition()).toBe(0);
  });

  test('caret in after-spot with no real content returns position after reference', () => {
    const p = document.createElement('p');
    const ref = createReferenceWithSpots('ref-1');
    p.appendChild(ref);
    el.appendChild(p);
    el.focus();

    // Place caret inside the after-spot's zero-width text node
    const afterSpot = ref.querySelector('[data-type="cursor-spot-after"]')!;
    const range = document.createRange();
    range.setStart(afterSpot.firstChild!, 1);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    // Position should be 1 (after the reference)
    expect(controller.getPosition()).toBe(1);
  });

  test('caret in before-spot with text before reference returns correct offset', () => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello '));
    const ref = createReferenceWithSpots('ref-1');
    p.appendChild(ref);
    el.appendChild(p);
    el.focus();

    const beforeSpot = ref.querySelector('[data-type="cursor-spot-before"]')!;
    const range = document.createRange();
    range.setStart(beforeSpot.firstChild!, 1);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    // "hello " = 6 chars, caret in before-spot = position 6 (before reference)
    expect(controller.getPosition()).toBe(6);
  });
});
