// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

const HOVER_MOTION_SOURCE = fs.readFileSync(path.join(__dirname, '..', 'hover-motion.scss'), 'utf8');
const THEMING_SOURCE = fs.readFileSync(
  path.join(__dirname, '..', '..', 'internal', 'styles', 'utils', 'theming.scss'),
  'utf8'
);
const CSS_PATH = path.join(__dirname, '..', '..', '..', 'lib', 'components', 'icon', 'styles.scoped.css');

const THEME = '.awsui-one-theme';

// Only the two tokens the file actually reads. Real values are `var(--…)` references; literals
// are used here so the compiled output stays inspectable.
const TOKENS_STUB = `
  $motion-duration-refresh-only-slow: 250ms;
  $motion-easing-responsive: cubic-bezier(0, 0, 0.35, 1);
`;

/**
 * Compiles `hover-motion.scss` against the real `theming.scss`, for an artefact whose
 * `resolved-tokens` carry `optedInThemes`. dart-sass's filesystem importer crashes under
 * jest's jsdom environment, so every module is served from memory.
 */
function compile(optedInThemes: string[]): string {
  return sass.compileString(`@use 'hover-motion' as hover-motion;\n@include hover-motion.icon-hover-motion;`, {
    importers: [
      {
        canonicalize(url: string) {
          if (url.endsWith('hover-motion')) {
            return new URL('mem:hover-motion');
          }
          if (url.endsWith('tokens') && !url.startsWith('awsui:')) {
            return new URL('mem:tokens');
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
            'mem:tokens': TOKENS_STUB,
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
 * Every style rule in the REAL built stylesheet, read through the CSSOM rather than a
 * bespoke selector parser — the browser's own parser already handles comma lists, `:is()`
 * and `@media` nesting correctly. The postcss `:not(#\\9)` specificity hack is stripped first:
 * it can never match an element, and jsdom's selector engine refuses to compile the escape.
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

const hoverRules = () => builtRules().filter(rule => /:hover|:focus-visible/.test(rule.selectorText));
const floorRule = () => hoverRules().find(rule => rule.style.transform === 'scale(0.94)')!;

describe('the theme gate', () => {
  test('emits nothing for an artefact with no opted-in theme', () => {
    const css = compile([]);
    expect(css).not.toContain('scale(0.94)');
    expect(css).not.toContain('data-awsui-motion-trigger');
  });

  test('emits the floor, scoped to the theme, once the theme opts in', () => {
    const css = compile([THEME]);
    expect(css).toContain(THEME);
    expect(css).toContain('scale(0.94)');
    expect(css).toContain('data-awsui-motion-trigger');
  });
});

describe('the real built stylesheet', () => {
  test('the floor rule carries the theme scope and both mode exclusions', () => {
    expect(floorRule().selectorText).toContain(THEME);
    expect(floorRule().selectorText).toContain(':not(.awsui-motion-disabled)');
    expect(floorRule().selectorText).toContain(':not(.awsui-mode-entering)');
  });

  test('the floor targets the INNER svg, never the outer .icon span', () => {
    expect(floorRule().style.transform).toBe('scale(0.94)');
    // The rule's target is the last compound; it must be the opted-in svg, not a bare `.icon`.
    const target = floorRule().selectorText.split(/\s+/).pop()!;
    expect(target).toMatch(/^>?\s*svg\[data-awsui-icon-animated\]$/);
  });

  test('reduced motion is one wrapping media query, not a per-rule override', () => {
    const css = fs.readFileSync(CSS_PATH, 'utf8');
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(1);
    expect(css).not.toMatch(/prefers-reduced-motion:\s*reduce\b/);
  });

  test('no `@keyframes` are emitted', () => {
    expect(fs.readFileSync(CSS_PATH, 'utf8')).not.toMatch(/@keyframes/);
  });

  test('the floor also fires on :focus-visible, guarded the same way as :hover', () => {
    expect(floorRule().selectorText).toMatch(
      /\[data-awsui-motion-trigger~=hover]:not\(:disabled\):not\(\[aria-disabled=true]\):is\(:focus-visible,/
    );
  });

  test('the disabled guard matches by exact value — an ENABLED control still animates', () => {
    // The region is the one compound immediately left of `:hover` — an ancestor theme scope
    // sits further left, joined by a descendant combinator, so it must not be included: a
    // bare region element has no such ancestor and would otherwise never match.
    const selector = floorRule().selectorText;
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
    // ENABLED control. A bare `[aria-disabled]` guard would wrongly exclude this one too.
    const ariaEnabled = document.createElement('button');
    ariaEnabled.setAttribute('data-awsui-motion-trigger', 'hover');
    ariaEnabled.setAttribute('aria-disabled', 'false');
    expect(ariaEnabled.matches(region)).toBe(true);
  });
});
