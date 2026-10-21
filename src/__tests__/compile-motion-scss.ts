// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sass from 'sass';

const SRC_ROOT = path.resolve(__dirname, '..');

/** The theme that opts in to expressive motion in `internal/styles/utils/theming.scss`. */
export const ONE_THEME = '.awsui-one-theme';

/** How the `expressive-motion-only` mixin scopes a rule: opted-in theme, minus the motion-off states. */
export const EXPRESSIVE_MOTION_SCOPE = `${ONE_THEME}:not(.awsui-motion-disabled):not(.awsui-mode-entering)`;

export interface CompileMotionScssOptions {
  /** Sass entry point. Modules are referenced by their file name without extension, e.g. `@use 'motion';`. */
  entry: string;
  /**
   * Theme selectors present in the artefact (`awsui:resolved-tokens`). Only themes listed here
   * AND in `$expressive-motion-themes` get expressive motion.
   */
  artefactThemes: string[];
  /** Real SCSS modules to serve, keyed by module name, valued by path relative to `src/`. */
  files?: Record<string, string>;
  /**
   * Modules to serve from a string, keyed by module name: stubs for shared modules the file under
   * test `@use`s but the test does not care about, or a patched copy of a real module.
   */
  inline?: Record<string, string>;
  style?: sass.OutputStyle;
}

/**
 * Compiles an SCSS entry against the real `theming.scss`, with every other module served
 * from memory. dart-sass's filesystem importer crashes under jest's jsdom environment, so
 * nothing is resolved from disk at compile time.
 *
 * A module is matched by the last path segment of its `@use` url, so `'motion'` serves
 * `@use './motion'` and `@use '../../components/x/motion'` alike.
 */
export function compileMotionScss({ entry, artefactThemes, files = {}, inline = {}, style }: CompileMotionScssOptions) {
  const modules: Record<string, string> = {
    theming: readSource('internal/styles/utils/theming.scss'),
    ...Object.fromEntries(Object.entries(files).map(([name, file]) => [name, readSource(file)])),
    ...inline,
  };

  return sass.compileString(entry, {
    style,
    importers: [
      {
        canonicalize(url: string) {
          if (url.startsWith('awsui:')) {
            return new URL('mem:resolved-tokens');
          }
          const name = url.split('/').pop()!;
          return name in modules ? new URL(`mem:${name}`) : null;
        },
        load(canonicalUrl: URL) {
          const name = canonicalUrl.href.slice('mem:'.length);
          const contents = name === 'resolved-tokens' ? resolvedTokensStub(artefactThemes) : modules[name];
          return { contents, syntax: 'scss' as const };
        },
      },
    ],
  }).css;
}

/** Reads an SCSS source file, `file` relative to `src/`. */
export function readSource(file: string): string {
  return fs.readFileSync(path.join(SRC_ROOT, file), 'utf8');
}

/** The `awsui:resolved-tokens` module for an artefact built with the given theme selectors. */
export function resolvedTokensStub(themeSelectors: string[]): string {
  return `$resolved-tokens: [${themeSelectors.map(s => `(selector: "${s}", tokens: ())`).join(',\n')}];`;
}

/** `:global(...)` is a CSS-modules compile-time marker; strip it to get selectors a real DOM can match. */
export function stripGlobal(css: string): string {
  return css.replace(/:global\(([^)]*)\)/g, '$1');
}

/** Stubs for shared modules that motion files `@use` for gating and tokens but that tests do not exercise. */
export const sharedStubs = {
  /** `internal/styles`: `with-motion` passes content through unchanged, `with-direction` emits `:dir()`. */
  styles: `
    @mixin with-motion { @content; }
    @mixin with-direction($direction) { &:dir(#{$direction}) { @content; } }
    @mixin animation-fade-in {}
  `,
  /** `internal/styles/tokens`: the motion tokens referenced by the files under test, with throwaway values. */
  tokens: `
    $motion-duration-complex: 250ms;
    $motion-duration-show-paced: 1ms;
    $motion-easing-show-paced: linear;
    $motion-duration-refresh-only-fast: 1ms;
    $motion-easing-refresh-only-a: linear;
  `,
};
