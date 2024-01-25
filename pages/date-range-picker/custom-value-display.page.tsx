// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { Box, DateRangePicker, DateRangePickerProps, SpaceBetween, Grid, TimeInputProps } from '~components';
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
    absoluteTimeFormat?: DateRangePickerProps.AbsoluteTimeFormat;
    dateOnly?: boolean;
    showTimeOffset?: boolean;
    timeInputFormat?: TimeInputProps.Format;
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
              value={urlParams.absoluteTimeFormat}
              onChange={event =>
                setUrlParams({
                  absoluteTimeFormat: event.currentTarget.value as DateRangePickerProps.AbsoluteTimeFormat,
                })
              }
            >
              <option value="">(Default)</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
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
            Time input format{' '}
            <select
              value={urlParams.timeInputFormat}
              onChange={event =>
                setUrlParams({
                  timeInputFormat: event.currentTarget.value as TimeInputProps.Format,
                })
              }
            >
              <option value="hh:mm:ss">hh:mm:ss</option>
              <option value="hh:mm">hh:mm</option>
              <option value="hh">hh</option>
            </select>
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
            Show time offset{' '}
            <select
              value={urlParams.showTimeOffset?.toString()}
              onChange={event =>
                setUrlParams({
                  showTimeOffset: event.currentTarget.value === '' ? undefined : event.currentTarget.value === 'true',
                })
              }
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
              <option value="">If time offset is provided</option>
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
              absoluteTimeFormat={urlParams.absoluteTimeFormat}
              dateOnly={urlParams.dateOnly}
              timeInputFormat={urlParams.timeInputFormat}
              showTimeOffset={urlParams.showTimeOffset}
            />
          </Grid>
        ))}
      </SpaceBetween>
    </Box>
  );
}
