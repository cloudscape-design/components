// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useContext, useState } from 'react';
import React from 'react';

import { Checkbox, FormField, Input, Select, SpaceBetween } from '~components';
import { CalendarProps } from '~components/calendar';
import { DateRangePickerProps } from '~components/date-range-picker';

import AppContext, { AppContextType } from '../app/app-context';
import { makeIsDateValidFunction, makeIsMonthValidFunction } from './is-valid-range';

interface DateRangePickerPageSettings {
  dateOnly?: boolean;
  monthOnly?: boolean;
  showRelativeOptions?: boolean;
  invalid?: boolean;
  warning?: boolean;
  rangeSelectorMode?: DateRangePickerProps.RangeSelectorMode;
  absoluteFormat?: DateRangePickerProps.AbsoluteFormat;
  dateInputFormat?: DateRangePickerProps['dateInputFormat'];
  timeInputFormat?: DateRangePickerProps['timeInputFormat'];
  timeOffset?: number;
  hideTimeOffset?: boolean;
  expandToViewport?: boolean;
  disabledDates?: DisabledDate;
  showDisabledReason?: boolean;
  hasValue?: boolean;
}

const defaultSettings: Required<DateRangePickerPageSettings> = {
  monthOnly: false,
  dateOnly: false,
  showRelativeOptions: true,
  invalid: false,
  warning: false,
  rangeSelectorMode: 'default',
  absoluteFormat: 'iso',
  dateInputFormat: 'iso',
  timeInputFormat: 'hh:mm:ss',
  timeOffset: 0,
  hideTimeOffset: false,
  expandToViewport: false,
  disabledDates: 'none',
  showDisabledReason: true,
  hasValue: true,
};

