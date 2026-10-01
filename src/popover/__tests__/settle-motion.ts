// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { compileMotionScss, ONE_THEME, sharedStubs, stripGlobal } from '../../__tests__/compile-motion-scss';
import styles from '../../../lib/components/popover/styles.selectors.js';

/** Compiles `popover/motion.scss` for an artefact built with the given themes. */
export function compilePopoverMotion(artefactThemes: string[]): string {
  return compileMotionScss({
    entry: `@use 'motion';`,
    artefactThemes,
    files: { motion: 'popover/motion.scss' },
    inline: sharedStubs,
  });
}

interface SettleRule {
  /** Selector as the browser sees it: `:global()` unwrapped, class names hashed, `:dir()` removed. */
  selector: string;
  /** Text direction the rule is limited to, from its `:dir()` pseudo-class, if any. */
  direction?: 'ltr' | 'rtl';
  /** Travel direction: `down`, `up`, `end`, or `start`. */
  travel: string;
}

let settleRules: SettleRule[] | undefined;

/** Every compiled rule that assigns a settle animation, in source order, for the opted-in theme. */
function getSettleRules(): SettleRule[] {
  if (!settleRules) {
    const css = compilePopoverMotion([ONE_THEME]);
    settleRules = [];
    for (const match of css.matchAll(/^\s*([^{}\n]+) \{\s*animation(?:-name)?: awsui-popover-settle-(\w+)/gm)) {
      const direction = match[1].match(/:dir\((ltr|rtl)\)/)?.[1] as SettleRule['direction'];
      settleRules.push({ selector: toRuntimeSelector(match[1]), direction, travel: match[2] });
    }
  }
  return settleRules;
}

function toRuntimeSelector(selector: string): string {
  return (
    stripGlobal(selector)
      // jsdom's selector engine misjudges `:dir()` when it shares a compound with `:has()`,
      // so direction is checked separately in `resolveSettleDirection`.
      .replace(/:dir\((?:ltr|rtl)\)/g, '')
      .replace(/\.(container(?:-arrow-position-[\w-]+)?)(?![\w-])/g, (_, name: string) => `.${styles[name]}`)
  );
}

function getTextDirection(element: Element): 'ltr' | 'rtl' {
  return element.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
}

/**
 * Resolves which settle animation the compiled stylesheet would apply to `element`, or `null`
 * if none. All settle rules are on the same element and each later rule is more specific than
 * the one before it, so the last matching rule wins.
 */
export function resolveSettleDirection(element: Element): string | null {
  const textDirection = getTextDirection(element);
  let winner: string | null = null;
  for (const rule of getSettleRules()) {
    if ((!rule.direction || rule.direction === textDirection) && element.matches(rule.selector)) {
      winner = rule.travel;
    }
  }
  return winner;
}
