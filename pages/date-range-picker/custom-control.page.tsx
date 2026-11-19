// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
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

import { DateRangePicker, DateRangePickerProps, FormField, Link } from '~components';
import { formatDate } from '~components/internal/utils/date-time';

import { SimplePage } from '../app/templates';
import { Settings, useDateRangePickerSettings } from './common';

export default function DatePickerScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({
    hasValue: false,
    rangeSelectorMode: 'absolute-only',
  });

  const renderCustomDateAbsoluteRangeControl = (
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
    <SimplePage
      title="Date range picker: custom control"
      settings={<Settings settings={settings} setSettings={setSettings} />}
    >
      <FormField label="Date Range Picker field">
        <DateRangePicker
          {...props}
          customAbsoluteRangeControl={(_, setSelectedDate) =>
            props.granularity === 'month'
              ? renderCustomMonthAbsoluteRangeControl(setSelectedDate)
              : renderCustomDateAbsoluteRangeControl(setSelectedDate)
          }
        />
      </FormField>
    </SimplePage>
  );
}
