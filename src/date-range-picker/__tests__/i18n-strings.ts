// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '../interfaces';

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
  dateConstraintText: '(fallback) For date, use YYYY-MM-DD.',
  dateTimeConstraintText: '(fallback) For date, use YYYY-MM-DD. For time, use 24 hour format.',
  monthConstraintText: '(fallback) For month, use YYYY-MM.',
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
  isoDatePlaceholder: 'YYYY-MM-DD',
  slashedDatePlaceholder: 'YYYY/MM/DD',
  timePlaceholder: 'hh:mm:ss',
};

export const i18nStringsWithExtraFormatConstraints: DateRangePickerProps.I18nStrings = {
  ...i18nStrings,
  slashedDateConstraintText: 'For date, use YYYY/MM/DD.',
  slashedDateTimeConstraintText: 'For date, use YYYY/MM/DD. For time, use 24 hour format.',
  isoDateConstraintText: 'For date, use YYYY-MM-DD.',
  isoDateTimeConstraintText: 'For date, use YYYY-MM-DD. For time, use 24 hour format.',
  slashedMonthConstraintText: 'For month, use YYYY/MM.',
  isoMonthConstraintText: 'For month, use YYYY-MM.',
};

function createI18nMessages(i18nStrings: DateRangePickerProps.I18nStrings) {
  return Object.entries(i18nStrings).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'string') {
        acc['date-range-picker'][`i18nStrings.${key}`] = `(i18n) ${value}`;
      }
      return acc;
    },
    { 'date-range-picker': {} } as Record<string, Record<string, string>>
  );
}

export const i18nMessages = createI18nMessages(i18nStrings);

export const i18nMessagesWithExtraFormatConstraints = createI18nMessages(i18nStringsWithExtraFormatConstraints);
