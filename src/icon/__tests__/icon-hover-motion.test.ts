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
    // The trigger's compound is whitespace-free (e.g. `[data-awsui-motion-trigger~=hover]:not(...):hover`),
    // so token splitting isolates it; `:hover` is dropped since jsdom cannot set hover state.
    const guard = genericRuleSelector()
      .split(/\s+/)
      .find(token => token.startsWith('[data-awsui-motion-trigger'))!
      .replace(':hover', '');

    const button = (attributes: Record<string, string> = {}) => {
      const element = document.createElement('button');
      element.setAttribute('data-awsui-motion-trigger', 'hover');
      for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
      }
      return element;
    };

    expect(button().matches(guard)).toBe(true);
    expect(button({ disabled: '' }).matches(guard)).toBe(false);
    expect(button({ 'aria-disabled': 'true' }).matches(guard)).toBe(false);

    // Positive control: React stringifies `aria-disabled={false}` to the string "false" on an
    // ENABLED control. A bare `[aria-disabled]` guard must not exclude it.
    expect(button({ 'aria-disabled': 'false' }).matches(guard)).toBe(true);
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

  test('a motion spec missing `duration` is rejected, naming the icon', () => {
    // `announcement` is the first entry in the map, so the first match is its duration.
    const missing = HOVER_MOTION_SOURCE.replace('      duration: 400ms,\n', '');
    expect(missing).not.toBe(HOVER_MOTION_SOURCE);
    expect(() => compile([THEME], missing)).toThrow(/spec for `announcement` sets motion but is missing/);
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
