// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

jest.mock('../styles.css.js', () => ({}), { virtual: true });

import { extractTextFromCaretSpots } from '../core/caret-spot-utils';
import { ElementType, SPECIAL_CHARS } from '../core/constants';
import { PortalContainer } from '../core/token-renderer';

let el: HTMLDivElement;

beforeEach(() => {
  el = document.createElement('div');
  el.setAttribute('contenteditable', 'true');
  document.body.appendChild(el);
});

afterEach(() => {
  document.body.removeChild(el);
});

function createReferenceWrapper(
  id: string,
  label: string,
  portalContainers: Map<string, PortalContainer>
): HTMLSpanElement {
  const wrapper = document.createElement('span');
  wrapper.setAttribute('data-type', ElementType.Reference);
  wrapper.id = id;

  const before = document.createElement('span');
  before.setAttribute('data-type', ElementType.CaretSpotBefore);
  before.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER;

  const container = document.createElement('span');
  container.textContent = label;
  container.setAttribute('contenteditable', 'false');

  const after = document.createElement('span');
  after.setAttribute('data-type', ElementType.CaretSpotAfter);
  after.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER;

  wrapper.appendChild(before);
  wrapper.appendChild(container);
  wrapper.appendChild(after);

  portalContainers.set(id, { id, element: container, label, value: '', menuId: '' });

  return wrapper;
}

function setCursor(node: Node, offset: number): void {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  const sel = window.getSelection()!;
  sel.removeAllRanges();
  sel.addRange(range);
}

describe('extractTextFromCaretSpots', () => {
  test('returns null movedTextNode when no caret spots have typed text', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);
    const result = extractTextFromCaretSpots(portalContainers, false);
    expect(result.movedTextNode).toBeNull();
  });

  test('extracts typed text from caret-spot-before and moves it before the wrapper', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);
    const beforeSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotBefore}"]`)!;
    beforeSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'hello';
    const result = extractTextFromCaretSpots(portalContainers, false);
    expect(p.firstChild).not.toBe(ref);
    expect(p.firstChild!.textContent).toBe('hello');
    expect(beforeSpot.textContent).toBe(SPECIAL_CHARS.ZERO_WIDTH_CHARACTER);
    expect(result.movedTextNode).toBeNull();
  });

  test('extracts typed text from caret-spot-after and moves it after the wrapper', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);
    const afterSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'world';
    const result = extractTextFromCaretSpots(portalContainers, false);
    expect(p.lastChild!.textContent).toBe('world');
    expect(afterSpot.textContent).toBe(SPECIAL_CHARS.ZERO_WIDTH_CHARACTER);
    expect(result.movedTextNode).toBeNull();
  });

  test('tracks cursor when text is extracted and cursor is in the spot', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);
    const afterSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'typed';
    setCursor(afterSpot.firstChild!, 3);
    const result = extractTextFromCaretSpots(portalContainers, true);
    expect(result.movedTextNode).not.toBeNull();
    expect(result.movedTextNode!.textContent).toBe('typed');
  });

  test('does not track cursor when trackCaret is false', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);
    const afterSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'typed';
    setCursor(afterSpot.firstChild!, 3);
    const result = extractTextFromCaretSpots(portalContainers, false);
    expect(result.movedTextNode).toBeNull();
  });

  test('handles multiple references across paragraphs', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p1 = document.createElement('p');
    const ref1 = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p1.appendChild(ref1);
    el.appendChild(p1);
    const p2 = document.createElement('p');
    const ref2 = createReferenceWrapper('ref-2', 'Bob', portalContainers);
    p2.appendChild(ref2);
    el.appendChild(p2);
    const afterSpot1 = ref1.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot1.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'text1';
    const beforeSpot2 = ref2.querySelector(`[data-type="${ElementType.CaretSpotBefore}"]`)!;
    beforeSpot2.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'text2';
    extractTextFromCaretSpots(portalContainers, false);
    expect(p1.lastChild!.textContent).toBe('text1');
    expect(p2.firstChild!.textContent).toBe('text2');
  });

  test('ignores caret spots with only zero-width character content', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);
    const childCountBefore = p.childNodes.length;
    extractTextFromCaretSpots(portalContainers, false);
    expect(p.childNodes.length).toBe(childCountBefore);
  });

  test('handles empty map', () => {
    const result = extractTextFromCaretSpots(new Map(), false);
    expect(result.movedTextNode).toBeNull();
  });

  test('tracks cursor in caret-spot-before when trackCaret is true', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);
    const beforeSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotBefore}"]`)!;
    beforeSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'typed';
    setCursor(beforeSpot.firstChild!, 3);
    const result = extractTextFromCaretSpots(portalContainers, true);
    expect(result.movedTextNode).not.toBeNull();
    expect(result.movedTextNode!.textContent).toBe('typed');
    expect(p.firstChild!.textContent).toBe('typed');
  });

  test('skips portal container when wrapper has no parentElement', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const orphanContainer = document.createElement('span');
    orphanContainer.textContent = 'orphan';
    portalContainers.set('orphan-1', {
      id: 'orphan-1',
      element: orphanContainer,
      label: 'orphan',
      value: '',
      menuId: '',
    });
    const result = extractTextFromCaretSpots(portalContainers, false);
    expect(result.movedTextNode).toBeNull();
  });
});
