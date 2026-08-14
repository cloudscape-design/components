// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

/**
 * Compile-time contract of `$icon-hover-motion`.
 *
 * Two things are asserted here that no other suite can see, because both are properties of the
 * BUILD rather than of the emitted CSS:
 *
 *  1. `part` is optional, and omitting it targets the SVG root. Every key is read with a bare
 *     `map.get`, and Sass returns `null` both for an absent key and for one explicitly set to
 *     `null`, so dropping `part: null` has to be a no-op. That equivalence is load-bearing and
 *     invisible in the stylesheet, so it is pinned here.
 *  2. A malformed spec FAILS THE BUILD. A guard that only ever gets checked by hand is not
 *     covered — nothing would go red if someone deleted `_validate-specs`, and a typo'd `part`
 *     key is the dangerous case: it silently degrades a part motion into a whole-icon one,
 *     which still animates and so still looks plausible.
 *
 * The mutation tests each pair with the positive control below, so "sass threw" can never be
 * mistaken for a pass when the harness itself is broken.
 */

const HOVER_MOTION = path.join(__dirname, '..', 'hover-motion.scss');
const THEMING = path.join(__dirname, '..', '..', 'internal', 'styles', 'utils', 'theming.scss');

const HOVER_MOTION_SOURCE = fs.readFileSync(HOVER_MOTION, 'utf8');
const THEMING_SOURCE = fs.readFileSync(THEMING, 'utf8');

const THEME = '.awsui-one-theme';

/** The `heart` entry, used as the patch site by the mutation tests. */
const HEART_ENTRY =
  "  'heart': (\n    (\n      animation: icon-pulse-soft,\n      duration: $_duration-pulse,\n      easing: $_ease-out,\n    )\n  ),";

// Only the four tokens the file actually reads. Real values are `var(--…)` references; literals
// are used here so `calc()` multiples stay inspectable.
const TOKENS_STUB = `
  $motion-duration-refresh-only-slow: 250ms;
  $motion-easing-refresh-only-d: cubic-bezier(0, 0, 0, 1);
  $motion-easing-responsive: cubic-bezier(0, 0, 0.35, 1);
  $motion-easing-show-quick: cubic-bezier(0.25, 0, 0, 1);
`;

/**
 * dart-sass's filesystem importer crashes under jest's jsdom environment, so every module is
 * served from memory. The real `theming.scss` is used rather than a stub, because the gate's
 * selector composition is exactly the part that has been got wrong before.
 */
function compile(source: string): string {
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
            'mem:resolved-tokens': `$resolved-tokens: [(selector: "${THEME}", tokens: ())];`,
          }[canonicalUrl.href];
          return { contents: contents ?? '', syntax: 'scss' as const };
        },
      },
    ],
  }).css;
}

const selectorsOf = (css: string): string[] =>
  Array.from(css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g))
    .map(m => m[1].trim().replace(/:global\(([^)]*)\)/g, '$1'))
    .filter(Boolean);

describe('the map compiles as shipped (positive control for the mutation tests below)', () => {
  test('compiles and emits motion rules', () => {
    const css = compile(HOVER_MOTION_SOURCE);
    expect(css).toContain(THEME);
    expect(css).toContain('data-awsui-icon-animated');
    expect(selectorsOf(css).length).toBeGreaterThan(50);
  });

  test('no spec declares `part: null` any more \u2014 the key is simply omitted', () => {
    expect(HOVER_MOTION_SOURCE).not.toContain('part: null');
  });
});

describe('`part` is optional and omitting it targets the SVG root', () => {
  const rootTargets = (css: string, icon: string) =>
    selectorsOf(css).filter(
      selector => selector.includes(`name-${icon}`) && /svg\[data-awsui-icon-animated\]\s*(,|$)/.test(selector)
    );

  const partTargets = (css: string, icon: string) =>
    selectorsOf(css).filter(
      selector => selector.includes(`name-${icon}`) && /svg\[data-awsui-icon-animated\]\s+\./.test(selector)
    );

  test.each(['heart', 'settings', 'status-negative'])('%s animates the root, not a part', icon => {
    const css = compile(HOVER_MOTION_SOURCE);
    expect(rootTargets(css, icon).length).toBeGreaterThan(0);
    expect(partTargets(css, icon)).toEqual([]);
  });

  test('an explicit `part: null` would emit exactly the same rules as omitting it', () => {
    // The equivalence the removal relied on, asserted rather than assumed.
    const withExplicitNull = HOVER_MOTION_SOURCE.replace(
      "  'heart': (\n    (\n      animation: icon-pulse-soft,",
      "  'heart': (\n    (\n      part: null,\n      animation: icon-pulse-soft,"
    );
    expect(withExplicitNull).not.toBe(HOVER_MOTION_SOURCE);
    expect(compile(withExplicitNull)).toBe(compile(HOVER_MOTION_SOURCE));
  });

  test('a part-level spec still targets its part', () => {
    expect(partTargets(compile(HOVER_MOTION_SOURCE), 'copy').length).toBeGreaterThan(0);
  });
});

