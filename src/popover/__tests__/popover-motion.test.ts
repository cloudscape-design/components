// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { compilePopoverMotion as compile } from './settle-motion';

import { EXPRESSIVE_MOTION_SCOPE, ONE_THEME as THEME } from '../../__tests__/compile-motion-scss';

const SCOPE = `:global(${EXPRESSIVE_MOTION_SCOPE}) .container`;

describe('popover settle animation, as compiled', () => {
  test('emits nothing of it for an artefact with no opted-in theme', () => {
    const css = compile([]);
    expect(css).not.toContain('awsui-popover-settle');
    expect(css).not.toContain('prefers-reduced-motion: no-preference');
  });

  test('emits one keyframe set per travel direction once the theme opts in', () => {
    const css = compile([THEME]);
    for (const direction of ['down', 'up', 'end', 'start']) {
      expect(css).toMatch(new RegExp(`@keyframes awsui-popover-settle-${direction}\\s*\\{`));
    }
  });

  test('travels away from the trigger, picking the direction from the resolved arrow position', () => {
    const css = compile([THEME]);
    expect(css).toMatch(
      new RegExp(`${escape(SCOPE)} \\{\\s*animation: awsui-popover-settle-down 250ms cubic-bezier\\(0.3, 0, 0.2, 1\\);`)
    );
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)}:has\\(\\.container-arrow-position-top-left, \\.container-arrow-position-top-center, \\.container-arrow-position-top-right\\) \\{\\s*animation-name: awsui-popover-settle-up;`
      )
    );
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)}:has\\(\\.container-arrow-position-right-top, \\.container-arrow-position-right-bottom\\) \\{\\s*animation-name: awsui-popover-settle-end;`
      )
    );
    expect(css).toMatch(
      new RegExp(
        `${escape(SCOPE)}:has\\(\\.container-arrow-position-left-top, \\.container-arrow-position-left-bottom\\) \\{\\s*animation-name: awsui-popover-settle-start;`
      )
    );
  });

  test('swaps the horizontal keyframes in RTL, since right and left are logical placements', () => {
    const css = compile([THEME]);
    expect(css).toMatch(
      /\.container-arrow-position-right-bottom\):dir\(rtl\) \{\s*animation-name: awsui-popover-settle-start;/
    );
    expect(css).toMatch(
      /\.container-arrow-position-left-bottom\):dir\(rtl\) \{\s*animation-name: awsui-popover-settle-end;/
    );
  });

  test('every settle rule sits in a reduced-motion media query', () => {
    const css = compile([THEME]);
    const settleRules = css.match(/animation(-name)?: awsui-popover-settle/g) ?? [];
    expect(settleRules.length).toBe(6);
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)).toHaveLength(6);
    expect(css).not.toMatch(/animation:\s*none/);
  });
});

function escape(literal: string) {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
