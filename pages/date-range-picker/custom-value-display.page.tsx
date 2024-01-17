// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DateRangePicker, DateRangePickerProps, SpaceBetween, Grid } from '~components';
import { i18nStrings, isValid } from './common';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

type DateTimeFormat = Intl.DateTimeFormat & {
  formatRange(startName: Date, endNumber: Date): string;
};

const locales = ['de', 'en-GB', 'en', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'pt-BR', 'th', 'tr', 'zh-CN', 'zh-TW'];

const permutations = createPermutations<Intl.DateTimeFormatOptions>([
  {
    dateStyle: [undefined, 'short'],
    timeStyle: ['medium', 'long'],
  },
  {
    dateStyle: ['medium'],
    timeStyle: ['medium'],
  },
]);

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2024-12-30T00:00:00+01:00',
    endDate: '2024-12-31T23:59:59+01:00',
  });

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Date range picker with custom value display</h1>
        <h2>
          Using <code>Intl.DateTimeFormat.formatRange</code>
        </h2>
        <PermutationsView
          permutations={permutations}
          render={permutation => {
            const str = JSON.stringify(permutation);
            return (
              <ErrorBoundary errorMessage={`Invalid i18n options: ${str}`}>
                <h3>{str}</h3>
                {locales.map(locale => (
                  <>
                    <Grid key={`pickers-${locale}`} gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
                      <div style={{ textAlign: 'right' }}>{locale}</div>
                      <DateRangePicker
                        value={value}
                        locale={locale}
                        i18nStrings={{
                          ...i18nStrings,
                          formatAbsoluteRange: (startDate, endDate, locale) =>
                            (new Intl.DateTimeFormat(locale, permutation) as DateTimeFormat).formatRange(
                              new Date(startDate),
                              new Date(endDate)
                            ),
                        }}
                        placeholder={'Filter by a date and time range'}
                        onChange={e => setValue(e.detail.value)}
                        relativeOptions={[]}
                        isValidRange={isValid}
                        timeInputFormat="hh:mm"
                        rangeSelectorMode={'absolute-only'}
                        isDateEnabled={date => date.getDate() !== 15}
                      />
                    </Grid>
                  </>
                ))}
              </ErrorBoundary>
            );
          }}
        />
        <hr />
        <h2>ISO 8061 without time offset</h2>
        <DateRangePicker
          value={value}
          locale={'en'}
          i18nStrings={{
            ...i18nStrings,
            formatAbsoluteRange: (startDate, endDate) => `${startDate} — ${endDate}`,
          }}
          placeholder={'Filter by a date and time range'}
          onChange={e => setValue(e.detail.value)}
          relativeOptions={[]}
          isValidRange={isValid}
          timeInputFormat="hh:mm"
          rangeSelectorMode={'absolute-only'}
          isDateEnabled={date => date.getDate() !== 15}
        />
        <hr />
        <h2>ISO 8061 with time offset</h2>
        <DateRangePicker
          value={value}
          locale={'en'}
          placeholder={'Filter by a date and time range'}
          onChange={e => setValue(e.detail.value)}
          relativeOptions={[]}
          isValidRange={isValid}
          timeInputFormat="hh:mm"
          rangeSelectorMode={'absolute-only'}
          isDateEnabled={date => date.getDate() !== 15}
        />
        <hr />
        <h2>Raw value</h2>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}

class ErrorBoundary extends React.Component<any, { errorMessage: string }> {
  constructor(props: any) {
    super(props);
    this.state = { errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { errorMessage: error.stack || error.message };
  }

  render() {
    if (this.state.errorMessage) {
      // You can render any custom fallback UI
      return (
        <span style={{ color: 'orange', whiteSpace: 'pre' }}>{this.props.errorMessage || this.state.errorMessage}</span>
      );
    }

    return this.props.children;
  }
}
