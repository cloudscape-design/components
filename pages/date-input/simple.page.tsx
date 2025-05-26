// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import { Box, Checkbox, SpaceBetween } from '~components';
import DateInput, { DateInputProps } from '~components/date-input';

import { AppContextType } from '../app/app-context';
import AppContext from '../app/app-context';

export type DateInputDemoContext = React.Context<
  AppContextType<{
    monthOnly?: boolean;
    hasValue?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    inputFormat?: DateInputProps.InputFormat | '';
    format?: DateInputProps.Format | '';
    locale?: DateInputProps['locale'] | '';
  }>
>;

export default function DateInputScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateInputDemoContext);
  const initValue = '2025-02-14';
  const hasValue = urlParams.hasValue ?? false;
  const inputFormat = urlParams.inputFormat ?? '';
  const disabled = urlParams.disabled ?? false;
  const readonly = urlParams.readonly ?? false;
  const format = urlParams.format ?? '';
  const locale = urlParams.locale ?? 'en-US';
  const monthOnly = urlParams.monthOnly ?? false;
  const [value, setValue] = useState<DateInputProps['value']>('');
  const isIso = (format === 'long-localized' && inputFormat === 'iso') || inputFormat === 'iso';
  const inputFormatPlaceholderText = `YYYY${isIso ? '-' : '/'}MM${monthOnly ? `` : `${isIso ? '-' : '/'}DD`}`;

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
        <SpaceBetween direction="horizontal" size="s">
          <Checkbox checked={hasValue} onChange={({ detail }) => setUrlParams({ hasValue: detail.checked })}>
            Has initial value
          </Checkbox>
          <Checkbox checked={readonly} onChange={({ detail }) => setUrlParams({ readonly: detail.checked })}>
            Read-only
          </Checkbox>
          <Checkbox checked={disabled} onChange={({ detail }) => setUrlParams({ disabled: detail.checked })}>
            Disabled
          </Checkbox>
          <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
            Month-only
          </Checkbox>
          <label>
            Format
            <select
              value={format}
              onChange={event =>
                setUrlParams({
                  format: event.currentTarget.value as DateInputProps.InputFormat,
                })
              }
            >
              <option value="slashed">Slashed (Default)</option>
              <option value="iso">Iso</option>
              <option value="long-localized">Long localized</option>
            </select>
          </label>
          <label>
            Input format
            <select
              value={inputFormat}
              disabled={format !== 'long-localized'}
              onChange={event =>
                setUrlParams({
                  inputFormat: event.currentTarget.value as DateInputProps.InputFormat,
                })
              }
            >
              <option value="slashed">Slashed (Default)</option>
              <option value="iso">Iso</option>
            </select>
          </label>
          <label>
            Locale
            <select
              value={locale}
              onChange={event =>
                setUrlParams({
                  locale: event.currentTarget.value as DateInputProps['locale'],
                })
              }
            >
              <option value="ar">ar</option>
              <option value="en-US">en-US</option>
              <option value="en-GB">en-GB</option>
              <option value="de">de</option>
              <option value="es">es</option>
              <option value="fr">fr</option>
              <option value="it">it</option>
              <option value="ja">ja</option>
              <option value="ko">ko</option>
              <option value="tr">tr</option>
              <option value="pt-BR">pt-BR</option>
              <option value="ru">ru</option>
              <option value="zh-CN">zh-CN</option>
              <option value="zh-TW">zh-TW</option>
            </select>
          </label>
        </SpaceBetween>
        <DateInput
          className="testing-date-input"
          name="date"
          ariaLabel={`Enter the date in ${inputFormatPlaceholderText}`}
          placeholder={inputFormatPlaceholderText}
          onChange={e => setValue(e.detail.value)}
          value={value}
          readOnly={readonly}
          disabled={disabled}
          format={format === '' ? undefined : format}
          inputFormat={inputFormat === '' ? undefined : inputFormat}
          granularity={monthOnly ? 'month' : 'day'}
          locale={locale}
        />
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}
