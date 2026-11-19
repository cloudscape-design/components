// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { parseDate } from '../../../../../lib/components/internal/utils/date-time/parse-date';

describe('parseDate', () => {
  test.each(['2020-01-0x', '2020-11', '2020'])(
    'returns null in sctict mode for invalid or incomplete dates',
    dateString => {
      expect(parseDate(dateString, true)).toBe(null);
    }
  );

  test.each(['2020-01-0x', '2020-11', '2020'])('parses incomplete dates in default mode', dateString => {
    expect(parseDate(dateString)).toBeInstanceOf(Date);
  });
});
