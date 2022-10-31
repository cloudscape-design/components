// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import { formatDate, formatTime, parseDate } from '../../internal/utils/date-time';

export function useDateTime(initialDateString: string, initialTimeString: string) {
  const [dateString, setDateString] = useState(initialDateString);
  const [timeString, setTimeString] = useState(initialTimeString);

  const date = useMemo(() => parseDate(dateString, true), [dateString]);

  const setDate = (date: null | Date) => {
    setDateString(date ? formatDate(date) : '');
    setTimeString(date ? formatTime(date) : '');
  };

  return { dateString, timeString, setDateString, setTimeString, date, setDate };
}
