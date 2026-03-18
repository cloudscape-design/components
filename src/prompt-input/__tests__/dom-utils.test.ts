// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Mock styles.css.js since it's a build artifact not available in unit tests
jest.mock('../styles.css.js', () => ({ paragraph: 'paragraph' }), { virtual: true });

import { ELEMENT_TYPES } from '../core/constants';
import {
  createParagraph,
  createTrailingBreak,
  findAllParagraphs,
  findElement,
  findElements,
  getTokenType,
  hasOnlyTrailingBR,
  insertAfter,
  isElementEffectivelyEmpty,
  isEmptyState,
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
    expect(br.getAttribute('data-id')).toBe(ELEMENT_TYPES.TRAILING_BREAK);
  });
});

describe('findElements', () => {
  test('finds elements by tokenType', () => {
    const container = document.createElement('div');
    const ref1 = document.createElement('span');
    ref1.setAttribute('data-type', 'reference');
    const ref2 = document.createElement('span');
    ref2.setAttribute('data-type', 'reference');
    const other = document.createElement('span');
    other.setAttribute('data-type', 'text');
    container.appendChild(ref1);
    container.appendChild(ref2);
    container.appendChild(other);

    const results = findElements(container, { tokenType: 'reference' });
    expect(results).toHaveLength(2);
  });

  test('finds elements by array of tokenTypes', () => {
    const container = document.createElement('div');
    const refEl = document.createElement('span');
    refEl.setAttribute('data-type', 'reference');
    const pinned = document.createElement('span');
    pinned.setAttribute('data-type', 'pinned');
    container.appendChild(refEl);
    container.appendChild(pinned);

    const results = findElements(container, { tokenType: ['reference', 'pinned'] });
    expect(results).toHaveLength(2);
  });

  test('returns empty array when no options provided', () => {
    const container = document.createElement('div');
    expect(findElements(container, {})).toEqual([]);
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

describe('findElements with tokenId', () => {
  test('finds element by data-id for non-trigger types', () => {
    const container = document.createElement('div');
    const el = document.createElement('span');
    el.setAttribute('data-type', 'reference');
    el.setAttribute('data-id', 'ref-123');
    container.appendChild(el);

    const results = findElements(container, { tokenType: 'reference', tokenId: 'ref-123' });
    expect(results).toHaveLength(1);
    expect(results[0]).toBe(el);
  });

  test('finds trigger element by data-id attribute', () => {
    const container = document.createElement('div');
    const el = document.createElement('span');
    el.setAttribute('data-type', ELEMENT_TYPES.TRIGGER);
    el.setAttribute('data-id', 'trigger-123');
    container.appendChild(el);

    const results = findElements(container, { tokenType: ELEMENT_TYPES.TRIGGER, tokenId: 'trigger-123' });
    expect(results).toHaveLength(1);
    expect(results[0]).toBe(el);
  });
});
