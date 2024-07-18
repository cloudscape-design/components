// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, DateRangePicker, DateRangePickerProps, Grid, SpaceBetween } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { i18nStrings, isValid } from './common';

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

type DemoContext = React.Context<
  AppContextType<{
    absoluteFormat?: DateRangePickerProps.AbsoluteFormat;
    dateOnly?: boolean;
    hideTimeOffset?: boolean;
    timeOffset?: number;
  }>
>;

const initialRange = {
  startDate: '2024-12-09T00:00:00+01:00',
  endDate: '2024-12-31T23:59:59+01:00',
};

export default function DateRangePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: urlParams.dateOnly ? initialRange.startDate.slice(0, 10) : initialRange.startDate,
    endDate: urlParams.dateOnly ? initialRange.endDate.slice(0, 10) : initialRange.endDate,
  });

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Absolute date range picker with custom absolute format</h1>
        <SpaceBetween direction="horizontal" size="xxl">
          <label>
            Format{' '}
            <select
              value={urlParams.absoluteFormat}
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
            <input
              type="checkbox"
              checked={urlParams.dateOnly}
              onChange={event => setUrlParams({ dateOnly: !!event.target.checked })}
            />{' '}
            Date only
          </label>
          <label>
            Time offset from UTC in minutes{' '}
            <input
              type="number"
              value={urlParams.timeOffset}
              onChange={event => {
                const value = parseInt(event.currentTarget.value);
                setUrlParams({ timeOffset: isNaN(value) ? 0 : value });
              }}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={urlParams.hideTimeOffset}
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
              <DateRangePicker
                value={value}
                locale={locale}
                i18nStrings={i18nStrings}
                placeholder={'Filter by a date and time range'}
                onChange={e => setValue(e.detail.value)}
                relativeOptions={[]}
                isValidRange={isValid}
                rangeSelectorMode={'absolute-only'}
                getTimeOffset={urlParams.timeOffset === undefined ? undefined : () => urlParams.timeOffset!}
                absoluteFormat={urlParams.absoluteFormat}
                dateOnly={urlParams.dateOnly}
                hideTimeOffset={urlParams.hideTimeOffset}
              />
            </Grid>
          </div>
        ))}
      </SpaceBetween>
    </Box>
  );
}
