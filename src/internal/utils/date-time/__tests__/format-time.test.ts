// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatTime } from '../../../../../lib/components/internal/utils/date-time/format-time';

describe('formatTime', () => {
  test.each(['2020-01-01T00:00:00', '2020-01-01T01:01:01', '2020-01-01T23:59:59'])(
    'formats time correctly',
    dateString => {
      expect(formatTime(new Date(dateString))).toBe(dateString.split('T')[1]);
    }
  );
});
