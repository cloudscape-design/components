// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Lightweight ICU message format parser and formatter.
 *
 * Supports the subset of ICU message format used by Cloudscape messages:
 *   - Simple variable substitution: {varName}
 *   - Select: {varName, select, caseA {text} other {text}}
 *   - Plural: {varName, plural, zero {text} one {text} other {text}}
 *   - Plural `#` shorthand: bare `#` inside a plural body is replaced with the count
 *
 * Replaces the `intl-messageformat` runtime dependency (~50 kB gzipped)
 * with a zero-dependency implementation covering exactly what Cloudscape needs.
 */

type Args = Record<string, string | number>;

/** Sentinel key used to pass the current plural count through the args map. */
const PLURAL_COUNT_KEY = '\x00#';

/**
 * Format an ICU message string with the given arguments.
 * Pre-parsed (MessageFormatElement[]) messages are NOT supported in this path;
 * callers should ensure only plain strings reach this function.
 */
export function formatMessage(message: string, args: Args = {}): string {
  return parseAndFormat(message, args);
}

// ---------------------------------------------------------------------------
// Internal parser
// ---------------------------------------------------------------------------

/**
 * Walk through the message string, expanding ICU constructs recursively.
 * We process the string character-by-character to handle nested braces.
 *
 * When `args[PLURAL_COUNT_KEY]` is set, bare `#` characters outside of
 * `{…}` blocks are replaced with the plural count (ICU `#` shorthand).
 */
function parseAndFormat(message: string, args: Args): string {
  let result = '';
  let i = 0;
  const pluralCount = args[PLURAL_COUNT_KEY];

  while (i < message.length) {
    if (message[i] === '{') {
      // Find the matching closing brace, respecting nesting.
      const end = findMatchingBrace(message, i);
      const inner = message.slice(i + 1, end);
      result += formatBlock(inner, args);
      i = end + 1;
    } else if (message[i] === '#' && pluralCount !== undefined) {
      // ICU plural `#` shorthand — replace with the count value.
      result += String(pluralCount);
      i++;
    } else {
      result += message[i];
      i++;
    }
  }

  return result;
}

/** Find the index of the closing `}` that matches the `{` at `start`. */
function findMatchingBrace(str: string, start: number): number {
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '{') {
      depth++;
    } else if (str[i] === '}') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  // Malformed message — return end of string to avoid infinite loop.
  return str.length - 1;
}

/**
 * Format the content found between `{` and `}`.
 * Handles:
 *   - `varName`                          → simple substitution
 *   - `varName, select, k1 {…} other {…}` → select
 *   - `varName, plural, one {…} other {…}` → plural
 */
function formatBlock(inner: string, args: Args): string {
  // Split only on the first two commas to get: [varName, type, rest]
  const firstComma = inner.indexOf(',');
  if (firstComma === -1) {
    // Simple substitution: {varName}
    const varName = inner.trim();
    const value = args[varName];
    return value !== undefined ? String(value) : `{${varName}}`;
  }

  const varName = inner.slice(0, firstComma).trim();
  const rest = inner.slice(firstComma + 1);
  const secondComma = rest.indexOf(',');

  if (secondComma === -1) {
    // Malformed — fall back to empty string.
    return '';
  }

  const type = rest.slice(0, secondComma).trim().toLowerCase();
  const casesStr = rest.slice(secondComma + 1).trim();

  const value = args[varName];

  if (type === 'select') {
    return resolveSelect(casesStr, value !== undefined ? String(value) : '', args);
  }

  if (type === 'plural') {
    const num = typeof value === 'number' ? value : Number(value ?? 0);
    return resolvePlural(casesStr, num, args);
  }

  // Unknown type — fall back to simple substitution.
  return value !== undefined ? String(value) : `{${varName}}`;
}

/**
 * Parse and resolve a `select` block.
 * Format: `key1 {text1} key2 {text2} other {defaultText}`
 */
function resolveSelect(casesStr: string, value: string, args: Args): string {
  const cases = parseCases(casesStr);
  const match = cases[value] ?? cases.other ?? '';
  return parseAndFormat(match, args);
}

/**
 * Parse and resolve a `plural` block.
 * Format: `zero {text} one {text} other {text}`
 *
 * Passes the count as `args[PLURAL_COUNT_KEY]` so that nested `parseAndFormat`
 * calls can resolve the ICU `#` shorthand inside the matched case body.
 */
function resolvePlural(casesStr: string, count: number, args: Args): string {
  const cases = parseCases(casesStr);

  // Try exact numeric match first (e.g. `=1`), then keyword, then `other`.
  const exactKey = `=${count}`;
  const caseBody = cases[exactKey] ?? cases[getPluralKeyword(count)] ?? cases.other ?? '';
  return parseAndFormat(caseBody, { ...args, [PLURAL_COUNT_KEY]: count });
}

/** Derive a simple CLDR plural keyword for a count. */
function getPluralKeyword(count: number): string {
  if (count === 0) {
    return 'zero';
  }
  if (count === 1) {
    return 'one';
  }
  return 'other';
}

/**
 * Parse a cases string into a map of { caseKey → innerText }.
 * Handles nested braces inside case bodies.
 *
 * Input example: `true {Label A} false {Label B} other {}`
 */
function parseCases(casesStr: string): Record<string, string> {
  const cases: Record<string, string> = {};
  let i = 0;

  while (i < casesStr.length) {
    // Skip whitespace between cases.
    while (i < casesStr.length && /\s/.test(casesStr[i])) {
      i++;
    }
    if (i >= casesStr.length) {
      break;
    }

    // Read the case key (everything up to the next `{`).
    const braceStart = casesStr.indexOf('{', i);
    if (braceStart === -1) {
      break;
    }
    const key = casesStr.slice(i, braceStart).trim();

    // Find the matching closing brace.
    const braceEnd = findMatchingBrace(casesStr, braceStart);
    const body = casesStr.slice(braceStart + 1, braceEnd);

    if (key) {
      cases[key] = body;
    }

    i = braceEnd + 1;
  }

  return cases;
}
