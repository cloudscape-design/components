// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import enLocale from 'date-fns/locale/en-GB';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';

import { Box, Checkbox, DateRangePicker, DateRangePickerProps, FormField, Link, SpaceBetween } from '~components';
import { formatDate } from '~components/internal/utils/date-time';

import AppContext from '../app/app-context';
import {
  applyDisabledIfEven,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  DisabledDate,
  evenDisabledMsg,
  i18nStrings,
  isValid,
} from './common';

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);

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
          </select>
        </label>
        <Checkbox checked={dateOnly} onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}>
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
          locale={enLocale.code}
          i18nStrings={i18nStrings}
          relativeOptions={[]}
          placeholder="Filter by a date and time range"
          isValidRange={isValid}
          rangeSelectorMode="absolute-only"
          granularity={monthOnly ? 'month' : 'day'}
          isDateEnabled={(date: Date) => applyDisabledIfEven(date, disabledDates, monthOnly)}
          dateDisabledReason={(date: Date) =>
            applyDisabledIfEven(date, disabledDates, monthOnly) ? '' : evenDisabledMsg
          }
          customAbsoluteRangeControl={(selectedDate, setSelectedDate) => (
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
                      date: formatDate(startOfWeek(new Date(), { locale: enLocale })),
                      time: '',
                    },
                    end: {
                      date: formatDate(endOfWeek(new Date(), { locale: enLocale })),
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
          )}
        />
      </FormField>
    </Box>
  );
}
