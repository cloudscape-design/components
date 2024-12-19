// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '~components/date-range-picker';

import { AppContextType } from '../app/app-context';
import { makeIsValidFunction } from './is-valid-range';

export type DateRangePickerDemoContext = React.Context<
  AppContextType<{
    monthOnly?: boolean;
    dateOnly?: boolean;
    showRelativeOptions?: boolean;
    invalid?: boolean;
    warning?: boolean;
    rangeSelectorMode?: DateRangePickerProps.RangeSelectorMode;
    absoluteFormat?: DateRangePickerProps.AbsoluteFormat;
    hideTimeOffset?: boolean;
    timeOffset?: number | string;
    expandToViewport?: boolean;
    disabledDates?: string;
    withDisabledReason?: boolean;
    hasValue?: boolean;
  }>
>;

export type DisabledDate =
  | 'none'
  | 'all'
  | 'only-even'
  | 'middle-of-page'
  | 'end-of-page'
  | 'start-of-page'
  | 'overlapping-pages';

function isEnabledByOddness(date: Date, isMonthPicker: boolean): boolean {
  return isMonthPicker ? (date.getMonth() + 1) % 2 !== 0 : date.getDate() % 2 !== 0;
}

export function checkIfDisabled(date: Date, disabledDate: DisabledDate, isMonthPicker: boolean): boolean {
  const endOfMonthDays = [28, 29, 30, 31];
  switch (disabledDate) {
    case 'only-even':
      return isEnabledByOddness(date, isMonthPicker);
    case 'middle-of-page':
      if (isMonthPicker) {
        return ![5, 6].includes(date.getMonth());
      }
      return date.getDate() !== 15;
    case 'end-of-page':
      if (isMonthPicker) {
        return date.getMonth() !== 11;
      }
      return !endOfMonthDays.includes(date.getDate());
    case 'start-of-page':
      if (isMonthPicker) {
        return date.getMonth() > 0;
      }
      return date.getDate() > 1;
    case 'overlapping-pages':
      if (isMonthPicker) {
        return ![11, 0].includes(date.getMonth());
      }
      return ![...endOfMonthDays, 1].includes(date.getDate());
    case 'all':
      return false;
    case 'none':
    default:
      return true;
  }
}

export const evenDisabledMsg = 'Option is not odd enough';
export function applyDisabledReason(
  hasDisabledReason: boolean,
  date: Date,
  disabledDate: DisabledDate,
  isMonthPicker: boolean
): string {
  if (!hasDisabledReason || checkIfDisabled(date, disabledDate, isMonthPicker)) {
    return '';
  }

  const pageType = isMonthPicker ? 'year' : 'month';
  switch (disabledDate) {
    case 'only-even':
      return evenDisabledMsg;
    case 'middle-of-page':
      return `Middle of ${pageType} disabled`;
    case 'end-of-page':
      return `End of ${pageType} disabled`;
    case 'start-of-page':
      return `Start of ${pageType} disabled`;
    case 'overlapping-pages':
      return `End and start of ${pageType} disabled`;
    case 'all':
      return `Full ${pageType} disabled`;
    default:
      return 'Disabled';
  }
}

export const dateRangePickerDemoDefaults = {
  monthOnly: false,
  dateOnly: false,
  showRelativeOptions: true,
  invalid: false,
  warning: false,
  rangeSelectorMode: 'default',
  absoluteFormat: 'iso',
  hideTimeOffset: false,
  timeOffset: 0,
  expandToViewport: false,
  disabledDates: 'none',
  withDisabledReason: true,
  hasValue: true,
};

function formatRelativeRange(range: DateRangePickerProps.RelativeValue): string {
  const unit = range.amount === 1 ? range.unit : `${range.unit}s`;
  return `Last ${range.amount} ${unit}`;
}

export const i18nStrings: DateRangePickerProps['i18nStrings'] = {
  ariaLabel: 'Filter by a date and time range',
  todayAriaLabel: 'Today',
  nextMonthAriaLabel: 'Next month',
  previousMonthAriaLabel: 'Previous month',
  nextYearAriaLabel: 'Next year',
  previousYearAriaLabel: 'Previous year',
  currentMonthAriaLabel: 'Current month',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeUnitLabel: 'Unit of time',
  formatRelativeRange: formatRelativeRange,
  formatUnit: (unit, value) => (value === 1 ? unit : `${unit}s`),
  dateTimeConstraintText: 'Range must be between 6 and 30 days. Use 24 hour format.',
  modeSelectionLabel: 'Date range mode',
  relativeModeTitle: 'Relative range',
  absoluteModeTitle: 'Absolute range',
  relativeRangeSelectionHeading: 'Choose a range',
  startMonthLabel: 'Start month',
  endMonthLabel: 'End month',
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

export function generateI18nStrings(isDateOnly: boolean, isMonthOnly: boolean): DateRangePickerProps['i18nStrings'] {
  return {
    ...i18nStrings,
    ...(isDateOnly ? { dateTimeConstraintText: 'Range must be between 6 and 30 days.' } : {}),
    ...(isMonthOnly ? { dateTimeConstraintText: 'For month use YYYY/MM.' } : {}),
  };
}

export const relativeOptions = [
  { key: 'last-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
  { key: 'last-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
  { key: 'last-1-hour', amount: 1, unit: 'hour', type: 'relative' },
  { key: 'last-6-hours', amount: 6, unit: 'hour', type: 'relative' },
] as const;

export const dateOnlyRelativeOptions = [
  { key: 'last-1-day', amount: 5, unit: 'day', type: 'relative' },
  { key: 'last-7-days', amount: 7, unit: 'day', type: 'relative' },
  { key: 'last-1-month', amount: 1, unit: 'month', type: 'relative' },
  { key: 'last-6-months', amount: 6, unit: 'month', type: 'relative' },
] as const;

export const monthOnlyRelativeOptions = [
  { key: 'last-1-month', amount: 1, unit: 'month', type: 'relative' },
  { key: 'last-2-months', amount: 2, unit: 'month', type: 'relative' },
  { key: 'last-3-months', amount: 3, unit: 'month', type: 'relative' },
  { key: 'last-6-months', amount: 6, unit: 'month', type: 'relative' },
] as const;

export function generateRelativeOptions(dateOnly: boolean, monthOnly: boolean) {
  if (monthOnly) {
    return monthOnlyRelativeOptions;
  }
  if (dateOnly) {
    return dateOnlyRelativeOptions;
  }
  return relativeOptions;
}

export const isValid = makeIsValidFunction({
  durationBetweenOneAndTwenty: 'The amount part of the range needs to be between 1 and 20.',
  durationMissing: 'You need to provide a duration.',
  minimumStartDate: 'The range cannot start before 2018.',
  noValueSelected: 'You need to select a range.',
  startDateMissing: 'You need to provide a start date.',
  endDateMissing: 'You need to provide an end date.',
});

export const generatePlaceholder = (dateOnly?: boolean, monthOnly?: boolean) => {
  if (monthOnly) {
    return `Filter by month range`;
  }
  if (dateOnly) {
    return `Filter by date range`;
  }
  return `Filter by date and time range`;
};
