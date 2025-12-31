// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatDate } from '../../../../../lib/components/internal/utils/date-time/format-date';

describe('formatDate', () => {
  test.each([
    { date: new Date(2020, 0, 1), expected: '2020-01-01' },
    { date: new Date(2020, 10, 11), expected: '2020-11-11' },
    { date: new Date(2020, 11, 31), expected: '2020-12-31' },
  ])('formats date correctly ($expected)', ({ date, expected }) => {
    expect(formatDate(date)).toBe(expected);
  });
});
