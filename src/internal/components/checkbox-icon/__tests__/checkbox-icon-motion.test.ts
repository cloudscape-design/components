// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { compileMotionScss, ONE_THEME as THEME } from '../../../../__tests__/compile-motion-scss';

/** Compiles `motion.scss`, applying its `draw-in` mixin to a `.styled-line` rule. */
function compile(artefactThemes: string[]): string {
  return compileMotionScss({
    entry: `@use 'motion' as motion;\n.styled-line { @include motion.draw-in; }`,
    artefactThemes,
    files: { motion: 'internal/components/checkbox-icon/motion.scss' },
  });
}

describe('checkbox draw-in animation, as compiled', () => {
  test('emits nothing for an artefact with no opted-in theme', () => {
    expect(compile([])).toBe('');
  });

  test('emits the animation and its keyframes, scoped to the theme, once the theme opts in', () => {
    const css = compile([THEME]);
    expect(css).toMatch(/@keyframes awsui-checkbox-draw\s*\{/);
    expect(css).toContain('animation: awsui-checkbox-draw');
    expect(css).toContain(
      `:global(${THEME}:not(.awsui-motion-disabled):not(.awsui-mode-entering)) .styled-line[data-awsui-motion-ready]`
    );
  });

  test('reduced motion is one wrapping media query, not a per-rule override', () => {
    const css = compile([THEME]);
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(1);
    expect(css).not.toMatch(/animation:\s*none/);
  });

  test('never sets a negative stroke-dashoffset (Safari mishandles them)', () => {
    const css = compile([THEME]);
    expect(css).toMatch(/stroke-dashoffset/);
    expect(css).not.toMatch(/stroke-dashoffset:\s*-/);
  });
});
