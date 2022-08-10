// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { parseTimezoneOffset } from '../../../../../lib/components/internal/utils/date-time/parse-timezone-offset';

jest.mock('../../../../../lib/components/internal/utils/date-time/get-browser-timezone-offset', () => ({
  getBrowserTimezoneOffset: jest.fn().mockReturnValue(88),
}));

describe('parseTimezoneOffset', () => {
  test.each([
    ['2020-01-01T00:00-1:06', -66],
    ['2020-01-01T00:00+1:17', +77],
    ['2020-01-01T00:00:00.123Z', 0],
    ['2020-01-01T00:00:00', 88],
  ])('parses timezone offset correctly', (dateString, expectedOffset) => {
    expect(parseTimezoneOffset(dateString)).toBe(expectedOffset);
  });
});
