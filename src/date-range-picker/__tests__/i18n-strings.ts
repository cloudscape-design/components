// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '../interfaces.js';

export const i18nStrings: DateRangePickerProps.I18nStrings = {
  ariaLabel: 'date range picker',
  todayAriaLabel: 'TEST TODAY',
  currentMonthAriaLabel: 'TEST THIS MONTH',
  nextMonthAriaLabel: 'TEST NEXT MONTH',
  nextYearAriaLabel: 'TEST NEXT YEAR',
  previousMonthAriaLabel: 'TEST PREVIOUS MONTH',
  previousYearAriaLabel: 'TEST PREVIOUS YEAR',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeUnitLabel: 'Unit of time',
  formatRelativeRange: range => `${range.unit}${range.amount}`,
  formatUnit: (unit, value) => (value === 1 ? unit : `${unit}s`),
  dateConstraintText: 'Range must be between 6 and 30 days.',
  dateTimeConstraintText: 'Range must be between 6 and 30 days. Use 24 hour format.',
  monthConstraintText: 'For month use YYYY/MM.',
  modeSelectionLabel: 'Date range mode',
  relativeModeTitle: 'Relative range',
  absoluteModeTitle: 'Absolute range',
  relativeRangeSelectionHeading: 'Choose a range',
  startMonthLabel: 'Start month',
  startDateLabel: 'Start date',
  endMonthLabel: 'End month',
  endDateLabel: 'End date',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
  clearButtonLabel: 'Clear and dismiss',
  cancelButtonLabel: 'Cancel',
  applyButtonLabel: 'Apply',
  renderSelectedAbsoluteRangeAriaLive: () => `Range selected from A to B`,
};
