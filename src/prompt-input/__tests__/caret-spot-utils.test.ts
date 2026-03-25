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

/** Creates a reference wrapper with caret spots and registers its portal container. */
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

  portalContainers.set(id, { id, element: container, label });

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
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);

    const result = extractTextFromCaretSpots(portalContainers, new Map(), false);
    expect(result.movedTextNode).toBeNull();
  });

  test('extracts typed text from cursor-spot-before and moves it before the wrapper', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);

    const beforeSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotBefore}"]`)!;
    beforeSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'hello';

    const result = extractTextFromCaretSpots(portalContainers, new Map(), false);

    expect(p.firstChild).not.toBe(ref);
    expect(p.firstChild!.textContent).toBe('hello');
    expect(beforeSpot.textContent).toBe(SPECIAL_CHARS.ZERO_WIDTH_CHARACTER);
    expect(result.movedTextNode).toBeNull();
  });

  test('extracts typed text from cursor-spot-after and moves it after the wrapper', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);

    const afterSpot = ref.querySelector(`[data-type="${ElementType.CaretSpotAfter}"]`)!;
    afterSpot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER + 'world';

    const result = extractTextFromCaretSpots(portalContainers, new Map(), false);

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

    const result = extractTextFromCaretSpots(portalContainers, new Map(), true);

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

    const result = extractTextFromCaretSpots(portalContainers, new Map(), false);
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

    extractTextFromCaretSpots(portalContainers, new Map(), false);

    expect(p1.lastChild!.textContent).toBe('text1');
    expect(p2.firstChild!.textContent).toBe('text2');
  });

  test('ignores cursor spots with only zero-width character content', () => {
    const portalContainers = new Map<string, PortalContainer>();
    const p = document.createElement('p');
    const ref = createReferenceWrapper('ref-1', 'Alice', portalContainers);
    p.appendChild(ref);
    el.appendChild(p);

    const childCountBefore = p.childNodes.length;
    extractTextFromCaretSpots(portalContainers, new Map(), false);
    expect(p.childNodes.length).toBe(childCountBefore);
  });

  test('handles empty maps', () => {
    const result = extractTextFromCaretSpots(new Map(), new Map(), false);
    expect(result.movedTextNode).toBeNull();
  });

  test('extracts filter text from cancelled triggers', () => {
    const p = document.createElement('p');
    const trigger = document.createElement('span');
    trigger.setAttribute('data-type', ElementType.Trigger);
    trigger.id = 'trigger-1-cancelled';
    trigger.textContent = '@hello';
    p.appendChild(trigger);
    el.appendChild(p);

    const triggerElements = new Map<string, HTMLElement>([['trigger-1-cancelled', trigger]]);

    const result = extractTextFromCaretSpots(new Map(), triggerElements, false);

    expect(trigger.textContent).toBe('@');
    expect(p.lastChild!.textContent).toBe('hello');
    expect(result.movedTextNode).toBeNull();
  });
});
