// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '~components/date-range-picker';
import { makeIsValidFunction } from './is-valid-range';

function formatRelativeRange(range: DateRangePickerProps.RelativeValue): string {
  const unit = range.amount === 1 ? range.unit : `${range.unit}s`;
  return `Previous ${range.amount} ${unit}`;
}

export const i18nStrings: DateRangePickerProps['i18nStrings'] = {
  ariaLabel: 'Filter by a date and time range',
  todayAriaLabel: 'Today',
  nextMonthAriaLabel: 'Next month',
  previousMonthAriaLabel: 'Previous month',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeUnitLabel: 'Unit of time',
  formatRelativeRange: formatRelativeRange,
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
  errorIconAriaLabel: 'Error',
  renderSelectedAbsoluteRangeAriaLive: (startDate, endDate) => `Range selected from ${startDate} to ${endDate}`,
};

export const i18nStringsDateOnly = { ...i18nStrings, dateTimeConstraintText: 'Range must be between 6 and 30 days.' };

export const relativeOptions = [
  { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
  { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
  { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
  { key: 'previous-6-hours', amount: 6, unit: 'hour', type: 'relative' },
] as const;

export const isValid = makeIsValidFunction({
  durationBetweenOneAndTwenty: 'The amount part of the range needs to be between 1 and 20.',
  durationMissing: 'You need to provide a duration.',
  minimumStartDate: 'The range cannot start before 2018.',
  noValueSelected: 'You need to select a range.',
  startDateMissing: 'You need to provide a start date.',
  endDateMissing: 'You need to provide an end date.',
});
