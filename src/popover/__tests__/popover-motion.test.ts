// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

const SRC_ROOT = path.resolve(__dirname, '../..'); // .../src

const MOTION_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'popover/motion.scss'), 'utf8');
const THEMING_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/styles/utils/theming.scss'), 'utf8');

const THEME = '.awsui-one-theme';
const SCOPE = `:global(${THEME}:not(.awsui-motion-disabled):not(.awsui-mode-entering)) .container`;

/**
 * Compiles `motion.scss` against the real `theming.scss`, for an artefact whose
 * `resolved-tokens` carry `optedInThemes`. dart-sass's filesystem importer crashes under
 * jest's jsdom environment, so every module is served from memory; the shared `styles` and
 * `tokens` modules are stubs with only what the file reads.
 */
function compile(optedInThemes: string[]): string {
  return sass.compileString(`@use 'motion';`, {
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
          if (url.endsWith('tokens')) {
            return new URL('mem:tokens');
          }
          if (url.endsWith('styles')) {
            return new URL('mem:styles');
          }
          return null;
        },
        load(canonicalUrl: URL) {
          const contents = {
            'mem:motion': MOTION_SOURCE,
            'mem:theming': THEMING_SOURCE,
            'mem:tokens': `
              $motion-duration-show-paced: 1ms;
              $motion-easing-show-paced: linear;
              $motion-duration-refresh-only-fast: 1ms;
              $motion-easing-refresh-only-a: linear;
            `,
            'mem:styles': `
              @mixin with-motion { @content; }
              @mixin with-direction($direction) { &:dir(#{$direction}) { @content; } }
              @mixin animation-fade-in {}
            `,
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

describe('popover settle animation, as compiled', () => {
  test('emits nothing of it for an artefact with no opted-in theme', () => {
    const css = compile([]);
    expect(css).not.toContain('awsui-popover-settle');
    expect(css).not.toContain('prefers-reduced-motion: no-preference');
  });

  test('emits one keyframe set per travel direction once the theme opts in', () => {
    const css = compile([THEME]);
    for (const direction of ['down', 'up', 'right', 'left']) {
      expect(css).toMatch(new RegExp(`@keyframes awsui-popover-settle-${direction}\\s*\\{`));
    }
  });

  test('travels away from the trigger, picking the direction from the resolved arrow position', () => {
    const css = compile([THEME]);
    expect(css).toMatch(
      new RegExp(`${escape(SCOPE)} \\{\\s*animation: awsui-popover-settle-down 250ms cubic-bezier\\(0.3, 0, 0.2, 1\\);`)
    );
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)}:has\\(\\.container-arrow-position-top-left, \\.container-arrow-position-top-center, \\.container-arrow-position-top-right\\) \\{\\s*animation-name: awsui-popover-settle-up;`
      )
    );
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)}:has\\(\\.container-arrow-position-right-top, \\.container-arrow-position-right-bottom\\) \\{\\s*animation-name: awsui-popover-settle-right;`
      )
    );
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)}:has\\(\\.container-arrow-position-left-top, \\.container-arrow-position-left-bottom\\) \\{\\s*animation-name: awsui-popover-settle-left;`
      )
    );
  });

  test('swaps the horizontal travel in RTL, since right and left are logical placements', () => {
    const css = compile([THEME]);
    expect(css).toMatch(
      /\.container-arrow-position-right-bottom\):dir\(rtl\) \{\s*animation-name: awsui-popover-settle-left;/
    );
    expect(css).toMatch(
      /\.container-arrow-position-left-bottom\):dir\(rtl\) \{\s*animation-name: awsui-popover-settle-right;/
    );
  });

  test('every settle rule sits in a reduced-motion media query', () => {
    const css = compile([THEME]);
    const settleRules = css.match(/animation(-name)?: awsui-popover-settle/g) ?? [];
    expect(settleRules.length).toBe(6);
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(6);
    expect(css).not.toMatch(/animation:\s*none/);
  });
});

function escape(literal: string) {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
