// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { differenceInMonths } from 'date-fns';
import { DatePickerProps } from '../../interfaces';

export interface MoveFocusHandler {
  (focusedDate: Date, isDateEnabled: DatePickerProps.IsDateEnabledFunction, moveHandler: (date: Date) => Date): Date;
}

// Helper to move the focus to the given moveCallback's date. It checks
// the availability of that date and moves forward until this date is enabled.
// If the entire month in the requested direction has no enabled dates,
// it returns the currently focused date.
const moveFocusHandler: MoveFocusHandler = (focussed: Date, isDateEnabled, moveCallback: (date: Date) => Date) => {
  let current = moveCallback(focussed);
  if (!isDateEnabled) {
    return current;
  }

  while (!isDateEnabled(current)) {
    if (Math.abs(differenceInMonths(focussed, current)) > 1) {
      return focussed;
    }
    current = moveCallback(current);
  }
  return current;
};

export default moveFocusHandler;
