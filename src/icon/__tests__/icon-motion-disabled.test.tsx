// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import Link from '../../../lib/components/link';

import { hoverRules, splitAtTrigger, splitCompounds, splitSelectorList, stripSpecificityHack } from './motion-css';

/**
 * A disabled control must not react to hover. `:hover` DOES match a disabled element, so
 * this is not automatic — it was verified in Chromium that without an explicit guard a
 * `<button disabled>` and a live `<button aria-disabled="true">` both animated.
 *
 * These tests read the REAL built selectors and assert they do not match a REAL disabled
 * control in the DOM. Asserting that a `:not()` appears in the CSS text would not be
 * enough: it would pass even if the guard were attached to the wrong compound, or matched
 * `aria-disabled="false"` and so suppressed motion on enabled controls.
 *
 * jsdom never matches `:hover`/`:focus-visible`, so those pseudo-classes are stripped and
 * the remaining region compound is asserted. That is sound: the guard sits on the same
 * compound as `:hover`, so if `<region>…:not(:disabled)` does not match, neither can
 * `<region>…:not(:disabled):hover`.
 *
 * The region is an explicit per-component opt-in attribute, not the old implicit tag/role
 * list, and its value is a whitespace-separated list of trigger names matched with `~=` (a
 * full token match, not a substring) — `data-awsui-motion-trigger="hover"`, with `"focus"` as
 * an independent token an element can add for the separate focus role.
 */

/** The region compounds the motion rules hover on, with the pseudo-classes removed. */
function regionCompounds(): string[] {
  const compounds = new Set<string>();
  for (const { selector: selectorList } of hoverRules()) {
    for (const selector of splitSelectorList(selectorList)) {
      // Selectors read `<theme> <region>:hover <icon> > svg` — the region is the compound
      // carrying the pseudo-class, not the theme scope. `splitAtTrigger` is depth-aware so the
      // folded focus branch's nested `:is(...)`/`:has(...)` isn't shattered by a naive strip.
      const region = splitCompounds(selector).find(part => /:hover|:focus-visible/.test(part));
      if (region) {
        compounds.add(splitAtTrigger(stripSpecificityHack(region))!.region);
      }
    }
  }
  return Array.from(compounds);
}

const COMPOUNDS = regionCompounds();

/** Matches if ANY emitted region compound matches — i.e. the icon would animate. */
function wouldAnimate(host: Element): boolean {
  return COMPOUNDS.some(compound => host.matches(compound));
}

function hostOf(element: React.ReactElement): Element {
  const { container } = render(element);
  return container.querySelector('[data-awsui-motion-trigger]')!;
}

function rawHost(tag: string, attributes: Record<string, string>): Element {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  document.body.appendChild(element);
  return element;
}

