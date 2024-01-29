// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { Box, DateRangePicker, DateRangePickerProps, SpaceBetween, Grid } from '~components';
import { i18nStrings, isValid } from './common';
import AppContext, { AppContextType } from '../app/app-context';
const locales = [
  'ar',
  'de',
  'en-GB',
  'en',
  'es',
  'fr',
  'he',
  'id',
  'it',
  'ja',
  'ko',
  'pt-BR',
  'th',
  'tr',
  'zh-CN',
  'zh-TW',
];

type DemoContext = React.Context<
  AppContextType<{
    absoluteFormat?: DateRangePickerProps.AbsoluteFormat;
    dateOnly?: boolean;
    hideTimeOffset?: boolean;
    timeOffset?: number;
  }>
>;

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2024-12-30T00:00:00+01:00',
    endDate: '2024-12-31T23:59:59+01:00',
  });

  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Absolute date range picker with custom value display</h1>
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
              <option value="spaced">Spaced</option>
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
            Hide time offset{' '}
            <select
              value={urlParams.hideTimeOffset?.toString()}
              onChange={event =>
                setUrlParams({
                  hideTimeOffset: event.currentTarget.value === '' ? undefined : event.currentTarget.value === 'true',
                })
              }
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
        </SpaceBetween>
        <hr />
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 1 }, { colspan: 11 }]}>
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
              isDateEnabled={date => date.getDate() !== 15}
              getTimeOffset={urlParams.timeOffset === undefined ? undefined : () => urlParams.timeOffset!}
              absoluteFormat={urlParams.absoluteFormat}
              dateOnly={urlParams.dateOnly}
              hideTimeOffset={urlParams.hideTimeOffset}
            />
          </Grid>
        ))}
      </SpaceBetween>
    </Box>
  );
}
