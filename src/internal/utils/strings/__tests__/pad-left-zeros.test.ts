// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { padLeftZeros } from '../../../../../lib/components/internal/utils/strings/pad-left-zeros';

describe('padLeftZeros', () => {
  test('pads empty string', () => {
    expect(padLeftZeros('', 3)).toBe('000');
  });

  test('pads a non-empty string', () => {
    expect(padLeftZeros('0', 2)).toBe('00');
  });

  test('pads the left side of a string', () => {
    expect(padLeftZeros('a', 2)).toBe('0a');
  });

  test('pads a string up until the given length', () => {
    expect(padLeftZeros('aaaa', 2)).toBe('aaaa');
  });
});
