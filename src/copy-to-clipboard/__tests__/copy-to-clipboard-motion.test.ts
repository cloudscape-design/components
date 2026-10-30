// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  compileMotionScss,
  EXPRESSIVE_MOTION_SCOPE,
  ONE_THEME as THEME,
  sharedStubs,
} from '../../__tests__/compile-motion-scss';

const SCOPE = `:global(${EXPRESSIVE_MOTION_SCOPE})`;

function compile(artefactThemes: string[]): string {
  return compileMotionScss({
    entry: `@use 'motion' as motion;
      .icon-swap-copy { @include motion.entering-with-motion; }
      .icon-swap-result { @include motion.exiting-with-motion; }
      .icon-swap-copied > .icon-swap-copy { @include motion.exiting-with-motion; }
      .icon-swap-copied > .icon-swap-result { @include motion.entering-with-motion; }`,
    artefactThemes,
    files: { motion: 'copy-to-clipboard/motion.scss' },
    inline: {
      tokens: `
        ${sharedStubs.tokens}
        $motion-duration-refresh-only-fast: 115ms;
        $motion-duration-refresh-only-medium: 165ms;
        $motion-easing-refresh-only-a: cubic-bezier(0, 0, 0, 1);
        $motion-easing-refresh-only-b: cubic-bezier(1, 0, 1, 1);
      `,
    },
  });
}

describe('copy-to-clipboard glyph swap motion, as compiled', () => {
  test('emits nothing for an artefact with no opted-in theme', () => {
    expect(compile([])).toBe('');
  });

  test('scopes every swap transition to the opted-in theme with motion enabled, once the theme opts in', () => {
    const css = compile([THEME]);
    for (const selector of [
      '.icon-swap-copy',
      '.icon-swap-result',
      '.icon-swap-copied > .icon-swap-copy',
      '.icon-swap-copied > .icon-swap-result',
    ]) {
      expect(css.match(new RegExp(`${escape(`${SCOPE} ${selector} {`)}\\s*transition-property`, 'g'))).toHaveLength(1);
    }
  });

  test('the resting copy glyph and the arriving result glyph wait for the exit, then ease in', () => {
    const css = compile([THEME]);
    const entering = new RegExp(
      `\\{\\s*transition-property: opacity, transform;\\s*transition-duration: 165ms;\\s*transition-timing-function: cubic-bezier\\(0, 0, 0, 1\\);\\s*transition-delay: 115ms;`
    );
    for (const selector of ['.icon-swap-copy', '.icon-swap-copied > .icon-swap-result']) {
      expect(css).toMatch(new RegExp(`${escape(`${SCOPE} ${selector} `)}${entering.source}`));
    }
  });

  test('the leaving glyph accelerates out immediately', () => {
    const css = compile([THEME]);
    const exiting = new RegExp(
      `\\{\\s*transition-property: opacity, transform;\\s*transition-duration: 115ms;\\s*transition-timing-function: cubic-bezier\\(1, 0, 1, 1\\);\\s*transition-delay: 0s;`
    );
    for (const selector of ['.icon-swap-result', '.icon-swap-copied > .icon-swap-copy']) {
      expect(css).toMatch(new RegExp(`${escape(`${SCOPE} ${selector} `)}${exiting.source}`));
    }
  });

  test('every swap transition sits in a reduced-motion media query, with no per-rule override', () => {
    const css = compile([THEME]);
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(4);
    expect(css).not.toMatch(/transition:\s*none/);
  });
});

function escape(literal: string) {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
