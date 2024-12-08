// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isIsoDateOnly, isIsoMonthOnly } from '../../../../../lib/components/internal/utils/date-time/is-iso-only';

describe('isIsoDateOnly', () => {
  test('identifies date-only date correctly', () => {
    expect(isIsoDateOnly('2020-01-01')).toBe(true);
  });

  test('identifies non-date-only date correctly', () => {
    expect(isIsoDateOnly('2020-01-01T')).toBe(false);
  });
});

describe('isIsoMonthOnly', () => {
  test('identifies month-only date correctly', () => {
    expect(isIsoMonthOnly('2020-01')).toBe(true);
  });

  test('identifies non-month-only date correctly', () => {
    expect(isIsoMonthOnly('2020-01-01')).toBe(false);
    expect(isIsoMonthOnly('2020-01-01T')).toBe(false);
    expect(isIsoMonthOnly('2020-01T')).toBe(false);
  });
});
