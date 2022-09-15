// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isIsoDateOnly } from '../../../../../lib/components/internal/utils/date-time/is-iso-date-only';

describe('isIsoDateOnly', () => {
  test('identifies date-only date correctly', () => {
    expect(isIsoDateOnly('2020-01-01')).toBe(true);
  });

  test('identifies non-date-only date correctly', () => {
    expect(isIsoDateOnly('2020-01-01T')).toBe(false);
  });
});
