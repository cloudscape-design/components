// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, DateRangePicker, DateRangePickerProps, FormField, Grid, SpaceBetween } from '~components';

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

const locales = [
  'ar',
  'de',
  'en-GB',
  'en-US',
  'es',
  'fr',
  'he',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'pt-BR',
  'th',
  'tr',
  'vi',
  'zh-CN',
  'zh-TW',
];

const rtlLocales = new Set(['ar', 'he']);

const initialRange = {
  startDate: '2024-12-09T00:00:00+01:00',
  endDate: '2024-12-31T23:59:59+01:00',
};

export default function DateRangePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
  const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;
  const absoluteFormat =
    urlParams.absoluteFormat ?? (dateRangePickerDemoDefaults.absoluteFormat as DateRangePickerProps.AbsoluteFormat);
  const hideTimeOffset = urlParams.hideTimeOffset ?? dateRangePickerDemoDefaults.hideTimeOffset;
  const timeOffset = isNaN(parseInt(urlParams.timeOffset as string))
    ? dateRangePickerDemoDefaults.timeOffset
    : parseInt(urlParams.timeOffset as string);
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: dateOnly ? initialRange.startDate.slice(0, 10) : initialRange.startDate,
    endDate: dateOnly ? initialRange.endDate.slice(0, 10) : initialRange.endDate,
  });

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Absolute date range picker with custom absolute format</h1>
        <SpaceBetween direction="horizontal" size="xxl">
          <label>
            Format{' '}
            <select
              value={absoluteFormat}
              onChange={event =>
                setUrlParams({
                  absoluteFormat: event.currentTarget.value as DateRangePickerProps.AbsoluteFormat,
                })
              }
            >
              <option value="">(Default)</option>
              <option value="long-localized">Localized</option>
            </select>
          </label>
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
          <label>
            <input
              type="checkbox"
              checked={withDisabledReason}
              onChange={event => setUrlParams({ withDisabledReason: !!event.target.checked })}
            />{' '}
            Disabled reasons
          </label>
          <label>
            <input
              type="checkbox"
              checked={dateOnly}
              onChange={event => setUrlParams({ dateOnly: !!event.target.checked })}
            />{' '}
            Date only
          </label>
          <label>
            <input
              type="checkbox"
              checked={monthOnly}
              onChange={event => setUrlParams({ monthOnly: !!event.target.checked })}
            />{' '}
            Month only
          </label>
          <label>
            Time offset from UTC in minutes{' '}
            <input
              type="number"
              value={timeOffset}
              onChange={event => {
                const value = parseInt(event.currentTarget.value);
                setUrlParams({ timeOffset: isNaN(value) ? 0 : value });
              }}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={hideTimeOffset}
              onChange={event => setUrlParams({ hideTimeOffset: !!event.target.checked })}
            />{' '}
            Hide time offset
          </label>
        </SpaceBetween>
        <hr />
        {locales.map(locale => (
          <div key={`pickers-${locale}`} dir={rtlLocales.has(locale) ? 'rtl' : 'ltr'}>
            <Grid gridDefinition={[{ colspan: 1 }, { colspan: 11 }]}>
              <div style={{ textAlign: 'right' }}>{locale}</div>
              <FormField label="Date Range Picker field">
                <DateRangePicker
                  value={value}
                  locale={locale}
                  i18nStrings={i18nStrings}
                  placeholder={generatePlaceholder(dateOnly, monthOnly)}
                  onChange={e => setValue(e.detail.value)}
                  relativeOptions={[]}
                  isValidRange={isValid(monthOnly ? 'month' : 'day')}
                  rangeSelectorMode={'absolute-only'}
                  isDateEnabled={date => checkIfDisabled(date, disabledDates, monthOnly)}
                  dateDisabledReason={date => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
                  getTimeOffset={timeOffset === undefined ? undefined : () => timeOffset!}
                  absoluteFormat={absoluteFormat}
                  dateOnly={dateOnly}
                  granularity={monthOnly ? 'month' : 'day'}
                  hideTimeOffset={hideTimeOffset}
                />
              </FormField>
            </Grid>
          </div>
        ))}
      </SpaceBetween>
    </Box>
  );
}
