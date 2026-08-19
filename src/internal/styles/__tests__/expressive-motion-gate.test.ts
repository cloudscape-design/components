// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

/**
 * Regression tests for the expressive-motion theme opt-in gate.
 *
 * The gate once shipped with the mode selector concatenated BEFORE the theme selector.
 * Since a theme selector can be an element (the primary theme's is `body`), that produced
 * e.g. `.mode-offbody` — valid Sass, no warning, matches nothing, silently disabling the
 * guard. Assertions here favour real DOM matching (`Element.matches`) over reading emitted
 * CSS text, because that bug's selector was syntactically fine and still matched nothing.
 *
 * The gate has nothing to do with One Theme — it's just the first opt-in — so these use
 * fictional theme selectors injected via `@use ... with (...)`. The one exception is the
 * "default configuration" test at the bottom, which pins the real shipped value.
 */

const THEMING_SOURCE = fs.readFileSync(path.join(__dirname, '..', 'utils', 'theming.scss'), 'utf8');

const THEME_A = '.test-theme-a';
const THEME_B = 'body';
const NOT_OPTED_IN = '.test-theme-a-legacy:not(.test-theme-a)';
const MODE = '.test-mode-disabled';

function resolvedTokensStub(selectors: string[]) {
  return `$resolved-tokens: [${selectors.map(s => `(selector: "${s}", tokens: ())`).join(',\n')}];`;
}

/** Compiles `theming.scss` for an artefact containing `artefactThemes`. `optedIn` overrides
 * `$expressive-motion-themes`; omit it to exercise the real shipped default instead. */
function compile(artefactThemes: string[], optedIn?: string[]): string {
  const withClause = optedIn ? ` with ($expressive-motion-themes: (${optedIn.map(s => `'${s}'`).join(', ')},))` : '';
  const source = `
    @use 'theming' as theming${withClause};
    .target {
      @include theming.expressive-motion-only { color: red; }
      @include theming.expressive-motion-only('${MODE}') { animation: none; }
    }
  `;
  const css = sass.compileString(source, {
    importers: [
      {
        canonicalize(url: string) {
          if (url === 'theming') {
            return new URL('mem:theming');
          }
          return url.startsWith('awsui:') ? new URL(`awsui-stub:${url.slice('awsui:'.length)}`) : null;
        },
        load(canonicalUrl: URL) {
          const contents = canonicalUrl.href === 'mem:theming' ? THEMING_SOURCE : resolvedTokensStub(artefactThemes);
          return { contents, syntax: 'scss' as const };
        },
      },
    ],
  }).css;
  return css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
}

/** `:global(...)` is a CSS-modules compile-time marker; strip it to get a real selector. */
function selectorsOf(css: string): string[] {
  return Array.from(css.matchAll(/([^{}]+)\{/g))
    .map(m => m[1].trim().replace(/:global\(([^)]*)\)/g, '$1'))
    .filter(Boolean);
}

/** Renders `<body [classes]><div class="target"></div></body>` and returns the target. */
function activate(theme: string, extraClasses: string[] = []): Element {
  document.body.className = '';
  document.body.innerHTML = '<div class="target"></div>';
  const classes = [theme, ...extraClasses].filter(s => s.startsWith('.')).map(s => s.slice(1));
  document.body.classList.add(...classes);
  return document.querySelector('.target')!;
}

describe('expressive-motion gate: opt-in', () => {
  test('emits nothing when no theme in the artefact has opted in', () => {
    expect(compile([NOT_OPTED_IN, THEME_B], [THEME_A])).toBe('');
  });

  test('emits nothing when the artefact contains no themes at all', () => {
    expect(compile([], [THEME_A])).toBe('');
  });

  test('a substring-similar selector does not opt in by accident', () => {
    // NOT_OPTED_IN contains THEME_A as a literal substring; list membership must be
    // equality-based, not a substring check, or this would wrongly match.
    expect(compile([NOT_OPTED_IN], [THEME_A])).toBe('');
  });

  test('emits exactly the themed + guarded rule per opted-in theme, nothing for a sibling that did not opt in', () => {
    const selectors = selectorsOf(compile([THEME_A, THEME_B, NOT_OPTED_IN], [THEME_A, THEME_B]));
    expect(selectors.filter(s => s.startsWith(THEME_A))).toHaveLength(2);
    expect(selectors.filter(s => s.startsWith(THEME_B))).toHaveLength(2);
    expect(selectors.some(s => s.includes('legacy'))).toBe(false);
  });
});

describe.each([
  ['class theme', THEME_A],
  ['element theme', THEME_B],
])('expressive-motion gate: %s composition', (_label, theme) => {
  const selectors = selectorsOf(compile([THEME_A, THEME_B], [THEME_A, THEME_B]));
  const guard = selectors.find(s => s.startsWith(`${theme}${MODE}`));
  const themedOnly = selectors.find(s => s.startsWith(theme) && !s.includes(MODE));

  test('theme selector composes before the mode selector, and the compound matches real DOM', () => {
    expect(guard).toBeDefined();
    expect(activate(theme, [MODE]).matches(guard!)).toBe(true);
  });

  test('the guard does not match when the mode is off', () => {
    expect(activate(theme).matches(guard!)).toBe(false);
  });

  test('the theme-only rule matches when just the theme is present', () => {
    expect(themedOnly).toBeDefined();
    expect(activate(theme).matches(themedOnly!)).toBe(true);
  });
});

test('the mode selector compounds onto the theme element, rather than nesting as a separate ancestor', () => {
  const guard = selectorsOf(compile([THEME_A], [THEME_A])).find(s => s.startsWith(`${THEME_A}${MODE}`))!;
  document.body.className = THEME_A.slice(1);
  document.body.innerHTML = '';
  const modeWrapper = document.createElement('div');
  modeWrapper.className = MODE.slice(1);
  modeWrapper.innerHTML = '<div class="target"></div>';
  document.body.appendChild(modeWrapper);
  expect(document.querySelector('.target')!.matches(guard)).toBe(false);
});

describe('expressive-motion gate: default configuration', () => {
  test('ships with One Theme opted in by default (pin this if it ever changes intentionally)', () => {
    expect(compile(['.awsui-one-theme'])).not.toBe('');
    expect(compile([THEME_A])).toBe('');
  });
});
