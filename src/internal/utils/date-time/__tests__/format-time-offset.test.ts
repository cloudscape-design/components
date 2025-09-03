// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatTimeOffsetISO } from '../../../../../lib/components/internal/utils/date-time/format-time-offset';

test('formatTimeOffsetISO', () => {
  for (let offset = -120; offset <= 120; offset++) {
    const formatted = formatTimeOffsetISO('2020-01-01', offset);
    const sign = Number(formatted[0] + '1');
    const hours = Number(formatted[1] + formatted[2]);
    const minutes = Number(formatted[4] + formatted[5]);
    expect(formatted).toHaveLength(6);
    expect(sign * (hours * 60 + minutes)).toBe(offset);
  }
});

test.each(['2020-01-01', '2020-06-01'])('uses browser offset by default [%s]', isoDate => {
  const offset = 0 - new Date(isoDate).getTimezoneOffset();
  expect(formatTimeOffsetISO(isoDate)).toBe(formatTimeOffsetISO(isoDate, offset));
});
