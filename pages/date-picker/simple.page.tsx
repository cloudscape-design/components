// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import { Box, Checkbox, DatePicker, DatePickerProps, FormField, Link, SpaceBetween } from '~components';

import { AppContextType } from '../app/app-context';
import AppContext from '../app/app-context';
import i18nStrings from './i18n-strings';

export type DatePickerDemoContext = React.Context<
  AppContextType<{
    monthOnly?: boolean;
    hasValue?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    inputFormat?: DatePickerProps.InputFormat | '';
    format?: DatePickerProps.Format | '';
    locale?: DatePickerProps['locale'] | '';
  }>
>;

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DatePickerDemoContext);
  const initValue = '2025/02/14';
  const hasValue = urlParams.hasValue ?? false;
  const inputFormat = urlParams.inputFormat ?? '';
  const disabled = urlParams.disabled ?? false;
  const readonly = urlParams.readonly ?? false;
  const format = urlParams.format ?? '';
  const locale = urlParams.locale ?? 'en-US';
  const monthOnly = urlParams.monthOnly ?? false;
  const [value, setValue] = useState<DatePickerProps['value']>('');
  const isIso = (format === 'long-localized' && inputFormat === 'iso') || inputFormat === 'iso';
  const inputFormatPlaceholderText = `YYYY${isIso ? '-' : '/'}MM${monthOnly ? `` : `${isIso ? '-' : '/'}DD`}`;

  useEffect(() => {
    if (hasValue) {
      setValue(initValue);
    } else {
      setValue('');
    }
  }, [hasValue, monthOnly]);

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Date picker simple version</h1>
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
                  format: event.currentTarget.value as DatePickerProps.InputFormat,
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
                  inputFormat: event.currentTarget.value as DatePickerProps.InputFormat,
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
                  locale: event.currentTarget.value as DatePickerProps['locale'],
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
        <Link id="focus-dismiss-helper">Focusable element before the date picker</Link>
        <br />
        <FormField label="Certificate expiry date" constraintText={`Use YYYY/MM${monthOnly ? '' : '/DD'} format.`}>
          <DatePicker
            value={value}
            name={'date-picker-name'}
            granularity={monthOnly ? 'month' : 'day'}
            locale={locale}
            i18nStrings={i18nStrings}
            openCalendarAriaLabel={selectedDate =>
              'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
            }
            placeholder={inputFormatPlaceholderText}
            onChange={e => setValue(e.detail.value)}
            readOnly={readonly}
            disabled={disabled}
            format={format === '' ? undefined : format}
            inputFormat={inputFormat === '' ? undefined : inputFormat}
          />
        </FormField>
        <br />
        <br />
        <Link id="focusable-element-after-date-picker">Focusable element after the date picker</Link>
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}
