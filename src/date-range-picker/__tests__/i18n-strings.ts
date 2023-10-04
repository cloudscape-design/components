// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '../interfaces';

export const i18nStrings: DateRangePickerProps.I18nStrings = {
  ariaLabel: 'date range picker',
  todayAriaLabel: 'TEST TODAY',
  nextMonthAriaLabel: 'TEST NEXT MONTH',
  previousMonthAriaLabel: 'TEST PREVIOUS MONTH',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeUnitLabel: 'Unit of time',
  formatRelativeRange: range => `${range.unit}${range.amount}`,
  formatUnit: (unit, value) => (value === 1 ? unit : `${unit}s`),
  dateTimeConstraintText: 'Range must be between 6 and 30 days. Use 24 hour format.',
  modeSelectionAriaLabel: 'Date range mode',
  relativeModeTitle: 'Relative range',
  absoluteModeTitle: 'Absolute range',
  relativeRangeSelectionHeading: 'Choose a range',
  startDateLabel: 'Start date',
  endDateLabel: 'End date',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
  clearButtonLabel: 'Clear and dismiss',
  cancelButtonLabel: 'Cancel',
  applyButtonLabel: 'Apply',
  renderSelectedAbsoluteRangeAriaLive: () => `Range selected from A to B`,
};
