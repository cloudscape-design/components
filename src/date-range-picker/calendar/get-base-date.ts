// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '../interfaces';
import { startOfMonth, addDays } from 'date-fns';
import moveFocusHandler from '../../calendar/utils/move-focus-handler';

export function getBaseDate(date: Date, daysToMove: -1 | 1, isDateEnabled: DateRangePickerProps.IsDateEnabledFunction) {
  const startDate = startOfMonth(date);
  if (isDateEnabled(startDate)) {
    return startDate;
  }
  return moveFocusHandler(startDate, isDateEnabled, (date: Date) => addDays(date, daysToMove));
}
