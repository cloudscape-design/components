// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import stylelint from 'stylelint';
import { configBasedir } from './common.js';

// This is for prettier format: https://github.com/prettier/prettier/issues/2330
// String.raw is an identity function in this context
const css = String.raw;

function runPlugin(code) {
  return stylelint.lint({
    code,
    configBasedir,
    config: {
      plugins: ['../no-motion-outside-of-mixin.js'],
      rules: {
        '@cloudscape-design/no-motion-outside-of-mixin': [true],
      },
    },
  });
}

describe('No motion outside of mixin', () => {
  test('should not have errors on a valid code', async () => {
    const result = await runPlugin('.block { padding: 10px; }');
    expect(result.results[0].warnings).toEqual([]);
    expect(result.errored).toBe(false);
  });

  test('should allow motion inside a keyframes declaration', async () => {
    const result = await runPlugin(`
      @keyframes my-keyframes {
        0% {
          animation-timing-function: linear
        } 
        50% {
          animation-timing-function: ease-out
        } 
      }
   `);
    expect(result.results[0].warnings).toEqual([]);
    expect(result.errored).toBe(false);
  });

  describe.each(['animation', 'transition'])('%s property', property => {
    test('should allow motion inside of the special mixin', async () => {
      const result = await runPlugin(css`
        .styled-circle-motion {
          @include styles.with-motion {
            ${property}: my-animation;
          }
        }
      `);
      expect(result.results[0].warnings).toEqual([]);
    });

    test('should not allow nested rules inside of the mixin', async () => {
      const result = await runPlugin(css`
        .block {
          @include styles.with-motion {
            .element {
              ${property}: my-animation;
            }
          }
        }
      `);
      expect(result.errored).toBe(true);
      expect(result.results[0].warnings.length).toBe(1);
      expect(result.results[0].warnings).toEqual([
        expect.objectContaining({
          rule: '@cloudscape-design/no-motion-outside-of-mixin',
          severity: 'error',
          text: `Property "${property}" should be directly under 'with-motion' helper (@cloudscape-design/no-motion-outside-of-mixin)`,
        }),
      ]);
      expect(result.errored).toBe(true);
    });

    test('should not allow motion outside of the mixin', async () => {
      const result = await runPlugin(`.block { ${property}: my-animation; }`);
      expect(result.errored).toBe(true);
      expect(result.results[0].warnings.length).toBe(1);
      expect(result.results[0].warnings).toEqual([
        expect.objectContaining({
          rule: '@cloudscape-design/no-motion-outside-of-mixin',
          severity: 'error',
          text: `Property "${property}" should be directly under 'with-motion' helper (@cloudscape-design/no-motion-outside-of-mixin)`,
        }),
      ]);
      expect(result.errored).toBe(true);
    });

    test('should not allow motion if mixin in the scope but not a parent', async () => {
      const result = await runPlugin(css`
        .styled-circle-motion {
          @include styles.with-motion {
          }
          ${property}: my-animation;
        }
      `);
      expect(result.results[0].warnings.length).toBe(1);
      expect(result.results[0].warnings).toEqual([
        expect.objectContaining({
          rule: '@cloudscape-design/no-motion-outside-of-mixin',
          severity: 'error',
          text: `Property "${property}" should be directly under 'with-motion' helper (@cloudscape-design/no-motion-outside-of-mixin)`,
        }),
      ]);
      expect(result.errored).toBe(true);
    });

    test('should allow sass variable declarations outside mixin', async () => {
      const result = await runPlugin(css`
        $element${property}-duration: 300s;
      `);
      expect(result.results[0].warnings).toEqual([]);
      expect(result.errored).toBe(false);
    });
  });
});
