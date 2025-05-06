// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  getContainingBlock,
  isHTMLElement,
  isNode,
  isSVGElement,
  parseCssVariable,
} from '../../../../lib/components/internal/utils/dom';

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

describe('getContainingBlock', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    jest.restoreAllMocks();
  });

  test('returns null for element without styles', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ contain: '' } as CSSStyleDeclaration);
    expect(getContainingBlock(element)).toBe(null);
  });

  test('returns null for element with transform=none style', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ contain: '', transform: 'none' } as CSSStyleDeclaration);
    expect(getContainingBlock(element)).toBe(null);
  });

  test('returns containing block for element with custom transform style', () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ contain: '', transform: 'translate(0, 0)' } as CSSStyleDeclaration);
    expect(getContainingBlock(element)).not.toBe(null);
  });

  test('returns null for element with perspective=none style', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ contain: '', perspective: 'none' } as CSSStyleDeclaration);
    expect(getContainingBlock(element)).toBe(null);
  });

  test('returns containing block for element with custom perspective style', () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ contain: '', perspective: '100px' } as CSSStyleDeclaration);
    expect(getContainingBlock(element)).not.toBe(null);
  });

  test('returns null for element with containerType=normal style', () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ contain: '', containerType: 'normal' } as CSSStyleDeclaration);
    expect(getContainingBlock(element)).toBe(null);
  });

  test.each(['size', 'inline-size', 'scroll-state'])(
    'returns containing block for element with containerType=%s style',
    containerType => {
      jest.spyOn(window, 'getComputedStyle').mockReturnValue({ contain: '', containerType } as CSSStyleDeclaration);
      expect(getContainingBlock(element)).not.toBe(null);
    }
  );

  test('returns null for element with contain=none style', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ contain: 'none' } as CSSStyleDeclaration);
    expect(getContainingBlock(element)).toBe(null);
  });

  test.each(['layout', 'paint', 'strict', 'content'])('returns true for element with contain=%s style', contain => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ contain } as CSSStyleDeclaration);
    expect(getContainingBlock(element)).not.toBe(null);
  });
});
