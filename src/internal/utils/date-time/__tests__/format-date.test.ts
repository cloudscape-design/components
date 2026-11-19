// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatDate } from '../../../../../lib/components/internal/utils/date-time/format-date';

describe('formatDate', () => {
  test.each(['2020-01-01', '2020-11-11', '2020-12-31'])('formats date correctly', dateString => {
    expect(formatDate(new Date(dateString))).toBe(dateString);
  });
});
