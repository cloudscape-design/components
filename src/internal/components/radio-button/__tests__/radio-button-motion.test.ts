// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { compileMotionScss, ONE_THEME as THEME, sharedStubs } from '../../../../__tests__/compile-motion-scss';

/** Compiles `motion.scss`, applying its `select` mixin to a `.styled-circle-fill` rule. */
function compile(artefactThemes: string[]): string {
  return compileMotionScss({
    entry: `@use 'motion' as motion;\n.styled-circle-fill { @include motion.select; }`,
    artefactThemes,
    files: { motion: 'internal/components/radio-button/motion.scss' },
    inline: { tokens: sharedStubs.tokens },
  });
}

describe('radio button select animation, as compiled', () => {
  test('emits nothing for an artefact with no opted-in theme', () => {
    expect(compile([])).toBe('');
  });

  test('emits the animation and its keyframes, scoped to the theme, once the theme opts in', () => {
    const css = compile([THEME]);
    expect(css).toMatch(/@keyframes awsui-radio-select\s*\{/);
    expect(css).toContain('animation: awsui-radio-select');
    expect(css).toContain(
      `:global(${THEME}:not(.awsui-motion-disabled):not(.awsui-mode-entering)) .styled-circle-fill.styled-circle-checked[data-awsui-motion-ready]`
    );
  });

  test('reduced motion is wrapping the animation', () => {
    const css = compile([THEME]);
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(1);
    expect(css).not.toMatch(/animation:\s*none/);
  });
});
