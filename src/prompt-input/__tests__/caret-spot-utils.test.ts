// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

jest.mock('../styles.css.js', () => ({}), { virtual: true });

import { extractTextFromCaretSpots } from '../core/caret-spot-utils';
import { ElementType, SPECIAL_CHARS } from '../core/constants';

let el: HTMLDivElement;

beforeEach(() => {
  el = document.createElement('div');
  el.setAttribute('contenteditable', 'true');
  document.body.appendChild(el);
});

afterEach(() => {
  document.body.removeChild(el);
});

function createReferenceWrapper(id: string, label: string): HTMLSpanElement {
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
  test('returns null movedTextNode when no cursor spots have typed text', () => {
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(ref);
    el.appendChild(p);

    const result = extractTextFromCaretSpots([p]);
    expect(result.movedTextNode).toBeNull();
  });

  test('extracts typed text from cursor-spot-before and moves it before the wrapper', () => {
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(ref);
    el.appendChild(p);

    // Simulate user typing "hello" into the before cursor spot
    const beforeSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotBefore}"]`)!;
    beforeSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'hello';

    const result = extractTextFromCaretSpots([p]);

    // Text should be moved before the wrapper at paragraph level
    expect(p.firstChild).not.toBe(ref);
    expect(p.firstChild!.textContent).toBe('hello');
    // Cursor spot should be reset to zero-width character
    expect(beforeSpot.textContent).toBe(SPECIAL_CHARS.ZERO_WIDTH_CHARACTER);
    // movedTextNode should be null since cursor wasn't tracked in the spot
    expect(result.movedTextNode).toBeNull();
  });

  test('extracts typed text from cursor-spot-after and moves it after the wrapper', () => {
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(ref);
    el.appendChild(p);

    // Simulate user typing "world" into the after cursor spot
    const afterSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'world';

    const result = extractTextFromCaretSpots([p]);

    // Text should be moved after the wrapper at paragraph level
    expect(p.lastChild!.textContent).toBe('world');
    // Cursor spot should be reset
    expect(afterSpot.textContent).toBe(SPECIAL_CHARS.ZERO_WIDTH_CHARACTER);
    expect(result.movedTextNode).toBeNull();
  });

  test('tracks cursor when text is extracted and cursor is in the spot', () => {
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(ref);
    el.appendChild(p);

    const afterSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'typed';

    // Place cursor inside the after spot
    setCursor(afterSpot.firstChild!, 3);

    const result = extractTextFromCaretSpots([p], true);

    expect(result.movedTextNode).not.toBeNull();
    expect(result.movedTextNode!.textContent).toBe('typed');
  });

  test('does not track cursor when trackCursor is false', () => {
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(ref);
    el.appendChild(p);

    const afterSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'typed';

    setCursor(afterSpot.firstChild!, 3);

    const result = extractTextFromCaretSpots([p], false);
    expect(result.movedTextNode).toBeNull();
  });

  test('handles multiple paragraphs with cursor spots', () => {
    const p1 = document.createElement('p');
    const ref1 = createReferenceWrapper('ref-1', 'Alice');
    p1.appendChild(ref1);
    el.appendChild(p1);

    const p2 = document.createElement('p');
    const ref2 = createReferenceWrapper('ref-2', 'Bob');
    p2.appendChild(ref2);
    el.appendChild(p2);

    // Type in both spots
    const afterSpot1 = ref1.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot1.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'text1';

    const beforeSpot2 = ref2.querySelector(`[data-type="${ElementType.CaretSpotBefore}"]`)!;
    beforeSpot2.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'text2';

    extractTextFromCaretSpots([p1, p2]);

    expect(p1.lastChild!.textContent).toBe('text1');
    expect(p2.firstChild!.textContent).toBe('text2');
  });

  test('ignores cursor spots with only zero-width character content', () => {
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice');
    p.appendChild(ref);
    el.appendChild(p);

    // Spots only have zero-width characters — nothing to extract
    const childCountBefore = p.childNodes.length;
    extractTextFromCaretSpots([p]);
    expect(p.childNodes.length).toBe(childCountBefore);
  });

  test('handles empty paragraphs array', () => {
    const result = extractTextFromCaretSpots([]);
    expect(result.movedTextNode).toBeNull();
  });

  test('handles cursor spot with no parent wrapper', () => {
    const p = document.createElement('p');
    // Orphan cursor spot directly in paragraph (edge case)
    const spot = document.createElement('span');
    spot.setAttribute('data-type', ElementType.CaretSpotBefore);
    spot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'orphan';
    p.appendChild(spot);
    el.appendChild(p);

    // Should not throw and the text should be extracted
    const result = extractTextFromCaretSpots([p]);
    expect(result.movedTextNode).toBeNull();
  });
});
