// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  findUpUntil,
  parseCssVariable,
  nodeContains,
  containsOrEqual,
} from '../../../../lib/components/internal/utils/dom';

describe('findUpUntil', () => {
  test('returns null if there is no match', () => {
    const div = document.createElement('div');
    expect(findUpUntil(div, () => false)).toBeNull();
  });

  test('returns the first match if there are multiple', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div id="first" class="match">
        <div id="second" class="match"><div id="target"></div></div>
      </div>
    `;
    expect(findUpUntil(div.querySelector<HTMLElement>('#target')!, node => node.className === 'match')).toEqual(
      expect.objectContaining({ id: 'second' })
    );
  });

  test('returns the input node if it matches the criteria', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="match">
        <div class="match" id="target"></div>
      </div>
    `;
    expect(findUpUntil(div.querySelector<HTMLElement>('#target')!, node => node.className === 'match')).toEqual(
      expect.objectContaining({ id: 'target' })
    );
  });

  test('skips non-HTMLElement parents', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="match" id="match">
        <svg>
          <foreignObject>
            <div id="target"></div>
          </foreignObject>
        </svg>
      </div>
    `;
    expect(
      findUpUntil(div.querySelector<HTMLElement>('#target')!, node => {
        expect(node.tagName).not.toBe('foreignObject');
        return !!node.className.match(/match/);
      })
    ).toEqual(expect.objectContaining({ id: 'match' }));
  });
});

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

describe('nodeContains', () => {
  test('returns false if either node is null', () => {
    const div = document.createElement('div');
    expect(nodeContains(div, null)).toBe(false);
    expect(nodeContains(null, div)).toBe(false);
    expect(nodeContains(null, null)).toBe(false);
  });

  const testCases: Record<string, string> = {
    regular: `<div id="parent">
                <div id="inbetween">
                  <div id="child"></div>
                </div>
              </div>
`,
    svg: `<g id="parent">
            <g id="inbetween">
              <g id="child"></g>
            </g>
          </g>
`,
    mixed: `<div id="parent">
              <svg id="inbetween">
                <g id="child"></g>
              </svg>
            </div>
`,
  };

  [false, true].forEach(nativeContains => {
    describe(`with${!nativeContains ? 'out' : ''} native .contains method`, () => {
      let oldContains: Element['contains'];

      // The utility can use two possible algorithms: native .contains or a fallback approach using loops.
      // In order to cover both use cases in the tests, we need to temporarily remove the contains function.
      beforeAll(() => {
        if (!nativeContains) {
          oldContains = window.Element.prototype.contains;
          (window.Element.prototype.contains as any) = undefined;
        }
      });
      afterAll(() => {
        if (!nativeContains) {
          window.Element.prototype.contains = oldContains;
        }
      });

      Object.keys(testCases).forEach(title => {
        test(`finds ${title} nested nodes`, () => {
          const div = document.createElement('div');
          /* eslint-disable-next-line no-unsanitized/property */
          div.innerHTML = testCases[title];

          const parent = div.querySelector('#parent');
          const inbetween = div.querySelector('#inbetween');
          const child = div.querySelector('#child');

          expect(nodeContains(parent, child)).toBe(true);
          expect(nodeContains(parent, inbetween)).toBe(true);
          expect(nodeContains(inbetween, child)).toBe(true);
          expect(nodeContains(child, parent)).toBe(false);
          expect(nodeContains(child, inbetween)).toBe(false);
        });
      });
    });
  });
});

describe('containsOrEqual', () => {
  test('returns "true", when the node and the container are the same element', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div id="container1"></div>
    `;
    expect(containsOrEqual(div.querySelector('#container1'), div.querySelector('#container1') as Node)).toBe(true);
  });
  test('returns "true", when the node is descendant from the container', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div id="container1">
        <div id="node"></div>
      </div>
    `;
    expect(containsOrEqual(div.querySelector('#container1'), div.querySelector('#node') as Node)).toBe(true);
  });
  test('returns "false", when the node is not a child of the container', () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div id="container1"></div>
      <div id="node"></div>
    `;
    expect(containsOrEqual(div.querySelector('#container1'), div.querySelector('#node') as Node)).toBe(false);
  });
});
