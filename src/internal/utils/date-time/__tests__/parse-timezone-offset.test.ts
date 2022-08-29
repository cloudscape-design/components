// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { parseTimezoneOffset } from '../../../../../lib/components/internal/utils/date-time/parse-timezone-offset';

describe('parseTimezoneOffset', () => {
  test.each([
    ['2020-01-01T00:00-1:06', -66],
    ['2020-01-01T00:00+1:17', +77],
    ['2020-01-01T00:00:00.123Z', 0],
    ['2020-01-01T00:00:00', 0 - new Date('2020-01-01').getTimezoneOffset()],
    ['2020-06-01T00:00:00', 0 - new Date('2020-06-01').getTimezoneOffset()],
  ])('parses timezone offset correctly', (dateString, expectedOffset) => {
    expect(parseTimezoneOffset(dateString)).toBe(expectedOffset);
  });
});
