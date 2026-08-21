// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

const SRC_ROOT = path.resolve(__dirname, '../..'); // .../src
const BUILD_ROOT = path.resolve(SRC_ROOT, '../lib/components'); // .../lib/components

const HOVER_MOTION_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'icon/hover-motion.scss'), 'utf8');
const THEMING_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/styles/utils/theming.scss'), 'utf8');
const CSS_PATH = path.join(BUILD_ROOT, 'icon/styles.scoped.css');

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
 * Parses the built stylesheet into real CSSStyleRule objects, so tests can
 * assert on selectorText and style instead of matching raw CSS text.
 */
function builtRules(): CSSStyleRule[] {
  const style = document.createElement('style');
  style.textContent = fs.readFileSync(CSS_PATH, 'utf8').replace(/:not\(#\\9\)/g, '');
  document.head.appendChild(style);

  const rules: CSSStyleRule[] = [];
  const collect = (list: CSSRuleList) => {
    for (const rule of Array.from(list)) {
      if (rule instanceof CSSMediaRule) {
        collect(rule.cssRules);
      } else if (rule instanceof CSSStyleRule) {
        rules.push(rule);
      }
    }
  };
  collect(style.sheet!.cssRules);
  document.head.removeChild(style);
  return rules;
}

// Icon-specific motions
const hoverRules = () => builtRules().filter(rule => /:hover|:focus-visible/.test(rule.selectorText));
// Generic motion for icons that don't have their own motion
const genericRule = () => hoverRules().find(rule => rule.style.transform === 'scale(0.94)')!;

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
    expect(genericRule().selectorText).toContain(THEME);
    expect(genericRule().selectorText).toContain(':not(.awsui-motion-disabled)');
    expect(genericRule().selectorText).toContain(':not(.awsui-mode-entering)');
  });

  test('the generic rule targets the inner svg', () => {
    expect(genericRule().style.transform).toBe('scale(0.94)');
    const target = genericRule().selectorText.split(/\s+/).pop()!;
    expect(target).toMatch(/^>?\s*svg\[data-awsui-icon-animated\]$/);
  });

  test('reduced motion is one wrapping media query, not a per-rule override', () => {
    const css = fs.readFileSync(CSS_PATH, 'utf8');
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(1);
    expect(css).not.toMatch(/prefers-reduced-motion:\s*reduce\b/);
  });

  test('the generic rule also fires on :focus-visible, guarded the same way as :hover', () => {
    expect(genericRule().selectorText).toMatch(
      /\[data-awsui-motion-trigger~=hover]:not\(:disabled\):not\(\[aria-disabled=true]\):is\(:focus-visible,/
    );
  });

  test('the disabled guard excludes aria-disabled="true" but not aria-disabled="false"', () => {
    const selector = genericRule().selectorText;
    const hoverIndex = selector.indexOf(':hover');
    const regionStart = selector.lastIndexOf(' ', hoverIndex) + 1;
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
