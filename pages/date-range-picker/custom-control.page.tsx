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
  applyDisabledReason,
  checkIfDisabled,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  DisabledDate,
  generateI18nStrings,
  generatePlaceholder,
  isValid,
} from './common';

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const monthOnly = false;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
  const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;

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
      </SpaceBetween>
      <FormField label="Date Range Picker field">
        <DateRangePicker
          value={value}
          onChange={e => setValue(e.detail.value)}
          locale={enLocale.code}
          i18nStrings={generateI18nStrings(dateOnly, monthOnly)}
          relativeOptions={[]}
          placeholder={generatePlaceholder(dateOnly, monthOnly)}
          isValidRange={isValid}
          rangeSelectorMode="absolute-only"
          isDateEnabled={date => checkIfDisabled(date, disabledDates, monthOnly)}
          dateDisabledReason={date => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
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
