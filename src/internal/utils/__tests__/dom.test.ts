// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement, isNode, isSVGElement, parseCssVariable } from '../../../../lib/components/internal/utils/dom';

describe('parseCssVariable', () => {
  [true, false].forEach(supports => {
    const testCssVariable = (testName: string, input: string, output: string) =>
      test(testName, () => expect(parseCssVariable(input)).toBe(supports ? input : output));

    describe(`with${supports ? '' : 'out'} CSS variable support`, () => {
      const originalCSS = window.CSS;

      beforeAll(() => {
        window.CSS.supports = () => supports;
      });

      afterAll(() => {
        window.CSS = originalCSS;
      });

      testCssVariable('returns the given value if no Custom Property is used', '#000000', '#000000');
      testCssVariable('parses variable with hex fallback', 'var(--mycolor, #1f1f1f)', '#1f1f1f');
      testCssVariable('parses variable with rgb fallback', 'var(--mycolor, rgba(0, 200,10))', 'rgba(0, 200,10)');
      testCssVariable('parses variable with named color fallback', 'var(--mycolor, green)', 'green');
      testCssVariable('parses nested variables', 'var(--mycolor,var(--other-color,#1f1f1f)  )', '#1f1f1f');
      testCssVariable(
        'parses more nested variables',
        'var(--mycolor, var(--other-color, rgba(0, 10, 200, 0.5)))',
        'rgba(0, 10, 200, 0.5)'
      );
      testCssVariable(
        'ignores white space',
        'var(  --mycolor   ,  var(  --other-color, rgba(0, 10, 200, 0.5))  )',
        'rgba(0, 10, 200, 0.5)'
      );
    });
  });
});

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
