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
const MODE_SELECTOR = '.test-reduce-motion';

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
    // each opted-in theme gets exactly its own pair of rules
    expect(selectors.filter(s => s.startsWith(THEME_SELECTOR_B))).toHaveLength(2);
    // a theme present in the artefact but not opted in gets nothing
    expect(selectors.filter(s => s.startsWith(THEME_SELECTOR_C))).toHaveLength(0);
  });
});

describe('expressive-motion gate: composition', () => {
  const selectors = selectorsOf(compile([THEME_SELECTOR_B, THEME_SELECTOR_A], [THEME_SELECTOR_B, THEME_SELECTOR_A]));

  test.each([
    ['element selector theme (A)', THEME_SELECTOR_A],
    ['class selector theme (B)', THEME_SELECTOR_B],
  ])('%s: emitted selectors match the real DOM only under the right conditions', (_label, theme) => {
    const themeRule = `${theme} .target`; // .target comes from the scss definition above
    const modeRule = `${theme}${MODE_SELECTOR} .target`;

    // the mixin emits the unguarded rule for an opted-in theme
    expect(selectors).toContain(themeRule);
    // and the guarded rule, with the mode compounded onto the theme rather than nested under it
    expect(selectors).toContain(modeRule);

    // the guarded rule applies once the mode is on
    expect(renderTarget(theme, [MODE_SELECTOR]).matches(modeRule)).toBe(true);
    // but must not leak when the mode is off, otherwise the guard argument is being ignored
    expect(renderTarget(theme).matches(modeRule)).toBe(false);
    // the unguarded rule applies on the theme alone
    expect(renderTarget(theme).matches(themeRule)).toBe(true);
  });

  test('the mode selector compounds onto the theme element, rather than nesting as a separate ancestor', () => {
    const modeRule = `${THEME_SELECTOR_B}${MODE_SELECTOR} .target`;
    // a mode class on a descendant must not satisfy the compound: both belong on the theme element
    expect(renderTarget(THEME_SELECTOR_B, [MODE_SELECTOR], true).matches(modeRule)).toBe(false);
  });
});

describe('expressive-motion gate: default configuration', () => {
  test('ships with One Theme opted in by default (pin this if it ever changes intentionally)', () => {
    // One Theme is the shipped default
    expect(compile(['.awsui-one-theme'])).not.toBe('');
    // any other theme has to opt in
    expect(compile([THEME_SELECTOR_B])).toBe('');
  });
});
