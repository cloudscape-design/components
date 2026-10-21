// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  compileMotionScss,
  EXPRESSIVE_MOTION_SCOPE,
  ONE_THEME as THEME,
  sharedStubs,
} from '../../__tests__/compile-motion-scss';

const SCOPE = `:global(${EXPRESSIVE_MOTION_SCOPE})`;

/** Compiles `motion.scss`, applying its mixins to the track and handle rules the way `styles.scss` does. */
function compile(artefactThemes: string[]): string {
  return compileMotionScss({
    entry: `@use 'motion' as motion;
      .toggle-control { @include motion.control; }
      .toggle-handle { @include motion.handle(12px, 8px); }`,
    artefactThemes,
    files: { motion: 'toggle/motion.scss' },
    inline: {
      styles: sharedStubs.styles,
      // Later declarations win, so the values this test asserts on go after the shared stub.
      tokens: `
        ${sharedStubs.tokens}
        $motion-duration-fast: 90ms;
        $motion-duration-refresh-only-medium: 165ms;
        $motion-easing-refresh-only-a: cubic-bezier(0, 0, 0, 1);
      `,
    },
  });
}

describe('toggle motion, as compiled', () => {
  test('emits nothing for an artefact with no opted-in theme', () => {
    expect(compile([])).toBe('');
  });

  test('moves the handle and crosses the colours over on one duration and curve', () => {
    const css = compile([THEME]);
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)} \\.toggle-handle \\{\\s*transition:\\s*translate 90ms cubic-bezier\\(0, 0, 0, 1\\),\\s*background-color 90ms cubic-bezier\\(0, 0, 0, 1\\);`
      )
    );
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)} \\.toggle-control \\{\\s*transition: background-color 90ms cubic-bezier\\(0, 0, 0, 1\\);`
      )
    );
  });

  test('moves the handle with `translate`, so the tail animation cannot override the travel', () => {
    const css = compile([THEME]);
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)} \\.toggle-handle\\.toggle-handle-checked \\{\\s*transform: none;\\s*translate: 8px 0;`
      )
    );
    expect(css).toMatch(
      new RegExp(`${escape(SCOPE)} \\.toggle-handle\\.toggle-handle-checked:dir\\(rtl\\) \\{\\s*translate: -8px 0;`)
    );
  });

  test('plays the follow-through tail only once the state has changed, picking the direction from the checked class', () => {
    const css = compile([THEME]);
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)} \\.toggle-handle\\[data-awsui-motion-ready\\] \\{\\s*animation: awsui-toggle-tail-off 165ms cubic-bezier\\(0, 0, 0, 1\\);`
      )
    );
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)} \\.toggle-handle\\[data-awsui-motion-ready\\]\\.toggle-handle-checked \\{\\s*animation-name: awsui-toggle-tail-on;`
      )
    );
    expect(css).not.toMatch(/\.toggle-handle \{\s*animation/);
  });

  test('the tail stretches the handle with a transform, pinned at the leading edge', () => {
    const css = compile([THEME]);
    const on = css.match(/@keyframes awsui-toggle-tail-on \{[^@]*?\n\}/)![0];
    const off = css.match(/@keyframes awsui-toggle-tail-off \{[^@]*?\n\}/)![0];
    for (const block of [on, off]) {
      expect(block).toMatch(/0%,\s*100% \{\s*scale: 1;\s*\}/);
      expect(block).toMatch(/35% \{\s*scale: 1\.33\d* 1;\s*\}/);
      expect(block).not.toMatch(/inline-size|margin|transform:/);
    }
    const ready = `${escape(SCOPE)} \\.toggle-handle\\[data-awsui-motion-ready\\]`;
    expect(css).toMatch(new RegExp(`${ready} \\{[^}]*transform-origin: 0 50%;`));
    expect(css).toMatch(new RegExp(`${ready}:dir\\(rtl\\) \\{\\s*transform-origin: 100% 50%;`));
    expect(css).toMatch(new RegExp(`${ready}\\.toggle-handle-checked \\{[^}]*transform-origin: 100% 50%;`));
    expect(css).toMatch(new RegExp(`${ready}\\.toggle-handle-checked:dir\\(rtl\\) \\{\\s*transform-origin: 0 50%;`));
  });

  test('every motion rule sits in a reduced-motion media query, with no per-rule override', () => {
    const css = compile([THEME]);
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(8);
    expect(css).not.toMatch(/(animation|transition):\s*none/);
  });
});

function escape(literal: string) {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