describe('region guard: emitted selectors', () => {
  test('the built CSS actually contains a hover region to check', () => {
    expect(COMPOUNDS.length).toBeGreaterThan(0);
  });

  test('the armed region carries both disabled guards', () => {
    for (const compound of COMPOUNDS) {
      expect(compound).toContain(':not(:disabled)');
      // postcss normalises the quotes away, so accept either form.
      expect(compound).toMatch(/:not\(\[aria-disabled=("?)true\1\]\)/);
    }
  });

  test('the region is the explicit opt-in attribute, not the old implicit tag/role list', () => {
    expect(COMPOUNDS).toHaveLength(1);
    expect(COMPOUNDS[0]).toContain('data-awsui-motion-trigger');
    expect(COMPOUNDS[0]).not.toContain(':is(');
    expect(COMPOUNDS[0]).not.toMatch(/[^-]\bbutton\b/);
    expect(COMPOUNDS[0]).not.toContain('[role=');
  });

  test('the attribute is matched by VALUE now — a token match on "hover", not bare presence', () => {
    // postcss normalises the quotes away, so accept either `~="hover"` or `~=hover`.
    expect(COMPOUNDS[0]).toMatch(/\[data-awsui-motion-trigger~=("?)hover\1\]/);
    // A bare presence selector (no `~=` at all) would mean the trigger no longer names itself.
    expect(COMPOUNDS[0]).not.toMatch(/\[data-awsui-motion-trigger\]/);
  });

  test('a single attribute selector carries the guard once, same as the old grouped :is()', () => {
    expect(COMPOUNDS[0]).toMatch(/^\[data-awsui-motion-trigger~=("?)hover\1\]:not\(:disabled\)/);
  });
});

describe('region guard: real Buttons and Links', () => {
  test('an enabled Button animates', () => {
    expect(wouldAnimate(hostOf(<Button iconName="settings" ariaLabel="x" />))).toBe(true);
  });

  test('an enabled Button rendered as an anchor animates', () => {
    expect(wouldAnimate(hostOf(<Button iconName="settings" ariaLabel="x" href="#" />))).toBe(true);
  });

  test('an enabled Link animates', () => {
    expect(wouldAnimate(hostOf(<Link href="#" external={true} ariaLabel="external link" />))).toBe(true);
  });

  test('a real Button actually renders the "hover" token, not a bare attribute', () => {
    expect(hostOf(<Button iconName="settings" ariaLabel="x" />).getAttribute('data-awsui-motion-trigger')).toBe(
      'hover'
    );
  });

  // Each of these renders a different disabled mechanism; none may animate.
  test.each([
    ['native disabled <button>', () => <Button iconName="settings" ariaLabel="x" disabled={true} />],
    [
      'disabled with reason (live button, aria-disabled)',
      () => <Button iconName="settings" ariaLabel="x" disabled={true} disabledReason="no" />,
    ],
    ['loading (live button, aria-disabled)', () => <Button iconName="settings" ariaLabel="x" loading={true} />],
    ['disabled anchor', () => <Button iconName="settings" ariaLabel="x" href="#" disabled={true} />],
    [
      'disabled anchor with reason',
      () => <Button iconName="settings" ariaLabel="x" href="#" disabled={true} disabledReason="no" />,
    ],
    ['disabled link variant', () => <Button variant="link" iconName="settings" ariaLabel="x" disabled={true} />],
  ])('%s does not animate', (_label, createElement) => {
    expect(wouldAnimate(hostOf((createElement as () => React.ReactElement)()))).toBe(false);
  });
});

describe('region guard: the attribute is what makes a region, not the tag or role', () => {
  test('a plain <button> without the opt-in attribute does not animate', () => {
    expect(wouldAnimate(rawHost('button', {}))).toBe(false);
  });

  test('a plain <a href> without the opt-in attribute does not animate', () => {
    expect(wouldAnimate(rawHost('a', { href: '#' }))).toBe(false);
  });

  test('a <div role="button"> without the opt-in attribute does not animate', () => {
    expect(wouldAnimate(rawHost('div', { role: 'button' }))).toBe(false);
  });

  test('a non-interactive <div data-awsui-motion-trigger="hover"> DOES animate', () => {
    // The case the new design exists to support: a container with no interactive semantics
    // at all (an action-card-style wrapper) can still be a motion region.
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'hover' }))).toBe(true);
  });
});

/**
 * The value is a whitespace-separated list of trigger names, matched with `~=` — a full
 * token match, not presence and not a substring.
 */
describe('region guard: the attribute value is a token list, matched with ~=', () => {
  test('(a) "hover" animates', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'hover' }))).toBe(true);
  });

  test('(b) "hover press" animates — token match, not exact match', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'hover press' }))).toBe(true);
  });

  test('(b, order-independent) "press hover" also animates', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'press hover' }))).toBe(true);
  });

  test('(c) "press" alone does NOT animate', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'press' }))).toBe(false);
  });

  test('(d) an empty-string value does NOT animate', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': '' }))).toBe(false);
  });

  test('(d) a bare valueless attribute does NOT animate', () => {
    const element = document.createElement('div');
    element.toggleAttribute('data-awsui-motion-trigger', true);
    document.body.appendChild(element);
    expect(element.getAttribute('data-awsui-motion-trigger')).toBe('');
    expect(wouldAnimate(element)).toBe(false);
  });

  test('(e) "hovering" does NOT animate — proves this is ~=, not *=/^=', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'hovering' }))).toBe(false);
  });

  test('(e, prefix form) "hover-only" does NOT animate either', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'hover-only' }))).toBe(false);
  });

  test('(f) "hover focus" satisfies the hover region requirement too — one element owning both roles', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'hover focus' }))).toBe(true);
  });

  test('(g) "focus" alone does NOT satisfy the hover region — the two roles are independent tokens', () => {
    expect(wouldAnimate(rawHost('div', { 'data-awsui-motion-trigger': 'focus' }))).toBe(false);
  });
});

describe('region guard: raw markup shapes used elsewhere in the library', () => {
  test('a live button marked aria-disabled does not animate (Table disabled inline editor)', () => {
    // body-cell/disabled-inline-editor.tsx keeps the button focusable and marks it
    // disabled only to assistive tech, so `:disabled` alone would miss it.
    expect(wouldAnimate(rawHost('button', { 'data-awsui-motion-trigger': 'hover', 'aria-disabled': 'true' }))).toBe(
      false
    );
  });

  test('role="button" marked aria-disabled does not animate', () => {
    expect(
      wouldAnimate(rawHost('div', { role: 'button', 'data-awsui-motion-trigger': 'hover', 'aria-disabled': 'true' }))
    ).toBe(false);
  });

  test('an ENABLED control that renders aria-disabled="false" still animates', () => {
    // Several call sites pass a boolean (`aria-disabled={disabled}`) and React stringifies
    // aria-*, so an enabled control renders `aria-disabled="false"`. A bare
    // `[aria-disabled]` guard would wrongly silence these.
    expect(wouldAnimate(rawHost('button', { 'data-awsui-motion-trigger': 'hover', 'aria-disabled': 'false' }))).toBe(
      true
    );
  });

  test('an anchor is unaffected by the :disabled clause it can never match', () => {
    // `<a>` is not a form control, so `:not(:disabled)` is always true for it. The clause
    // is harmless rather than load-bearing here, and must not exclude enabled anchors.
    expect(wouldAnimate(rawHost('a', { 'data-awsui-motion-trigger': 'hover', href: '#' }))).toBe(true);
  });

  test('a plain disabled button is excluded by the native clause alone', () => {
    expect(wouldAnimate(rawHost('button', { 'data-awsui-motion-trigger': 'hover', disabled: '' }))).toBe(false);
  });
});