export function useDateRangePickerSettings(
  defaults: DateRangePickerPageSettings & { value?: null | DateRangePickerProps.Value } = {}
): {
  props: DateRangePickerProps;
  settings: Required<DateRangePickerPageSettings>;
  setSettings: (settings: DateRangePickerPageSettings) => void;
} {
  const { urlParams, setUrlParams } = useContext(
    AppContext as React.Context<AppContextType<DateRangePickerPageSettings>>
  );

  function parseNumber(defaultValue: number, value?: number | string) {
    if (typeof value === 'undefined') {
      return defaultValue;
    }
    return typeof value === 'number' ? value : parseInt(value);
  }

  function parseBoolean(defaultValue: boolean, value?: boolean | string) {
    if (typeof value === 'undefined') {
      return defaultValue;
    }
    return typeof value === 'boolean' ? value : value === 'true';
  }

  const def = <Key extends keyof DateRangePickerPageSettings>(key: Key): Required<DateRangePickerPageSettings>[Key] =>
    (defaults as any)[key] ?? defaultSettings[key];
  const dateOnly = parseBoolean(def('dateOnly'), urlParams.dateOnly);
  const monthOnly = parseBoolean(def('monthOnly'), urlParams.monthOnly);
  const showRelativeOptions = parseBoolean(def('showRelativeOptions'), urlParams.showRelativeOptions);
  const invalid = parseBoolean(def('invalid'), urlParams.invalid);
  const warning = parseBoolean(def('warning'), urlParams.warning);
  const rangeSelectorMode = urlParams.rangeSelectorMode ?? def('rangeSelectorMode');
  const absoluteFormat = urlParams.absoluteFormat ?? def('absoluteFormat');
  const timeInputFormat = urlParams.timeInputFormat ?? def('timeInputFormat');
  const dateInputFormat = urlParams.dateInputFormat ?? def('dateInputFormat');
  const timeOffset = parseNumber(def('timeOffset'), urlParams.timeOffset);
  const hideTimeOffset = parseBoolean(def('hideTimeOffset'), urlParams.hideTimeOffset);
  const expandToViewport = parseBoolean(def('expandToViewport'), urlParams.expandToViewport);
  const disabledDates = urlParams.disabledDates ?? def('disabledDates');
  const showDisabledReason = parseBoolean(def('showDisabledReason'), urlParams.showDisabledReason);
  const hasValue = parseBoolean(def('hasValue'), urlParams.hasValue);
  const settings: Required<DateRangePickerPageSettings> = {
    dateOnly,
    monthOnly,
    showRelativeOptions,
    invalid,
    warning,
    rangeSelectorMode,
    absoluteFormat,
    dateInputFormat,
    timeInputFormat,
    timeOffset,
    hideTimeOffset,
    expandToViewport,
    disabledDates,
    showDisabledReason,
    hasValue,
  };
  const setSettings = (settings: DateRangePickerPageSettings) => setUrlParams(settings);

  const initialRange = { startDate: '2024-12-09T00:00:00+01:00', endDate: '2024-12-31T23:59:59+01:00' };
  const initialValue: null | DateRangePickerProps.Value =
    defaults.value === undefined
      ? {
          type: 'absolute',
          startDate: dateOnly ? initialRange.startDate.slice(0, 10) : initialRange.startDate,
          endDate: dateOnly ? initialRange.endDate.slice(0, 10) : initialRange.endDate,
        }
      : defaults.value;
  const [value, setValue] = useState(hasValue ? initialValue : null);

  const mixedRelativeOptions = [
    { key: 'last-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
    { key: 'last-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
    { key: 'last-1-hour', amount: 1, unit: 'hour', type: 'relative' },
    { key: 'last-6-hours', amount: 6, unit: 'hour', type: 'relative' },
  ] as readonly DateRangePickerProps.RelativeOption[];

  const dateOnlyRelativeOptions = [
    { key: 'last-1-day', amount: 5, unit: 'day', type: 'relative' },
    { key: 'last-7-days', amount: 7, unit: 'day', type: 'relative' },
    { key: 'last-1-month', amount: 1, unit: 'month', type: 'relative' },
    { key: 'last-6-months', amount: 6, unit: 'month', type: 'relative' },
  ] as readonly DateRangePickerProps.RelativeOption[];

  const monthOnlyRelativeOptions = [
    { key: 'last-1-month', amount: 1, unit: 'month', type: 'relative' },
    { key: 'last-2-months', amount: 2, unit: 'month', type: 'relative' },
    { key: 'last-3-months', amount: 3, unit: 'month', type: 'relative' },
    { key: 'last-6-months', amount: 6, unit: 'month', type: 'relative' },
  ] as readonly DateRangePickerProps.RelativeOption[];

  const relativeOptions = monthOnly
    ? monthOnlyRelativeOptions
    : dateOnly
      ? dateOnlyRelativeOptions
      : mixedRelativeOptions;

  const placeholder = monthOnly
    ? placeholders['month-only']
    : dateOnly
      ? placeholders['date-only']
      : placeholders.mixed;

  const i18nStrings: DateRangePickerProps['i18nStrings'] = {
    ariaLabel: 'Filter by a date and time range',
    todayAriaLabel: 'Today',
    nextMonthAriaLabel: 'Next month',
    previousMonthAriaLabel: 'Previous month',
    nextYearAriaLabel: 'Next year',
    previousYearAriaLabel: 'Previous year',
    currentMonthAriaLabel: 'This month',
    customRelativeRangeDurationLabel: 'Duration',
    customRelativeRangeDurationPlaceholder: 'Enter duration',
    customRelativeRangeOptionLabel: 'Custom range',
    customRelativeRangeOptionDescription: 'Set a custom range in the past',
    customRelativeRangeUnitLabel: 'Unit of time',
    formatRelativeRange: range => {
      const unit = range.amount === 1 ? range.unit : `${range.unit}s`;
      return `Last ${range.amount} ${unit}`;
    },
    formatUnit: (unit, value) => (value === 1 ? unit : `${unit}s`),
    dateConstraintText: 'Range must be between 6 and 30 days.',
    dateTimeConstraintText: 'Range must be between 6 and 30 days. Use 24 hour format.',
    monthConstraintText: 'For month use YYYY/MM.',
    modeSelectionLabel: 'Date range mode',
    relativeModeTitle: 'Relative range',
    absoluteModeTitle: 'Absolute range',
    relativeRangeSelectionHeading: 'Choose a range',
    relativeRangeSelectionMonthlyDescription: 'Each month counts from the first day to the last day.',
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

  const props: DateRangePickerProps = {
    ...getDisabledDateProps({ disabledDates, showDisabledReason, monthOnly }),
    value,
    onChange: ({ detail }) => setValue(detail.value),
    dateOnly,
    granularity: monthOnly ? 'month' : 'day',
    invalid,
    warning,
    rangeSelectorMode,
    absoluteFormat,
    dateInputFormat,
    timeInputFormat,
    timeOffset,
    hideTimeOffset,
    expandToViewport,
    relativeOptions: (showRelativeOptions ? relativeOptions : []) ?? [],
    isValidRange: isValid(monthOnly ? 'month' : 'day'),
    placeholder,
    i18nStrings,
    locale: 'en-GB',
  };

  return { props, settings, setSettings };
}

export const placeholders = {
  mixed: 'Filter by date and time range',
  'month-only': 'Filter by month range',
  'date-only': 'Filter by date range',
};

export const isValid = (granularity: CalendarProps.Granularity) => {
  const errorMessages = {
    durationBetweenOneAndTwenty: 'The amount part of the range needs to be between 1 and 20.',
    durationMissing: 'You need to provide a duration.',
    notLongEnough: 'The selected date range is too small. Select a range of one month or larger.',
    minimumStartDate: 'The range cannot start before 2018.',
    noValueSelected: 'You need to select a range.',
    startDateMissing: 'You need to provide a start date.',
    endDateMissing: 'You need to provide an end date.',
  };
  if (granularity === 'month') {
    return makeIsMonthValidFunction(errorMessages);
  }
  return makeIsDateValidFunction(errorMessages);
};

export function Settings({
  settings: {
    dateOnly,
    monthOnly,
    showRelativeOptions,
    invalid,
    warning,
    rangeSelectorMode,
    absoluteFormat,
    dateInputFormat,
    timeInputFormat,
    timeOffset,
    hideTimeOffset,
    expandToViewport,
    disabledDates,
    showDisabledReason,
    hasValue,
  },
  setSettings,
}: {
  settings: Required<DateRangePickerPageSettings>;
  setSettings: (settings: Partial<DateRangePickerPageSettings>) => void;
}) {
  const rangeSelectorOptions = [{ value: 'default' }, { value: 'absolute-only' }, { value: 'relative-only' }];
  const disabledDatesOptions = [
    { value: 'none' },
    { value: 'only-even' },
    { value: 'start-of-page' },
    { value: 'middle-of-page' },
    { value: 'end-of-page' },
    { value: 'overlapping-pages' },
  ];
  const dateFormatOptions = [{ value: 'iso' }, { value: 'slashed' }, { value: 'long-localized' }];
  const inputDateFormat = [{ value: 'iso' }, { value: 'slashed' }];
  const timeFormatOptions = [{ value: 'hh:mm:ss' }, { value: 'hh:mm' }, { value: 'hh' }];
  return (
    <SpaceBetween size="m" direction="horizontal">
      <FormField label="Range selector mode">
        <Select
          options={rangeSelectorOptions}
          selectedOption={rangeSelectorOptions.find(o => o.value === rangeSelectorMode) ?? null}
          onChange={({ detail }) =>
            setSettings({ rangeSelectorMode: detail.selectedOption.value as DateRangePickerProps.RangeSelectorMode })
          }
        />
      </FormField>

      <FormField label="Disabled dates">
        <Select
          options={disabledDatesOptions}
          selectedOption={disabledDatesOptions.find(o => o.value === disabledDates) ?? null}
          onChange={({ detail }) => setSettings({ disabledDates: detail.selectedOption.value as DisabledDate })}
        />
      </FormField>

      <FormField label="Absolute format">
        <Select
          options={dateFormatOptions}
          selectedOption={dateFormatOptions.find(o => o.value === absoluteFormat) ?? null}
          onChange={({ detail }) =>
            setSettings({ absoluteFormat: detail.selectedOption.value as DateRangePickerProps.AbsoluteFormat })
          }
        />
      </FormField>

      <FormField label="Date input format">
        <Select
          options={inputDateFormat}
          selectedOption={inputDateFormat.find(o => o.value === dateInputFormat) ?? null}
          onChange={({ detail }) =>
            setSettings({ dateInputFormat: detail.selectedOption.value as DateRangePickerProps.DateInputFormat })
          }
        />
      </FormField>

      <FormField label="Time input format">
        <Select
          options={timeFormatOptions}
          selectedOption={timeFormatOptions.find(o => o.value === timeInputFormat) ?? null}
          onChange={({ detail }) =>
            setSettings({ timeInputFormat: detail.selectedOption.value as DateRangePickerProps.TimeInputFormat })
          }
        />
      </FormField>

      <FormField label="Time offset">
        <Input
          type="number"
          value={`${timeOffset}`}
          onChange={({ detail }) => setSettings({ timeOffset: parseInt(detail.value) })}
        />
      </FormField>

      <SpaceBetween direction="horizontal" size="s">
        <Checkbox checked={hasValue} onChange={({ detail }) => setSettings({ hasValue: detail.checked })}>
          Has initial value
        </Checkbox>
        <Checkbox
          checked={showDisabledReason}
          onChange={({ detail }) => setSettings({ showDisabledReason: detail.checked })}
        >
          Disabled reasons
        </Checkbox>
        <Checkbox
          checked={showRelativeOptions}
          onChange={({ detail }) => setSettings({ showRelativeOptions: detail.checked })}
        >
          Show relative options
        </Checkbox>
        <Checkbox checked={monthOnly} onChange={({ detail }) => setSettings({ monthOnly: detail.checked })}>
          Month-only
        </Checkbox>
        <Checkbox checked={dateOnly} onChange={({ detail }) => setSettings({ dateOnly: detail.checked })}>
          Date-only
        </Checkbox>
        <Checkbox checked={invalid} onChange={({ detail }) => setSettings({ invalid: detail.checked })}>
          Invalid
        </Checkbox>
        <Checkbox checked={warning} onChange={({ detail }) => setSettings({ warning: detail.checked })}>
          Warning
        </Checkbox>
        <Checkbox
          checked={expandToViewport}
          onChange={({ detail }) => setSettings({ expandToViewport: detail.checked })}
        >
          Expand to viewport
        </Checkbox>
        <Checkbox checked={hideTimeOffset} onChange={({ detail }) => setSettings({ hideTimeOffset: detail.checked })}>
          Hide time offset
        </Checkbox>
      </SpaceBetween>
    </SpaceBetween>
  );
}

type DisabledDate =
  | 'none'
  | 'all'
  | 'only-even'
  | 'middle-of-page'
  | 'end-of-page'
  | 'start-of-page'
  | 'overlapping-pages';

function getDisabledDateProps({
  disabledDates,
  showDisabledReason,
  monthOnly,
}: {
  disabledDates: DisabledDate;
  showDisabledReason: boolean;
  monthOnly: boolean;
}) {
  function isEnabledByOddness(date: Date, isMonthPicker: boolean): boolean {
    return isMonthPicker ? (date.getMonth() + 1) % 2 !== 0 : date.getDate() % 2 !== 0;
  }
  function checkIfDisabled(date: Date, disabledDate: DisabledDate, isMonthPicker: boolean): boolean {
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
  const evenDisabledMsg = 'Option is not odd enough';

  function applyDisabledReason(
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

  return {
    isDateEnabled: (date: Date) => checkIfDisabled(date, disabledDates, monthOnly),
    dateDisabledReason: (date: Date) => applyDisabledReason(showDisabledReason, date, disabledDates, monthOnly),
  };
}
