// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

import styles from '../../../lib/components/icon/styles.css.js';

const SRC_ROOT = path.resolve(__dirname, '../..'); // .../src
const BUILD_ROOT = path.resolve(SRC_ROOT, '../lib/components'); // .../lib/components

const HOVER_MOTION_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'icon/hover-motion.scss'), 'utf8');
const THEMING_SOURCE = fs.readFileSync(path.join(SRC_ROOT, 'internal/styles/utils/theming.scss'), 'utf8');
const CSS_PATH = path.join(BUILD_ROOT, 'icon/styles.scoped.css');

const THEME = '.awsui-one-theme';

// Only the tokens the file actually reads. Real values are `var(--…)` references; literals
// are used here so the compiled output stays inspectable.
const TOKENS_STUB = `
  $motion-duration-refresh-only-slow: 250ms;
  $motion-easing-refresh-only-d: cubic-bezier(0, 0, 0, 1);
  $motion-easing-responsive: cubic-bezier(0, 0, 0.35, 1);
  $motion-easing-show-quick: cubic-bezier(0.25, 0, 0, 1);
`;

/**
 * Compiles `hover-motion.scss` against the real `theming.scss`, for an artefact whose
 * `resolved-tokens` carry `optedInThemes`. dart-sass's filesystem importer crashes under
 * jest's jsdom environment, so every module is served from memory; `source` lets the
 * mutation tests below patch the map without touching the file on disk.
 */
