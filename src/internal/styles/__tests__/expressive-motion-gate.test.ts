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
const KEYFRAMES = '@keyframes fade{from{opacity:0}}'; // what `compileKeyframes` emits when the gate opens

function resolvedTokensStub(selectors: string[]) {
  return `$resolved-tokens: [${selectors.map(s => `(selector: "${s}", tokens: ())`).join(',\n')}];`;
}

/** Compiles `body` against `theming.scss` for an artefact containing `artefactThemes`. `optedIn` overrides `$expressive-motion-themes`. */
function compileScss(body: string, artefactThemes: string[], optedIn?: string[]): string {
  const withClause = optedIn ? ` with ($expressive-motion-themes: (${optedIn.map(s => `'${s}'`).join(', ')},))` : '';
  const source = `@use 'theming' as theming${withClause};\n${body}`;

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

/** Compiles the `expressive-motion-only` mixin, both unguarded and guarded by `MODE_SELECTOR`. */
function compileMixin(artefactThemes: string[], optedIn?: string[]): string {
  return compileScss(
    `.target {
      @include theming.expressive-motion-only { color: red; }
      @include theming.expressive-motion-only('${MODE_SELECTOR}') { animation: none; }
    }`,
    artefactThemes,
    optedIn
  );
}

/** Compiles `@keyframes` gated by the `has-expressive-motion` function, the other half of the opt-in gate. */
function compileKeyframes(artefactThemes: string[], optedIn?: string[]): string {
  return compileScss(
    `@if theming.has-expressive-motion() {
      @keyframes fade { from { opacity: 0; } }
    }`,
    artefactThemes,
    optedIn
  );
}

/** Renders the theme (plus `extraClasses`) on `<body>` with the target inside, and returns the target. */
function renderTarget(theme: string, extraClasses: string[] = []): Element {
  document.body.className = '';
  document.body.innerHTML = '';
  document.body.classList.add(...[theme, ...extraClasses].filter(s => s.startsWith('.')).map(s => s.slice(1)));

  const target = document.createElement('div');
  target.className = 'target';
  document.body.appendChild(target);
  return target;
}

describe('expressive-motion gate: opt-in', () => {
  test('emits nothing when the opted-in theme is absent from the artefact', () => {
    expect(compileMixin([THEME_SELECTOR_C, THEME_SELECTOR_A], [THEME_SELECTOR_B])).toBe('');
    expect(compileKeyframes([THEME_SELECTOR_C, THEME_SELECTOR_A], [THEME_SELECTOR_B])).toBe('');
  });

  test('a substring-similar selector does not opt in by accident', () => {
    expect(compileMixin([THEME_SELECTOR_C], [THEME_SELECTOR_B])).toBe('');
    expect(compileKeyframes([THEME_SELECTOR_C], [THEME_SELECTOR_B])).toBe('');
  });

  test('emits exactly the themed + guarded rule per opted-in theme, nothing for a sibling that did not opt in', () => {
    const artefact = [THEME_SELECTOR_A, THEME_SELECTOR_B, THEME_SELECTOR_C];
    const optedIn = [THEME_SELECTOR_A, THEME_SELECTOR_B];

    // both opted-in themes share one rule per mixin call, and theme C appears nowhere
    expect(compileMixin(artefact, optedIn)).toBe(
      `:global(${THEME_SELECTOR_A}) .target,:global(${THEME_SELECTOR_B}) .target{color:red}` +
        `:global(${THEME_SELECTOR_A}${MODE_SELECTOR}) .target,` +
        `:global(${THEME_SELECTOR_B}${MODE_SELECTOR}) .target{animation:none}`
    );
    expect(compileKeyframes(artefact, optedIn)).toBe(KEYFRAMES);
  });
});

describe('expressive-motion gate: composition', () => {
  // `:global(...)` is a CSS-modules compile-time marker; strip it to get selectors a real DOM can match
  const emitted = compileMixin([THEME_SELECTOR_B, THEME_SELECTOR_A], [THEME_SELECTOR_B, THEME_SELECTOR_A]).replace(
    /:global\(([^)]*)\)/g,
    '$1'
  );

  test.each([
    ['element selector theme (A)', THEME_SELECTOR_A],
    ['class selector theme (B)', THEME_SELECTOR_B],
  ])('%s: emitted selectors match the real DOM only under the right conditions', (_label, theme) => {
    const themeRule = `${theme} .target`;
    const modeRule = `${theme}${MODE_SELECTOR} .target`;

    // tie the assertions below to what the mixin actually emitted
    expect(emitted).toContain(themeRule);
    expect(emitted).toContain(modeRule);

    // the guarded rule applies once the mode is on
    expect(renderTarget(theme, [MODE_SELECTOR]).matches(modeRule)).toBe(true);
    // but must not leak when the mode is off, otherwise the guard argument is being ignored
    expect(renderTarget(theme).matches(modeRule)).toBe(false);
    // the unguarded rule applies on the theme alone
    expect(renderTarget(theme).matches(themeRule)).toBe(true);
  });
});

describe('expressive-motion gate: default configuration', () => {
  test('ships with One Theme opted in by default (pin this if it ever changes intentionally)', () => {
    // One Theme is the shipped default
    expect(compileMixin(['.awsui-one-theme'])).not.toBe('');
    expect(compileKeyframes(['.awsui-one-theme'])).toBe(KEYFRAMES);
    // any other theme has to opt in
    expect(compileMixin([THEME_SELECTOR_B])).toBe('');
    expect(compileKeyframes([THEME_SELECTOR_B])).toBe('');
  });
});
