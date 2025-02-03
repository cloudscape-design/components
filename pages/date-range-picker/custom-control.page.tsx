// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import {
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  sub,
} from 'date-fns';

import { Box, Checkbox, DateRangePicker, DateRangePickerProps, FormField, Link, SpaceBetween } from '~components';
import { formatDate } from '~components/internal/utils/date-time';

import AppContext from '../app/app-context';
import {
  applyDisabledReason,
  checkIfDisabled,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  DisabledDate,
  generatePlaceholder,
  i18nStrings,
  isValid,
} from './common';

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
  const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;

  const renderCustomDateAbsoluteRangeControl = (
    selectedDate: DateRangePickerProps.PendingAbsoluteValue,
    setSelectedDate: React.Dispatch<React.SetStateAction<DateRangePickerProps.PendingAbsoluteValue>>
  ) => {
    return (
      <>
        Auto-select:{' '}
        <Link
          onFollow={() => {
            const today = formatDate(new Date());
            return setSelectedDate({
              start: { date: today, time: '' },
              end: { date: today, time: '' },
            });
          }}
        >
          1D
        </Link>{' '}
        <Link
          variant="secondary"
          onFollow={() =>
            setSelectedDate({
              start: {
                date: formatDate(startOfWeek(new Date())),
                time: '',
              },
              end: {
                date: formatDate(endOfWeek(new Date())),
                time: '',
              },
            })
          }
        >
          7D
        </Link>{' '}
        <Link
          onFollow={() =>
            setSelectedDate({
              start: { date: formatDate(startOfMonth(new Date())), time: '' },
              end: { date: formatDate(endOfMonth(new Date())), time: '' },
            })
          }
        >
          1M
        </Link>{' '}
        <Link
          onFollow={() =>
            setSelectedDate({
              start: { date: '', time: '' },
              end: { date: '', time: '' },
            })
          }
        >
          None
        </Link>
      </>
    );
  };

  const renderCustomMonthAbsoluteRangeControl = (
    selectedDate: DateRangePickerProps.PendingAbsoluteValue,
    setSelectedDate: React.Dispatch<React.SetStateAction<DateRangePickerProps.PendingAbsoluteValue>>
  ) => {
    const today = new Date();
    const lastMonth = sub(today, { months: 1 });
    const oneQuarterAgoDate = sub(today, { months: 3 });
    const oneYearAgoDate = sub(today, { years: 1 });

    return (
      <>
        Auto-select:{' '}
        <Link
          onFollow={() =>
            setSelectedDate({
              start: { date: formatDate(lastMonth), time: '' },
              end: { date: formatDate(lastMonth), time: '' },
            })
          }
        >
          Last full month
        </Link>{' '}
        <Link
          variant="secondary"
          onFollow={() =>
            setSelectedDate({
              start: {
                date: formatDate(startOfQuarter(oneQuarterAgoDate)),
                time: '',
              },
              end: {
                date: formatDate(endOfQuarter(oneQuarterAgoDate)),
                time: '',
              },
            })
          }
        >
          Last full quarter
        </Link>{' '}
        <Link
          onFollow={() =>
            setSelectedDate({
              start: { date: formatDate(startOfYear(oneYearAgoDate)), time: '' },
              end: { date: formatDate(endOfYear(oneYearAgoDate)), time: '' },
            })
          }
        >
          Last full year
        </Link>{' '}
        <Link
          onFollow={() =>
            setSelectedDate({
              start: { date: '', time: '' },
              end: { date: '', time: '' },
            })
          }
        >
          None
        </Link>
      </>
    );
  };

  return (
    <Box padding="s">
      <h1>Date range picker with custom control</h1>
      <SpaceBetween direction="horizontal" size="s">
        <label>
          Disabled dates{' '}
          <select
            value={disabledDates}
            onChange={event =>
              setUrlParams({
                disabledDates: event.currentTarget.value as DisabledDate,
              })
            }
          >
            <option value="none">None (Default)</option>
            <option value="all">All</option>
            <option value="only-even">Only even</option>
            <option value="middle-of-page">Middle of {monthOnly ? 'year' : 'month'}</option>
            <option value="end-of-page">End of {monthOnly ? 'year' : 'month'}</option>
            <option value="start-of-page">Start of {monthOnly ? 'year' : 'month'}</option>
            <option value="overlapping-pages">Overlapping {monthOnly ? 'years' : 'months'}</option>
          </select>
        </label>
        <Checkbox
          checked={withDisabledReason}
          onChange={({ detail }) => setUrlParams({ withDisabledReason: detail.checked })}
        >
          Disabled reasons
        </Checkbox>
        <Checkbox
          disabled={monthOnly}
          checked={dateOnly}
          onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}
        >
          Date-only
        </Checkbox>
        <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
          Month-only
        </Checkbox>
      </SpaceBetween>
      <FormField label="Date Range Picker field">
        <DateRangePicker
          value={value}
          onChange={e => setValue(e.detail.value)}
          locale="en-GB"
          i18nStrings={i18nStrings}
          relativeOptions={[]}
          placeholder={generatePlaceholder(dateOnly, monthOnly)}
          isValidRange={value => isValid(monthOnly ? 'month' : 'day')(value)}
          rangeSelectorMode="absolute-only"
          granularity={monthOnly ? 'month' : 'day'}
          dateOnly={dateOnly}
          isDateEnabled={date => checkIfDisabled(date, disabledDates, monthOnly)}
          dateDisabledReason={date => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
          customAbsoluteRangeControl={(selectedDate, setSelectedDate) =>
            monthOnly
              ? renderCustomMonthAbsoluteRangeControl(selectedDate, setSelectedDate)
              : renderCustomDateAbsoluteRangeControl(selectedDate, setSelectedDate)
          }
        />
      </FormField>
    </Box>
  );
}
