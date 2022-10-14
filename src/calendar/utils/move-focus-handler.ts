// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { differenceInYears } from 'date-fns';
import { DatePickerProps } from '../../date-picker/interfaces';

// Helper to move the focus to the given moveCallback's date. It checks
// the availability of that date and moves forward until this date is enabled.
// If the entire month in the requested direction has no enabled dates,
// it returns the currently focused date.
export default function moveFocusHandler(
  focused: Date,
  isDateEnabled: DatePickerProps.IsDateEnabledFunction,
  moveCallback: (date: Date) => Date
): Date {
  let current = moveCallback(focused);
  if (!isDateEnabled) {
    return current;
  }

  while (!isDateEnabled(current)) {
    // Get the first enabled date within the one year max.
    // Used when using keyboard navigation on calendar days.
    if (Math.abs(differenceInYears(focused, current)) > 1) {
      return focused;
    }
    current = moveCallback(current);
  }
  return current;
}
