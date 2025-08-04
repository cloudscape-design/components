// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import { Box, Select, SelectProps, SpaceBetween, Toggle } from '~components';
import DateInput, { DateInputProps } from '~components/date-input';

import { AppContextType } from '../app/app-context';
import AppContext from '../app/app-context';
import { getPlaceholder, locales } from './common';

export type PageContext = React.Context<
  AppContextType<{
    granularity?: DateInputProps.Granularity;
    readOnly?: boolean;
    disabled?: boolean;
    inputFormat?: DateInputProps.InputFormat;
    format?: DateInputProps.Format;
    locale?: string;
    hasValue?: boolean;
  }>
>;

const inputFormatOptions: SelectProps.Option[] = [{ value: 'iso' }, { value: 'slashed' }];

const formatOptions: SelectProps.Option[] = [...inputFormatOptions, { value: 'long-localized' }];

const localeOptions: SelectProps.Option[] = locales.map(locale => ({ value: locale }));

export default function DateInputScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const initValue = '2025-02-14';
  const hasValue = urlParams.hasValue ?? false;
  const [value, setValue] = useState<DateInputProps['value']>('');

  useEffect(() => {
    if (hasValue) {
      setValue(initValue);
    } else {
      setValue('');
    }
  }, [hasValue]);

  return (
    <Box padding="l">
      <SpaceBetween direction="vertical" size="m">
        <h1>Date input</h1>

        <SpaceBetween size="m">
          <SpaceBetween direction="horizontal" size="s">
            <Toggle
              checked={urlParams.granularity === 'month'}
              onChange={({ detail }) => setUrlParams({ granularity: detail.checked ? 'month' : 'day' })}
            >
              Month only
            </Toggle>
            <Toggle
              checked={!!urlParams.readOnly}
              onChange={({ detail }) => setUrlParams({ readOnly: detail.checked })}
            >
              Read-only
            </Toggle>
            <Toggle
              checked={!!urlParams.disabled}
              onChange={({ detail }) => setUrlParams({ disabled: detail.checked })}
            >
              Disabled
            </Toggle>
            <Toggle checked={hasValue} onChange={({ detail }) => setUrlParams({ hasValue: detail.checked })}>
              Has initial value
            </Toggle>
          </SpaceBetween>

          <SpaceBetween direction="horizontal" size="s">
            <div style={{ minWidth: 200 }}>
              <Select
                inlineLabelText="Input format"
                options={inputFormatOptions}
                selectedOption={inputFormatOptions.find(o => o.value === urlParams.inputFormat) ?? null}
                onChange={({ detail }) =>
                  setUrlParams({ inputFormat: detail.selectedOption.value as DateInputProps.InputFormat })
                }
              />
            </div>

            <div style={{ minWidth: 200 }}>
              <Select
                inlineLabelText="Format"
                options={formatOptions}
                selectedOption={formatOptions.find(o => o.value === urlParams.format) ?? null}
                onChange={({ detail }) =>
                  setUrlParams({ format: detail.selectedOption.value as DateInputProps.Format })
                }
              />
            </div>

            <div style={{ minWidth: 200 }}>
              <Select
                inlineLabelText="Locale"
                options={localeOptions}
                selectedOption={localeOptions.find(o => o.value === urlParams.locale) ?? null}
                onChange={({ detail }) => setUrlParams({ locale: detail.selectedOption.value })}
              />
            </div>
          </SpaceBetween>
        </SpaceBetween>

        <DateInput
          className="testing-date-input"
          name="date"
          ariaLabel="Enter the date in YYYY/MM/DD"
          placeholder={getPlaceholder({
            granularity: urlParams.granularity ?? 'day',
            inputFormat: urlParams.inputFormat,
            format: urlParams.format,
          })}
          value={value}
          onChange={e => setValue(e.detail.value)}
          {...urlParams}
        />

        <Box variant="code">Raw value (iso): {JSON.stringify(value, undefined, 2)}</Box>
      </SpaceBetween>
    </Box>
  );
}