describe('a malformed spec fails the build', () => {
  test('an unknown key is rejected, naming the icon and the key', () => {
    // The dangerous typo: with `part` optional, a misspelt `part` is indistinguishable from a
    // deliberate whole-icon spec, so it would silently animate the whole icon instead.
    const typo = HOVER_MOTION_SOURCE.replace("part: 'motion-arm',", "pat: 'motion-arm',");
    expect(typo).not.toBe(HOVER_MOTION_SOURCE);

    expect(() => compile(typo)).toThrow(/Unknown key `pat` in the \$icon-hover-motion spec for `zoom-in`/);
    expect(() => compile(typo)).toThrow(/Known keys: part, animation, to/);
  });

  test.each(['animaton', 'too', 'bas', 'iterations2'])('a typo in any key is rejected (%s)', key => {
    const typo = HOVER_MOTION_SOURCE.replace('animation: icon-pulse-soft,', `${key}: icon-pulse-soft,`);
    expect(typo).not.toBe(HOVER_MOTION_SOURCE);
    expect(() => compile(typo)).toThrow(new RegExp(`Unknown key \`${key}\``));
  });

  test('a spec carrying both `animation` and `to` is rejected', () => {
    // The emitter would put both in one rule: the animation wins and the transition is dead
    // weight, which is why the doc comment calls them alternatives.
    const both = HOVER_MOTION_SOURCE.replace(
      'animation: icon-pulse-soft,',
      'animation: icon-pulse-soft,\n      to: (transform: scale(0.9)),'
    );
    expect(both).not.toBe(HOVER_MOTION_SOURCE);
    expect(() => compile(both)).toThrow(/sets both `animation` and `to`/);
  });

  test('every known key is accepted, so the guard cannot reject a valid spec', () => {
    // Without this, a guard that rejected EVERYTHING would satisfy the tests above.
    //
    // The known set is read out of the SCSS rather than restated here, so adding a key to
    // `$_spec-keys` without exercising it fails this test instead of going unnoticed.
    const declared = HOVER_MOTION_SOURCE.match(/\$_spec-keys:\s*\(([^)]*)\)/);
    expect(declared).not.toBeNull();
    const knownKeys = declared![1].split(',').map(key => key.trim());
    expect(knownKeys.length).toBeGreaterThan(1);

    // Two specs, because `animation` and `to` are mutually exclusive by design. Between them
    // they use every known key exactly once — a key cannot be repeated inside one Sass map.
    const withAnimation = [
      'part',
      'animation',
      'base',
      'origin',
      'duration',
      'easing',
      'delay',
      'iterations',
      'fill',
      'property',
    ];
    const withTo = ['part', 'to', 'duration', 'easing'];
    expect([...new Set([...withAnimation, ...withTo])].sort()).toEqual([...knownKeys].sort());

    const value: Record<string, string> = {
      part: "'motion-probe'",
      animation: 'icon-pulse-soft',
      to: '(transform: scale(0.9))',
      base: '(opacity: 1)',
      origin: '8px 8px',
      duration: '250ms',
      easing: 'linear',
      delay: '0s',
      iterations: '1',
      fill: 'none',
      property: 'transform',
    };
    const spec = (keys: string[]) => `(\n${keys.map(key => `      ${key}: ${value[key]},`).join('\n')}\n    )`;

    const patched = HOVER_MOTION_SOURCE.replace(
      HEART_ENTRY,
      `  'heart': (\n    ${spec(withAnimation)},\n    ${spec(withTo)}\n  ),`
    );
    expect(patched).not.toBe(HOVER_MOTION_SOURCE);
    expect(() => compile(patched)).not.toThrow();
  });
});
