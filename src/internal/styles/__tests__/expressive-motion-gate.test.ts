// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

/**
 * Regression tests for the expressive-motion theme opt-in gate.
 */

const THEMING_SOURCE = fs.readFileSync(path.join(__dirname, '..', 'utils', 'theming.scss'), 'utf8');

const THEME_SELECTOR_A = 'body'; // theme A themes the whole document
const THEME_SELECTOR_B = '.test-theme-a';
const THEME_SELECTOR_C = '.test-theme-a-legacy:not(.test-theme-a)'; // substring-overlaps with theme B's selector
const MODE_SELECTOR = '.test-mode-disabled';

function resolvedTokensStub(selectors: string[]) {
  return `$resolved-tokens: [${selectors.map(s => `(selector: "${s}", tokens: ())`).join(',\n')}];`;
}

/** Compiles `theming.scss` for an artefact containing `artefactThemes`. `optedIn` overrides `$expressive-motion-themes`. */
function compile(artefactThemes: string[], optedIn?: string[]): string {
  const withClause = optedIn ? ` with ($expressive-motion-themes: (${optedIn.map(s => `'${s}'`).join(', ')},))` : '';
  const source = `
    @use 'theming' as theming${withClause};
    .target {
      @include theming.expressive-motion-only { color: red; }
      @include theming.expressive-motion-only('${MODE_SELECTOR}') { animation: none; }
    }
  `;

  return sass.compileString(source, {
    style: 'compressed',
    importers: [
      {
        canonicalize(url: string) {
          if (url === 'theming') {
            return new URL('mem:theming');
          }
          if (url === 'awsui:resolved-tokens') {
            return new URL('mem:resolved-tokens');
          }
          return null;
        },
        load(canonicalUrl: URL) {
          if (canonicalUrl.href === 'mem:theming') {
            return { contents: THEMING_SOURCE, syntax: 'scss' as const };
          }
          if (canonicalUrl.href === 'mem:resolved-tokens') {
            return { contents: resolvedTokensStub(artefactThemes), syntax: 'scss' as const };
          }
          return null;
        },
      },
    ],
  }).css;
}

/** Returns list of selectors after stripping `:global(...)` */
function selectorsOf(css: string): string[] {
  return Array.from(css.matchAll(/([^{}]+)\{/g))
    .map(m => m[1].trim().replace(/:global\(([^)]*)\)/g, '$1'))
    .filter(Boolean);
}

/**
 * Renders the theme (plus `extraClasses`) on `<body>` with the target inside, and returns the target.
 * With `nestMode`, `extraClasses` go on a wrapper div between body and target instead.
 */
function renderTarget(theme: string, extraClasses: string[] = [], nestMode = false): Element {
  const classNames = (selectors: string[]) => selectors.filter(s => s.startsWith('.')).map(s => s.slice(1));
  document.body.className = '';
  document.body.innerHTML = '';
  document.body.classList.add(...classNames(nestMode ? [theme] : [theme, ...extraClasses]));

  const target = document.createElement('div');
  target.className = 'target';
  let parent: Element = document.body;
  if (nestMode) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(...classNames(extraClasses));
    document.body.appendChild(wrapper);
    parent = wrapper;
  }
  parent.appendChild(target);
  return target;
}

describe('expressive-motion gate: opt-in', () => {
  test('emits nothing when no theme in the artefact has opted in', () => {
    expect(compile([THEME_SELECTOR_C, THEME_SELECTOR_A], [THEME_SELECTOR_B])).toBe('');
  });

  test('emits nothing when the artefact contains no themes at all', () => {
    expect(compile([], [THEME_SELECTOR_B])).toBe('');
  });

  test('a substring-similar selector does not opt in by accident', () => {
    expect(compile([THEME_SELECTOR_C], [THEME_SELECTOR_B])).toBe('');
  });

  test('emits exactly the themed + guarded rule per opted-in theme, nothing for a sibling that did not opt in', () => {
    const selectors = selectorsOf(
      compile([THEME_SELECTOR_A, THEME_SELECTOR_B, THEME_SELECTOR_C], [THEME_SELECTOR_A, THEME_SELECTOR_B])
    );

    expect(selectors.filter(s => s.startsWith(THEME_SELECTOR_A))).toHaveLength(2);
    expect(selectors.filter(s => s.startsWith(THEME_SELECTOR_B))).toHaveLength(2);
    expect(selectors.filter(s => s.startsWith(THEME_SELECTOR_C))).toHaveLength(0);
  });
});

describe.each([
  ['element selector theme (A)', THEME_SELECTOR_A],
  ['class selector theme (B)', THEME_SELECTOR_B],
])('expressive-motion gate: %s composition', (_label, theme) => {
  const selectors = selectorsOf(compile([THEME_SELECTOR_B, THEME_SELECTOR_A], [THEME_SELECTOR_B, THEME_SELECTOR_A]));
  const guard = selectors.find(s => s.startsWith(`${theme}${MODE_SELECTOR}`));
  const themedOnly = selectors.find(s => s.startsWith(theme) && !s.includes(MODE_SELECTOR));

  test('theme selector composes before the mode selector, and the compound matches real DOM', () => {
    expect(guard).toBeDefined();
    expect(renderTarget(theme, [MODE_SELECTOR]).matches(guard!)).toBe(true);
  });

  test('the guard does not match when the mode is off', () => {
    expect(renderTarget(theme).matches(guard!)).toBe(false);
  });

  test('the theme-only rule matches when just the theme is present', () => {
    expect(themedOnly).toBeDefined();
    expect(renderTarget(theme).matches(themedOnly!)).toBe(true);
  });
});

test('the mode selector compounds onto the theme element, rather than nesting as a separate ancestor', () => {
  const guard = selectorsOf(compile([THEME_SELECTOR_B], [THEME_SELECTOR_B])).find(s =>
    s.startsWith(`${THEME_SELECTOR_B}${MODE_SELECTOR}`)
  )!;
  expect(renderTarget(THEME_SELECTOR_B, [MODE_SELECTOR], true).matches(guard)).toBe(false);
});

describe('expressive-motion gate: default configuration', () => {
  test('ships with One Theme opted in by default (pin this if it ever changes intentionally)', () => {
    expect(compile(['.awsui-one-theme'])).not.toBe('');
    expect(compile([THEME_SELECTOR_B])).toBe('');
  });
});
