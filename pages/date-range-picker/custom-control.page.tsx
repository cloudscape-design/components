// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import enLocale from 'date-fns/locale/en-GB';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';

import { Box, DateRangePicker, DateRangePickerProps, FormField, Link } from '~components';
import { formatDate } from '~components/internal/utils/date-time';

import { i18nStrings, isValid } from './common';

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  return (
    <Box padding="s">
      <h1>Date range picker with custom control</h1>
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
