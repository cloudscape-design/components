// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addDays, differenceInYears } from 'date-fns';

export function moveNextDay(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDate(startDate, isDateEnabled, 1);
}

export function movePrevDay(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDate(startDate, isDateEnabled, -1);
}

export function moveNextWeek(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDate(startDate, isDateEnabled, 7);
}

export function movePrevWeek(startDate: Date, isDateEnabled: (date: Date) => boolean): Date {
  return moveDate(startDate, isDateEnabled, -7);
}

// Iterates dates forwards or backwards until the next active date is found.
// If there is no active date in a year range the start date is returned.
function moveDate(startDate: Date, isDateEnabled: (date: Date) => boolean, step: number): Date {
  let current = addDays(startDate, step);

  while (isDateEnabled && !isDateEnabled(current)) {
    if (Math.abs(differenceInYears(startDate, current)) > 1) {
      return startDate;
    }
    current = addDays(current, step);
  }

  return current;
}
