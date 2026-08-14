// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Motion must not run when the document asks for no motion.
 *
 * Suppression is structural rather than an override: the two mode classes are `:not()` clauses
 * on the theme compound, and reduced motion is one wrapping media query. So there is no guard
 * rule to inspect — the thing to assert is that the emitted selector STOPS MATCHING once a mode
 * class is present, which is checked here against real elements.
 *
 * This file exists because the earlier suite could not see this at all: emptying the mode
 * clauses entirely left all 138 tests green while real Chromium showed motion running under
 * `awsui-motion-disabled`. Reintroducing that bug must turn these red.
 */
import { hoverRules, mediaConditions, splitSelectorList, stripSpecificityHack, themeCompounds } from './motion-css';

const COMPOUNDS = themeCompounds();

function bodyWith(...classes: string[]): Element {
  const element = document.createElement('div');
  element.className = classes.join(' ');
  document.body.appendChild(element);
  return element;
}

/** Would motion apply to a document whose root carries these classes? */
const themeScopeMatches = (...classes: string[]) => COMPOUNDS.some(compound => bodyWith(...classes).matches(compound));

describe('motion-off contexts: the theme scope stops matching', () => {
  test('there are theme compounds to check', () => {
    expect(COMPOUNDS.length).toBeGreaterThan(0);
    // Positive control: the helper can observe a match at all, so a negative result below
    // means the selector genuinely excludes the element rather than the helper being broken.
    expect(themeScopeMatches('awsui-one-theme')).toBe(true);
  });

  test('an opted-in theme matches', () => {
    expect(themeScopeMatches('awsui-one-theme')).toBe(true);
  });

  test('awsui-motion-disabled stops it matching', () => {
    expect(themeScopeMatches('awsui-one-theme', 'awsui-motion-disabled')).toBe(false);
  });

  test('awsui-mode-entering stops it matching', () => {
    expect(themeScopeMatches('awsui-one-theme', 'awsui-mode-entering')).toBe(false);
  });

  test('both at once stop it matching', () => {
    expect(themeScopeMatches('awsui-one-theme', 'awsui-motion-disabled', 'awsui-mode-entering')).toBe(false);
  });

  test('a theme that never opted in does not match either', () => {
    expect(themeScopeMatches('awsui-visual-refresh')).toBe(false);
  });

  test('every motion hover rule carries both mode exclusions', () => {
    for (const compound of COMPOUNDS) {
      expect(compound).toContain(':not(.awsui-motion-disabled)');
      expect(compound).toContain(':not(.awsui-mode-entering)');
    }
  });
});

describe('reduced motion is one wrapping media query, not a per-rule override', () => {
  test('the only media condition is the positive reduced-motion form', () => {
    const conditions = mediaConditions();
    expect(conditions).toEqual([{ condition: '(prefers-reduced-motion: no-preference)', count: 1 }]);
  });

  test('no rule re-states a reduced-motion override', () => {
    // The old shape emitted `@media (prefers-reduced-motion: reduce)` next to every animated
    // part. Guard cost must not scale with the number of parts. Matched on the VALUE, because
    // the feature name `prefers-reduced-motion` itself contains the substring "reduce".
    expect(mediaConditions().some(c => /:\s*reduce\b/.test(c.condition))).toBe(false);
  });

  test('no motion-off override rules are emitted at all', () => {
    // Suppression by non-matching means nothing should set `animation: none` under a mode class.
    const overrides = hoverRules().filter(rule =>
      splitSelectorList(rule.selector).some(selector => {
        const stripped = stripSpecificityHack(selector);
        return (
          /\.awsui-motion-disabled|\.awsui-mode-entering/.test(stripped) &&
          !/:not\(\.awsui-motion-disabled\)/.test(stripped)
        );
      })
    );
    expect(overrides).toEqual([]);
  });
});
