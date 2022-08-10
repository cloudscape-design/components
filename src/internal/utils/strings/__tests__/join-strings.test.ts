// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { joinStrings } from '../../../../../lib/components/internal/utils/strings/join-strings';

describe('joinStrings', () => {
  test('joins non-empty strings', () => {
    expect(joinStrings('a', 'b', 'c')).toBe('a b c');
  });

  test('skips empty strings', () => {
    expect(joinStrings('a', '', 'c')).toBe('a c');
  });

  test('skips undefined', () => {
    expect(joinStrings('a', undefined, 'c')).toBe('a c');
  });

  test('returns undefined if no non-empty string in the input', () => {
    expect(joinStrings('', undefined, '')).toBe(undefined);
  });
});
