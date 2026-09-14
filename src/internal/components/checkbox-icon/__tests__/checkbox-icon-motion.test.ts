// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

const SRC_ROOT = path.resolve(__dirname, '../../../..'); // .../src

const ICON_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/components/checkbox-icon/styles.scss'), 'utf8');
const THEMING_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/styles/utils/theming.scss'), 'utf8');
const MOTION_MIXINS_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/styles/motion/mixins.scss'), 'utf8');

const THEME = '.awsui-one-theme';

/**
 * Compiles the checkbox-icon stylesheet against the real theming gate.
 */
function compile(optedInThemes: string[]): string {
  return sass.compileString(ICON_SOURCE, {
    importers: [
      {
        canonicalize(url: string) {
          if (url.endsWith('styles/tokens')) {
            return new URL('mem:tokens');
          }
          if (url.endsWith('theming')) {
            return new URL('mem:theming');
          }
          if (url.endsWith('/styles')) {
            return new URL('mem:styles');
          }
          if (url.startsWith('awsui:')) {
            return new URL('mem:resolved-tokens');
          }
          return null;
        },
        load(canonicalUrl: URL) {
          const contents = {
            'mem:styles': MOTION_MIXINS_SOURCE,
            'mem:theming': THEMING_SOURCE,
            'mem:tokens': ICON_SOURCE.match(/awsui\.\$[\w-]+/g)!
              .map(token => `${token.slice('awsui.'.length)}: initial;`)
              .join('\n'),
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

describe('checkbox draw-in animation, as compiled', () => {
  test('emits neither the animation nor its keyframes for an artefact with no opted-in theme', () => {
    const css = compile([]);
    expect(css).not.toContain('awsui-checkbox-draw');
    expect(css).not.toMatch(/@keyframes/);
  });

  test('emits the animation scoped to the theme once the theme opts in', () => {
    const css = compile([THEME]);
    const block = css.split('}').find(b => b.includes('animation: awsui-checkbox-draw'));

    expect(block).toBeDefined();
    expect(block).toContain(THEME);
    expect(block).toContain('styled-line[data-awsui-motion-ready]');
    expect(css).toMatch(/@keyframes awsui-checkbox-draw\s*\{/);
  });

  test('the animation rule carries both mode exclusions in the theme compound', () => {
    const css = compile([THEME]);
    const block = css.split('}').find(b => b.includes('animation: awsui-checkbox-draw'))!;
    const selector = block.slice(0, block.lastIndexOf('{')).split('{').pop()!.trim();
    expect(selector).toContain(`${THEME}:not(.awsui-motion-disabled):not(.awsui-mode-entering)`);
  });

  test('never sets a negative stroke-dashoffset (Safari mishandles them)', () => {
    const css = compile([THEME]);
    expect(css).toMatch(/stroke-dashoffset/);
    expect(css).not.toMatch(/stroke-dashoffset:\s*-/);
  });
});
