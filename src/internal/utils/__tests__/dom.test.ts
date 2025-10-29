// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findUpUntilMultiple, isHTMLElement, isNode, isSVGElement } from '../dom';

test('an HTMLElement is recognized as a Node and HTMLElement', () => {
  const div = document.createElement('div');
  expect(isNode(div)).toBe(true);
  expect(isHTMLElement(div)).toBe(true);
  expect(isSVGElement(div)).toBe(false);
});

test('an SVGElement is recognized as a Node and SVGElement', () => {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  expect(isNode(rect)).toBe(true);
  expect(isHTMLElement(rect)).toBe(false);
  expect(isSVGElement(rect)).toBe(true);
});

test('an object is recognized as Node', () => {
  expect(isNode({ nodeType: 3, nodeName: '', parentNode: {} })).toBe(true);
});

test('an object is recognized as HTMLElement', () => {
  const node = { nodeType: 1, nodeName: '', parentNode: {} };
  expect(isHTMLElement({ ...node, style: {}, ownerDocument: {} })).toBe(true);
  expect(isHTMLElement({ ...node, style: {}, ownerDocument: {}, ownerSVGElement: {} })).toBe(false);
});

test('an object is recognized as SVGElement', () => {
  const node = { nodeType: 1, nodeName: '', parentNode: {} };
  expect(isSVGElement({ ...node, style: {}, ownerDocument: {} })).toBe(false);
  expect(isSVGElement({ ...node, style: {}, ownerDocument: {}, ownerSVGElement: {} })).toBe(true);
});

describe('findUpUntilMultiple', () => {
  test('returns the expected element for each key', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div id="first" class="match">
        <div id="second" class="match"><div id="target"></div></div>
      </div>
    `;
    const targetElement = div.querySelector('#target') as HTMLElement;
    expect(
      findUpUntilMultiple({
        startElement: targetElement,
        tests: { first: node => node.id === 'first', second: node => node.id === 'second' },
      })
    ).toEqual({ first: expect.objectContaining({ id: 'first' }), second: expect.objectContaining({ id: 'second' }) });
  });

  test('skips non-HTMLElement parents', () => {
    const div = document.createElement('div');
    const testFn = (node: HTMLElement) => {
      expect(node.tagName).not.toBe('foreignObject');
      return !!node.className.match(/match/);
    };
    div.innerHTML = `
      <div class="match" id="match">
        <svg>
          <foreignObject>
            <div id="target"></div>
          </foreignObject>
        </svg>
      </div>
    `;
    const targetElement = div.querySelector('#target') as HTMLElement;
    expect(
      findUpUntilMultiple({
        startElement: targetElement,
        tests: { first: testFn, second: testFn },
      })
    ).toEqual({ first: expect.objectContaining({ id: 'match' }), second: expect.objectContaining({ id: 'match' }) });
  });
});
