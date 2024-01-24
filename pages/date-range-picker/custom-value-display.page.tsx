// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DateRangePicker, DateRangePickerProps, SpaceBetween, Grid } from '~components';
import { i18nStrings, isValid } from './common';

type DateTimeFormat = Intl.DateTimeFormat & {
  formatRange(startName: Date, endNumber: Date): string;
};

const locales = ['de', 'en-GB', 'en', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'pt-BR', 'th', 'tr', 'zh-CN', 'zh-TW'];

const timezoneName = 'Europe/Berlin';
const getTimeOffset = () => 60;

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2024-12-30T00:00:00+01:00',
    endDate: '2024-12-31T23:59:59+01:00',
  });

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Absolute date range picker with custom value display</h1>
        <h2>Raw value</h2>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
        <hr />
        <h2>Default</h2>
        <DateRangePicker
          value={value}
          locale={'en'}
          i18nStrings={i18nStrings}
          placeholder={'Filter by a date and time range'}
          onChange={e => setValue(e.detail.value)}
          relativeOptions={[]}
          isValidRange={isValid}
          timeInputFormat="hh:mm:ss"
          rangeSelectorMode={'absolute-only'}
          getTimeOffset={getTimeOffset}
        />
        <hr />
        <h2>ISO 8601 without time offset</h2>
        <DateRangePicker
          value={value}
          locale={'en'}
          i18nStrings={i18nStrings}
          placeholder={'Filter by a date and time range'}
          onChange={e => setValue(e.detail.value)}
          relativeOptions={[]}
          isValidRange={isValid}
          timeInputFormat="hh:mm:ss"
          rangeSelectorMode={'absolute-only'}
          getTimeOffset={getTimeOffset}
          formatAbsoluteRange={({ startDate, endDate }) => `${startDate.slice(0, 19)} — ${endDate.slice(0, 19)}`}
        />
        <hr />
        <h2>Long format</h2>
        <Grid
          key={`pickers`}
          gridDefinition={[
            { colspan: 1 },
            { colspan: 3 },
            { colspan: 1 },
            { colspan: 3 },
            { colspan: 1 },
            { colspan: 3 },
          ]}
        >
          <div></div>
          <h3>Browser-native API only</h3>
          <div></div>
          <h3>Browser-native API + custom time offset</h3>
          <div></div>
          <h3>Browser-native API + custom time and time offset</h3>
        </Grid>
        {locales.map(locale => (
          <Grid
            key={`pickers-${locale}`}
            gridDefinition={[
              { colspan: 1 },
              { colspan: 3 },
              { colspan: 1 },
              { colspan: 3 },
              { colspan: 1 },
              { colspan: 3 },
            ]}
          >
            <div style={{ textAlign: 'right' }}>{locale}</div>

            <DateRangePicker
              value={value}
              locale={locale}
              i18nStrings={i18nStrings}
              placeholder={'Filter by a date and time range'}
              onChange={e => setValue(e.detail.value)}
              relativeOptions={[]}
              isValidRange={isValid}
              timeInputFormat="hh:mm:ss"
              rangeSelectorMode={'absolute-only'}
              isDateEnabled={date => date.getDate() !== 15}
              getTimeOffset={getTimeOffset}
              formatAbsoluteRange={({ startDate, endDate }) =>
                (
                  new Intl.DateTimeFormat(locale, {
                    dateStyle: 'long',
                    timeStyle: 'long',
                    timeZone: timezoneName,
                  }) as DateTimeFormat
                ).formatRange(new Date(startDate), new Date(endDate))
              }
            />

            <div style={{ textAlign: 'right' }}>{locale}</div>

            <DateRangePicker
              value={value}
              locale={locale}
              i18nStrings={i18nStrings}
              placeholder={'Filter by a date and time range'}
              onChange={e => setValue(e.detail.value)}
              relativeOptions={[]}
              isValidRange={isValid}
              timeInputFormat="hh:mm:ss"
              rangeSelectorMode={'absolute-only'}
              getTimeOffset={getTimeOffset}
              formatAbsoluteRange={({ startDate, endDate }) =>
                `${formatDate1(startDate, locale)} — ${formatDate1(endDate, locale)}`
              }
            />

            <div style={{ textAlign: 'right' }}>{locale}</div>

            <DateRangePicker
              value={value}
              locale={locale}
              i18nStrings={i18nStrings}
              placeholder={'Filter by a date and time range'}
              onChange={e => setValue(e.detail.value)}
              relativeOptions={[]}
              isValidRange={isValid}
              timeInputFormat="hh:mm:ss"
              rangeSelectorMode={'absolute-only'}
              getTimeOffset={getTimeOffset}
              formatAbsoluteRange={({ startDate, endDate }) =>
                `${formatDate2(startDate, locale)} — ${formatDate2(endDate, locale)}`
              }
            />
          </Grid>
        ))}
      </SpaceBetween>
    </Box>
  );
}

function formatTimeOffset(isoDate: string) {
  return isoDate[19] + isoDate.slice(-4);
}

function formatDate1(isoDate: string, locale: string) {
  const date = new Date(isoDate);
  const timeOffset = formatTimeOffset(isoDate);
  return `${date.toLocaleString(locale, {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
    month: 'long',
    year: 'numeric',
  })} (UTC${timeOffset})`;
}

function formatDate2(isoDate: string, locale: string) {
  const date = new Date(isoDate);
  const timeOffset = formatTimeOffset(isoDate);
  const dateString = date.toLocaleString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeString = date.toLocaleString(locale, {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
  });

  return `${[dateString, timeString].join(', ')} (UTC${timeOffset})`;
}
