// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DateRangePicker, DateRangePickerProps, SpaceBetween, Grid } from '~components';
import { i18nStrings, isValid } from './common';

type DateTimeFormat = Intl.DateTimeFormat & {
  formatRange(startName: Date, endNumber: Date): string;
};

const locales = ['de', 'en-GB', 'en', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'pt-BR', 'th', 'tr', 'zh-CN', 'zh-TW'];

const timezoneName = 'Africa/Cairo';
const getTimeOffset = () => -5 * 60;

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
        <h2>ISO 8601 with time offset</h2>
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
          formatAbsoluteRange={({ startDate, endDate }) => `${startDate} — ${endDate}`}
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
        <h2>Use case 1</h2>
        <h3>
          Using <code>Intl.DateTimeFormat.format</code>
        </h3>
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
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
              dateOnly={true}
              formatAbsoluteRange={({ startDate, endDate }) => {
                const { format } = new Intl.DateTimeFormat(locale, {
                  dateStyle: 'long',
                  timeZone: timezoneName,
                });
                return `${format(new Date(startDate))} — ${format(new Date(endDate))}`;
              }}
            />
          </Grid>
        ))}
        <h3>
          Using <code>Intl.DateTimeFormat.formatRange</code>
        </h3>
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
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
              dateOnly={true}
              formatAbsoluteRange={({ startDate, endDate }) =>
                (
                  new Intl.DateTimeFormat(locale, {
                    dateStyle: 'long',
                    timeZone: timezoneName,
                  }) as DateTimeFormat
                ).formatRange(new Date(startDate), new Date(endDate))
              }
            />
          </Grid>
        ))}
        <h2>Use case 2</h2>
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
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
              dateOnly={false}
              formatAbsoluteRange={({ startDate, endDate }) => `${format2(startDate)} — ${format2(endDate)}`}
            />
          </Grid>
        ))}
        <h2>Use case 3</h2>
        <h3>
          Using <code>Intl.DateTimeFormat.format</code>
        </h3>
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
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
              dateOnly={true}
              formatAbsoluteRange={({ startDate, endDate }) => {
                const { format } = new Intl.DateTimeFormat(locale, {
                  dateStyle: 'short',
                  timeZone: timezoneName,
                });
                return `${format(new Date(startDate))} — ${format(new Date(endDate))}`;
              }}
            />
          </Grid>
        ))}
        <h3>
          Using <code>Intl.DateTimeFormat.formatRange</code>
        </h3>
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
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
              dateOnly={true}
              formatAbsoluteRange={({ startDate, endDate }) =>
                (
                  new Intl.DateTimeFormat(locale, {
                    dateStyle: 'short',
                    timeZone: timezoneName,
                  }) as DateTimeFormat
                ).formatRange(new Date(startDate), new Date(endDate))
              }
            />
          </Grid>
        ))}
        <h2>Use case 4</h2>
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
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
              dateOnly={true}
              formatAbsoluteRange={({ startDate, endDate }) => `${format4(startDate)} — ${format4(endDate)}`}
            />
          </Grid>
        ))}
        <h2>Use case 5</h2>
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
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
              dateOnly={true}
              formatAbsoluteRange={({ startDate, endDate }) => `${format5(startDate)} — ${format5(endDate)}`}
            />
          </Grid>
        ))}
        <h2>Long format</h2>
        {locales.map(locale => (
          <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
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
              getTimeOffset={() => -480}
              dateOnly={true}
              formatAbsoluteRange={({ startDate, endDate }) =>
                (
                  new Intl.DateTimeFormat(locale, {
                    timeStyle: 'long',
                    timeZone: timezoneName,
                  }) as DateTimeFormat
                ).formatRange(new Date(startDate), new Date(endDate))
              }
            />
          </Grid>
        ))}
      </SpaceBetween>
    </Box>
  );
}

function format2(s: string) {
  return s.slice(0, -6).replace('T', ' ');
}

function format4(s: string) {
  return s.slice(0, 10).replace(/-/g, '/');
}

function format5(s: string) {
  return s.slice(0, 19).replace(/-/g, '/').replace('T', ' ');
}
