// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '../interfaces';
import { startOfMonth } from 'date-fns';
import { moveNextDay, movePrevDay } from '../../calendar/utils/navigation';

export function getBaseDate(date: Date, direction: -1 | 1, isDateEnabled: DateRangePickerProps.IsDateEnabledFunction) {
  const startDate = startOfMonth(date);
  if (isDateEnabled(startDate)) {
    return startDate;
  }
  const move = direction === -1 ? movePrevDay : moveNextDay;
  return move(startDate, isDateEnabled);
}
