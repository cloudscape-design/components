// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { parseCountValue } from '../../../../../lib/components/internal/analytics/utils/parse-count-text.js';

test('parses out only the number from a given countText', () => {
  expect(parseCountValue('1 item')).toBe(1);
});

test('parses out the total number from a given countText', () => {
  expect(parseCountValue('1/5')).toBe(5);
});

test('parse out the number on open ended counts', () => {
  expect(parseCountValue('100+')).toBe(100);
});

test('returns undefined when no numbers found', () => {
  expect(parseCountValue('No items')).toBeUndefined();
  expect(parseCountValue('items only')).toBeUndefined();
});

// Format variations
test('handles parentheses format', () => {
  expect(parseCountValue('Items (25)')).toBe(25);
  expect(parseCountValue('(100)')).toBe(100);
});

test('handles comma-separated numbers', () => {
  expect(parseCountValue('1,234 items')).toBe(1234);
  expect(parseCountValue('Total: 1,234')).toBe(1234);
});

test('handles strings with extra whitespace', () => {
  expect(parseCountValue('  100  ')).toBe(100);
  expect(parseCountValue('\t50\n')).toBe(50);
});

test('returns undefined for undefined input', () => {
  expect(parseCountValue(undefined)).toBeUndefined();
});

test('returns undefined for empty string', () => {
  expect(parseCountValue('')).toBeUndefined();
});

test('returns undefined for non-string input', () => {
  expect(parseCountValue(123 as any)).toBeUndefined();
  expect(parseCountValue(null as any)).toBeUndefined();
});
