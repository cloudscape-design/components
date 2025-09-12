// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear);

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
                date: formatDate(dayjs().startOf('week').toDate()),
                time: '',
              },
              end: {
                date: formatDate(dayjs().endOf('week').toDate()),
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
              start: { date: formatDate(dayjs().startOf('month').toDate()), time: '' },
              end: { date: formatDate(dayjs().endOf('month').toDate()), time: '' },
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
    const lastMonth = dayjs(today).subtract(1, 'month').toDate();
    const oneQuarterAgoDate = dayjs(today).subtract(3, 'month').toDate();
    const oneYearAgoDate = dayjs(today).subtract(1, 'year').toDate();
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
                date: formatDate(dayjs(oneQuarterAgoDate).startOf('quarter').toDate()),
                time: '',
              },
              end: {
                date: formatDate(dayjs(oneQuarterAgoDate).endOf('quarter').toDate()),
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
              start: { date: formatDate(dayjs(oneYearAgoDate).startOf('year').toDate()), time: '' },
              end: { date: formatDate(dayjs(oneYearAgoDate).endOf('year').toDate()), time: '' },
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
