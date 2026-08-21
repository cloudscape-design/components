// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

const SRC_ROOT = path.resolve(__dirname, '../..'); // .../src

const HOVER_MOTION_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'icon/hover-motion.scss'), 'utf8');
const THEMING_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/styles/utils/theming.scss'), 'utf8');

const THEME = '.awsui-one-theme';

/**
 * Compiles `hover-motion.scss` against the real `theming.scss`, for an artefact
 * whose `resolved-tokens` carry `optedInThemes`.
 */
function compile(optedInThemes: string[]): string {
  return sass.compileString(`@use 'hover-motion' as hover-motion;\n@include hover-motion.icon-hover-motion;`, {
    importers: [
      {
        canonicalize(url: string) {
          if (url.endsWith('hover-motion')) {
            return new URL('mem:hover-motion');
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
            'mem:hover-motion': HOVER_MOTION_SOURCE,
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

/**
 * The selector of the generic hover-motion rule (the one setting `scale(0.94)`),
 * compiled with `THEME` opted in.
 */
function genericRuleSelector(): string {
  const css = compile([THEME]);
  const block = css.split('}').find(b => b.includes('scale(0.94)'));
  if (!block) {
    throw new Error('generic hover-motion rule not found in compiled CSS');
  }
  return block.slice(0, block.indexOf('{')).trim();
}

describe('the expressive-motion theme opt-in gate', () => {
  test('emits nothing for an artefact with no opted-in theme', () => {
    const css = compile([]);
    expect(css).not.toContain('scale(0.94)');
    expect(css).not.toContain('data-awsui-motion-trigger');
  });

  test('emits generic motion, scoped to the theme, once the theme opts in', () => {
    const css = compile([THEME]);
    const scaleBlock = css.split('}').find(block => block.includes('scale(0.94)'));

    expect(scaleBlock).toBeDefined();
    expect(scaleBlock).toContain(THEME);
    expect(scaleBlock).toContain('data-awsui-motion-trigger');
  });
});

describe('the generic hover motion rule, as compiled', () => {
  test('the generic rule carries the theme scope and both mode exclusions', () => {
    const selector = genericRuleSelector();
    expect(selector).toContain(THEME);
    expect(selector).toContain(':not(.awsui-motion-disabled)');
    expect(selector).toContain(':not(.awsui-mode-entering)');
  });

  test('the generic rule targets the inner svg', () => {
    const target = genericRuleSelector().split(/\s+/).pop()!;
    expect(target).toMatch(/^>?\s*:global\(svg\[data-awsui-icon-animated\]\)$/);
  });

  test('reduced motion is one wrapping media query, not a per-rule override', () => {
    const css = compile([THEME]);
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(1);
    expect(css).not.toMatch(/prefers-reduced-motion:\s*reduce\b/);
  });

  test('the generic rule also fires on :focus-visible, guarded the same way as :hover', () => {
    expect(genericRuleSelector()).toMatch(
      /\[data-awsui-motion-trigger~=hover]:not\(:disabled\):not\(\[aria-disabled=true]\):is\(:focus-visible,/
    );
  });

  test('the disabled guard excludes aria-disabled="true" but not aria-disabled="false"', () => {
    const selector = genericRuleSelector();
    const hoverIndex = selector.indexOf(':hover');
    // The region is the one compound immediately left of `:hover`. The theme scope sits
    // further left, closed by `) ` (the end of the `:global(...)` wrapper), so start there.
    const regionStart = selector.lastIndexOf(') ', hoverIndex) + 2;
    const region = selector.slice(regionStart, hoverIndex);

    const enabled = document.createElement('button');
    enabled.setAttribute('data-awsui-motion-trigger', 'hover');
    expect(enabled.matches(region)).toBe(true);

    const nativeDisabled = document.createElement('button');
    nativeDisabled.setAttribute('data-awsui-motion-trigger', 'hover');
    nativeDisabled.disabled = true;
    expect(nativeDisabled.matches(region)).toBe(false);

    const ariaDisabled = document.createElement('button');
    ariaDisabled.setAttribute('data-awsui-motion-trigger', 'hover');
    ariaDisabled.setAttribute('aria-disabled', 'true');
    expect(ariaDisabled.matches(region)).toBe(false);

    // Positive control: React stringifies `aria-disabled={false}` to the string "false" on an
    // ENABLED control. A bare `[aria-disabled]` guard must work.
    const ariaEnabled = document.createElement('button');
    ariaEnabled.setAttribute('data-awsui-motion-trigger', 'hover');
    ariaEnabled.setAttribute('aria-disabled', 'false');
    expect(ariaEnabled.matches(region)).toBe(true);
  });
});