function compile(optedInThemes: string[], source: string = HOVER_MOTION_SOURCE): string {
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
            'mem:hover-motion': source,
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

/**
 * Every style rule in the REAL built stylesheet, read through the CSSOM rather than a
 * bespoke selector parser. The postcss `:not(#\\9)` specificity hack is stripped first: it
 * can never match an element, and jsdom's selector engine refuses to compile the escape.
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

/**
 * The icon-side tail of a selector — everything after the trigger's `:hover`/`:focus-visible`
 * pseudo-class — kept as ONE descendant-combinator chain rather than split further, so
 * `.matches()` on a real element still resolves the icon-name compound against its own
 * ancestor, not just the leaf compound. `:hover` appears exactly once, always at the top
 * level of our own generated selectors, so a literal index search is exact here.
 */
function tailAfterTrigger(selector: string): string {
  const hoverIndex = selector.indexOf(':hover');
  if (hoverIndex !== -1) {
    return selector.slice(hoverIndex + ':hover'.length).trim();
  }
  const focusIndex = selector.indexOf(':focus-visible');
  const closeParen = selector.indexOf('))', focusIndex);
  return selector.slice(closeParen + 2).trim();
}

/**
 * An icon's SVG root, tagged the way `InternalIcon` tags it: `.icon.name-X > svg[...]`.
 * Uses the REAL hashed class names from the CSS module — the generated selectors target
 * those, not the literal `icon`/`name-X` source names.
 */
function iconSvg(name: string, ...partClasses: string[]): SVGElement {
  const wrapper = document.createElement('span');
  wrapper.className = `${styles.icon} ${(styles as Record<string, string>)[`name-${name}`]}`;
  wrapper.setAttribute('data-awsui-motion-target', 'true');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('data-awsui-icon-animated', 'true');
  for (const partClass of partClasses) {
    const part = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    part.setAttribute('class', partClass);
    svg.appendChild(part);
  }
  wrapper.appendChild(svg);
  document.body.appendChild(wrapper);
  return svg;
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
    // Example selector: `:global(.awsui-one-theme...) [data-awsui-motion-trigger~=hover]:not(...):hover ...`
    // The region under test is everything between the theme scope's `:global(...)` wrapper
    // and `:hover`, here: `[data-awsui-motion-trigger~=hover]:not(:disabled):not([aria-disabled=true])`.
    const hoverIndex = selector.indexOf(':hover');
    const globalIndex = selector.indexOf(':global(');
    const regionStart = selector.indexOf(') ', globalIndex) + 2;
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

describe('a malformed spec fails the build', () => {
  test('an unknown key is rejected, naming the icon and the key', () => {
    const typo = HOVER_MOTION_SOURCE.replace("part: 'awsui-icon-arm',", "pat: 'awsui-icon-arm',");
    expect(typo).not.toBe(HOVER_MOTION_SOURCE);
    expect(() => compile([THEME], typo)).toThrow(/Unknown key `pat` in the \$icon-hover-motion spec for `zoom-in`/);
  });

  test('a spec carrying both `animation` and `to` is rejected', () => {
    const both = HOVER_MOTION_SOURCE.replace(
      'animation: icon-pulse-soft,',
      'animation: icon-pulse-soft,\n      to: (transform: scale(0.9)),'
    );
    expect(both).not.toBe(HOVER_MOTION_SOURCE);
    expect(() => compile([THEME], both)).toThrow(/sets both `animation` and `to`/);
  });
});

describe('`part` is optional, and omitting it animates the icon root', () => {
  test('a whole-icon entry (`settings`) has no per-part rule', () => {
    const rules = hoverRules().filter(rule => rule.selectorText.includes(styles['name-settings']));
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(rule.selectorText).not.toMatch(/svg\[data-awsui-icon-animated\]\s+\./);
    }
  });

  test('a part-level entry (`copy`) targets its part, not the root', () => {
    const rules = hoverRules().filter(rule => rule.selectorText.includes(styles['name-copy']));
    expect(rules.some(rule => /svg\[data-awsui-icon-animated\]\s+\.awsui-icon-front/.test(rule.selectorText))).toBe(
      true
    );
  });
});

describe('a bespoke rule overrides the floor', () => {
  test('settings resolves to its own rotation, not the floor scale', () => {
    const svg = iconSvg('settings');
    const winners = hoverRules().filter(
      rule => rule.selectorText.includes(styles['name-settings']) && rule.style.transform
    );
    expect(winners.length).toBeGreaterThan(0);
    expect(winners.every(rule => svg.matches(tailAfterTrigger(rule.selectorText)))).toBe(true);
    expect(winners.some(rule => rule.style.transform?.includes('rotate'))).toBe(true);
  });
});

describe('the floor-cancel does not out-rank whole-icon motion', () => {
  const cancelRule = () =>
    hoverRules().find(rule => rule.selectorText.includes(':has(') && rule.style.transform === 'none')!;

  test('the cancel rule exists and targets at least one real part-only icon', () => {
    expect(cancelRule()).toBeTruthy();
    expect(iconSvg('copy', 'awsui-icon-front').matches(tailAfterTrigger(cancelRule().selectorText))).toBe(true);
  });

  test('an icon combining a whole-icon spec with a part spec is excluded from the cancel', () => {
    // `face-happy` tilts the whole icon AND flexes its mouth. If the cancel aggregate ever
    // included it, the cancel would out-specify the tilt by one class-level unit (the
    // `:has(:is(…))`) regardless of source order, silently resetting the tilt to `none`.
    const faceHappySvg = iconSvg('face-happy', 'awsui-icon-mouth');
    expect(faceHappySvg.matches(tailAfterTrigger(cancelRule().selectorText))).toBe(false);

    const tiltRule = hoverRules().find(
      rule => rule.selectorText.includes(styles['name-face-happy']) && rule.style.transform?.includes('rotate')
    )!;
    expect(tiltRule).toBeTruthy();
    expect(faceHappySvg.matches(tailAfterTrigger(tiltRule.selectorText))).toBe(true);
  });

  test('the mouth part still animates inside the tilting face', () => {
    const faceHappySvg = iconSvg('face-happy', 'awsui-icon-mouth');
    const mouthRule = hoverRules().find(
      rule => rule.selectorText.includes(styles['name-face-happy']) && /\.awsui-icon-mouth/.test(rule.selectorText)
    )!;
    expect(mouthRule).toBeTruthy();
    expect(faceHappySvg.querySelector('.awsui-icon-mouth')!.matches('.awsui-icon-mouth')).toBe(true);
  });
});

describe('keyframes', () => {
  test('gated on the artefact: none for a theme that never opted in', () => {
    expect(compile([])).not.toMatch(/@keyframes/);
  });

  test('every referenced animation name has a matching keyframes block', () => {
    const css = compile([THEME]);
    const referenced = new Set(Array.from(css.matchAll(/animation-name:\s*([\w-]+)/g)).map(match => match[1]));
    expect(referenced.size).toBeGreaterThan(0);
    for (const name of referenced) {
      expect(css).toMatch(new RegExp(`@keyframes\\s+${name}\\s*\\{`));
    }
  });

  test('no keyframes block is emitted that nothing in the map references', () => {
    const css = compile([THEME]);
    const defined = Array.from(css.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)).map(match => match[1]);
    const referenced = new Set(Array.from(css.matchAll(/animation-name:\s*([\w-]+)/g)).map(match => match[1]));
    expect(defined.length).toBeGreaterThan(0);
    for (const name of defined) {
      expect(referenced.has(name)).toBe(true);
    }
  });
});
