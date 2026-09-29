// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

const SRC_ROOT = path.resolve(__dirname, '../../../..'); // .../src

const MOTION_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/components/radio-button/motion.scss'), 'utf8');
const THEMING_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/styles/utils/theming.scss'), 'utf8');

const THEME = '.awsui-one-theme';

/**
 * Compiles `motion.scss` against the real `theming.scss`, for an artefact whose
 * `resolved-tokens` carry `optedInThemes`. dart-sass's filesystem importer crashes under
 * jest's jsdom environment, so every module is served from memory.
 */
function compile(optedInThemes: string[]): string {
  return sass.compileString(`@use 'motion' as motion;\n.styled-circle-fill { @include motion.select; }`, {
    importers: [
      {
        canonicalize(url: string) {
          if (url.endsWith('motion')) {
            return new URL('mem:motion');
          }
          if (url.endsWith('theming')) {
            return new URL('mem:theming');
          }
          if (url.startsWith('awsui:')) {
            return new URL('mem:resolved-tokens');
          }
          return null;
        },
        load(canonicalUrl: URL) {
          const contents = {
            'mem:motion': MOTION_SOURCE,
            'mem:theming': THEMING_SOURCE,
            'mem:resolved-tokens': `$resolved-tokens: [${optedInThemes
              .map(selector => `(selector: "${selector}", tokens: ())`)
              .join(',')}];`,
          }[canonicalUrl.href];
          return { contents: contents ?? '', syntax: 'scss' as const };
        },
      },
    ],
  }).css;
}

describe('radio button select animation, as compiled', () => {
  test('emits nothing for an artefact with no opted-in theme', () => {
    expect(compile([])).toBe('');
  });

  test('emits the animation and its keyframes, scoped to the theme, once the theme opts in', () => {
    const css = compile([THEME]);
    expect(css).toMatch(/@keyframes awsui-radio-select\s*\{/);
    expect(css).toContain('animation: awsui-radio-select');
    expect(css).toContain(
      `:global(${THEME}:not(.awsui-motion-disabled):not(.awsui-mode-entering)) .styled-circle-fill.styled-circle-checked[data-awsui-motion-ready]`
    );
  });

  test('reduced motion is wrapping the animation', () => {
    const css = compile([THEME]);
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(1);
    expect(css).not.toMatch(/animation:\s*none/);
  });
});
