// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Shared parsing of the BUILT icon stylesheet for the motion tests.
 *
 * These tests deliberately read the real compiled CSS rather than the SCSS source, because
 * the postcss pipeline rewrites selectors on the way out (it appends a `:not(#\9)`
 * specificity hack and normalises attribute-selector quoting). Asserting against the source
 * would prove nothing about what ships.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const CSS_PATH = path.join(__dirname, '..', '..', '..', 'lib', 'components', 'icon', 'styles.scoped.css');

export interface Rule {
  selector: string;
  body: string;
  rule: string;
}

export const readCss = (): string => fs.readFileSync(CSS_PATH, 'utf8');

/**
 * Splits a selector list on TOP-LEVEL commas only.
 *
 * A naive `split(',')` is wrong as soon as a selector contains a functional pseudo-class:
 * the regions are grouped as `:is(button, a, [role="button"])`, whose internal commas would
 * shatter the selector into unbalanced fragments like `[role=button]):not(:disabled)`. That
 * silently turned every disabled-guard assertion into a test against nonsense.
 */
export function splitSelectorList(selectorList: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';

  for (const character of selectorList) {
    if (character === '(' || character === '[') {
      depth++;
    } else if (character === ')' || character === ']') {
      depth--;
    }

    if (character === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += character;
  }
  parts.push(current);

  return parts.map(part => part.trim()).filter(Boolean);
}

/**
 * Splits a single complex selector into its compounds, on TOP-LEVEL combinators only.
 *
 * As with the comma split, a naive `split(/\s+/)` is wrong once `:is(button, a, [role="button"])`
 * is in play, because that compound contains spaces of its own.
 */
export function splitCompounds(selector: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';

  for (const character of selector) {
    if (character === '(' || character === '[') {
      depth++;
    } else if (character === ')' || character === ']') {
      depth--;
    }

    if (depth === 0 && /[\s>+~]/.test(character)) {
      parts.push(current);
      current = '';
      continue;
    }
    current += character;
  }
  parts.push(current);

  return parts.map(part => part.trim()).filter(Boolean);
}

/** Every rule in the built stylesheet whose selector list contains a hover/focus trigger. */
export function hoverRules(): Rule[] {
  return Array.from(readCss().matchAll(/([^{}]*)\{([^{}]*)\}/g))
    .filter(match => /:hover|:focus-visible/.test(match[1]))
    .map(match => ({ selector: match[1], body: match[2], rule: match[0] }));
}

/**
 * Splits a selector right after the trigger's trailing hover/focus pseudo-class, returning
 * `{ region, tail }` — `tail` is the icon-side portion that decides which element a rule can
 * reach.
 *
 * Depth-aware because a naive `selector.split(/:hover|:focus-visible/)` breaks once the focus
 * branch is folded into `:is(:focus-visible, :has(:focus-visible))`: that literal match fires
 * twice inside the parens, shattering the `:is()` itself, and jsdom's `.matches()` then throws
 * on the malformed remainder.
 */
export function splitAtTrigger(selector: string): { region: string; tail: string } | null {
  const match = selector.match(/:hover\b|:focus-visible\b/);
  if (!match || match.index === undefined) {
    return null;
  }

  if (selector.startsWith(':hover', match.index)) {
    const end = match.index + ':hover'.length;
    return { region: selector.slice(0, match.index), tail: selector.slice(end) };
  }

  // Walk back to the enclosing `:is(`'s opening paren, then forward to its matching close.
  const isStart = selector.lastIndexOf(':is(', match.index);
  if (isStart === -1) {
    throw new Error(`Found :focus-visible outside :is(...) in selector: ${selector}`);
  }
  let depth = 0;
  let i = isStart + ':is('.length - 1;
  do {
    if (selector[i] === '(') {
      depth++;
    } else if (selector[i] === ')') {
      depth--;
    }
    i++;
  } while (depth > 0 && i < selector.length);
  return { region: selector.slice(0, isStart), tail: selector.slice(i) };
}

/**
 * The postcss pipeline appends `:not(#\9)` purely to raise specificity. No element can have
 * that id, so removing it never changes what matches — and jsdom's selector engine refuses
 * to compile the `\9` escape at all.
 */
export const stripSpecificityHack = (selector: string): string => selector.replace(/:not\(#\\9\)/g, '');

/** Every distinct `@media` condition in the built stylesheet, with how many times it appears. */
export function mediaConditions(): Array<{ condition: string; count: number }> {
  const counts = new Map<string, number>();
  for (const match of readCss().matchAll(/@media([^{]+)\{/g)) {
    const condition = match[1].replace(/\s+/g, ' ').trim();
    counts.set(condition, (counts.get(condition) ?? 0) + 1);
  }
  return [...counts].map(([condition, count]) => ({ condition, count }));
}

/**
 * The leading (theme-scope) compound of every motion hover rule.
 *
 * Motion is suppressed by NOT MATCHING rather than by an override, so the mode classes live
 * here rather than on a separate guard rule. That makes this compound the thing to assert
 * against a real element.
 */
export function themeCompounds(): string[] {
  const compounds = new Set<string>();
  for (const { selector: selectorList } of hoverRules()) {
    for (const selector of splitSelectorList(selectorList)) {
      const first = splitCompounds(selector)[0];
      if (first) {
        compounds.add(stripSpecificityHack(first));
      }
    }
  }
  return [...compounds];
}

/**
 * CSS specificity as `[ids, classes, types]`.
 *
 * Needed because "does a rule exist" is not the question that matters when two rules land on the
 * SAME element: the question is which one WINS. A floor-cancel rule out-specifying a whole-icon
 * rule by a single class-level unit is exactly how a silent cascade bug shipped here.
 *
 * `:is()`, `:not()` and `:has()` contribute the specificity of their MOST SPECIFIC argument;
 * `:where()` contributes nothing. That is why `:has(:is(.a, .b))` adds a class-level unit.
 */
export function specificity(selector: string): [number, number, number] {
  const total: [number, number, number] = [0, 0, 0];
  const add = (other: [number, number, number]) => {
    total[0] += other[0];
    total[1] += other[1];
    total[2] += other[2];
  };

  let index = 0;
  const readArgs = (): string => {
    // `index` sits on the opening paren; return the contents and leave `index` past the close.
    let depth = 0;
    const start = index + 1;
    while (index < selector.length) {
      const character = selector[index];
      if (character === '(') {
        depth++;
      } else if (character === ')') {
        depth--;
        if (depth === 0) {
          index++;
          return selector.slice(start, index - 1);
        }
      }
      index++;
    }
    return selector.slice(start);
  };
  const readName = (): string => {
    const start = index;
    while (index < selector.length && /[-\w\\]/.test(selector[index])) {
      // A CSS escape (`\9`) consumes the next character whatever it is.
      index += selector[index] === '\\' ? 2 : 1;
    }
    return selector.slice(start, index);
  };

  while (index < selector.length) {
    const character = selector[index];

    if (character === '#') {
      index++;
      readName();
      add([1, 0, 0]);
    } else if (character === '.') {
      index++;
      readName();
      add([0, 1, 0]);
    } else if (character === '[') {
      let depth = 0;
      while (index < selector.length) {
        if (selector[index] === '[') {
          depth++;
        } else if (selector[index] === ']') {
          depth--;
          if (depth === 0) {
            index++;
            break;
          }
        }
        index++;
      }
      add([0, 1, 0]);
    } else if (character === ':') {
      const pseudoElement = selector[index + 1] === ':';
      index += pseudoElement ? 2 : 1;
      const name = readName().toLowerCase();
      const args = selector[index] === '(' ? readArgs() : null;

      if (pseudoElement) {
        add([0, 0, 1]);
      } else if (name === 'where') {
        // Zero, by definition.
      } else if (args !== null && ['is', 'not', 'has', 'matches', 'any'].includes(name)) {
        let max: [number, number, number] = [0, 0, 0];
        for (const argument of splitSelectorList(args)) {
          const candidate = specificity(argument);
          if (candidate[0] * 1e4 + candidate[1] * 1e2 + candidate[2] > max[0] * 1e4 + max[1] * 1e2 + max[2]) {
            max = candidate;
          }
        }
        add(max);
      } else {
        add([0, 1, 0]);
      }
    } else if (/[-\w\\|]/.test(character)) {
      readName();
      add([0, 0, 1]);
    } else {
      // Combinator, whitespace, `*` or `&` — no contribution.
      index++;
    }
  }

  return total;
}

/** Comparable scalar for a specificity triple. */
export const specificityRank = ([ids, classes, types]: [number, number, number]): number =>
  ids * 1e6 + classes * 1e3 + types;

/**
 * Does `selector` match `element`?
 *
 * jsdom's selector engine does not support every modern selector, and a thrown error must NOT be
 * swallowed into `false` — that would turn every cascade assertion below into a vacuous pass. So
 * `:has(<arg>)` is evaluated by hand when the engine cannot do it, and anything still unsupported
 * throws loudly.
 */
export function matchesSelector(element: Element, selector: string): boolean {
  const clean = stripSpecificityHack(selector)
    .replace(/:global\(([^)]*)\)/g, '$1')
    .trim();
  try {
    return element.matches(clean);
  } catch (error) {
    const has = clean.match(/:has\(([^)]*(?:\([^)]*\)[^)]*)*)\)/);
    if (!has) {
      throw error;
    }
    const withoutHas = clean.replace(has[0], '');
    return element.matches(withoutHas) && !!element.querySelector(has[1]);
  }
}
