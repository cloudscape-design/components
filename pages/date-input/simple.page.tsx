// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import { Box, Checkbox, FormField, SpaceBetween } from '~components';
import DateInput, { DateInputProps } from '~components/date-input';

import { AppContextType } from '../app/app-context';
import AppContext from '../app/app-context';

export type DateInputDemoContext = React.Context<
  AppContextType<{
    monthOnly?: boolean;
    hasValue?: boolean;
    displayFormat?: DateInputProps['displayFormat'] | '';
    format?: DateInputProps['format'] | '';
    locale?: DateInputProps['locale'] | '';
  }>
>;

export default function DateInputScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateInputDemoContext);
  const initValue = '2025-02-14';
  const hasValue = urlParams.hasValue ?? false;
  const displayFormat = urlParams.displayFormat ?? '';
  const format = urlParams.format ?? '';
  const locale = urlParams.locale ?? 'en-US';
  const monthOnly = urlParams.monthOnly ?? false;
  const [value, setValue] = useState<DateInputProps['value']>('');
  const isIso = (displayFormat === 'long-localized' && format === 'iso') || displayFormat === 'iso';
  const inputFormatPlaceholderText = `YYYY${isIso ? '-' : '/'}MM${monthOnly ? `` : `${isIso ? '-' : '/'}DD`}`;

  useEffect(() => {
    if (hasValue) {
      setValue(initValue);
    } else {
      setValue('');
    }
  }, [hasValue]);

  const SimpleDateInput = (
    <DateInput
      className="testing-date-input"
      name="date"
      ariaLabel={`Enter the date in ${inputFormatPlaceholderText}`}
      placeholder={inputFormatPlaceholderText}
      onChange={e => setValue(e.detail.value)}
      value={value}
      format={format === '' ? undefined : format}
      displayFormat={displayFormat === '' ? undefined : displayFormat}
      granularity={monthOnly ? 'month' : 'day'}
      locale={locale}
    />
  );

  return (
    <Box padding="l">
      <SpaceBetween direction="vertical" size="m">
        <h1>Date input</h1>
        <SpaceBetween direction="horizontal" size="s">
          <Checkbox checked={hasValue} onChange={({ detail }) => setUrlParams({ hasValue: detail.checked })}>
            Has initial value
          </Checkbox>
          <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
            Month-only
          </Checkbox>
          <label>
            Display format
            <select
              value={displayFormat}
              onChange={event =>
                setUrlParams({
                  displayFormat: event.currentTarget.value as DateInputProps['displayFormat'],
                  format:
                    event.currentTarget.value === 'long-localized' ? format : ('default' as DateInputProps['format']),
                })
              }
            >
              <option value="">None (Default)</option>
              <option value="iso">Iso</option>
              <option value="long-localized">Long localized</option>
            </select>
          </label>
          <label>
            Format
            <select
              value={format}
              disabled={displayFormat !== 'long-localized'}
              onChange={event =>
                setUrlParams({
                  format: event.currentTarget.value as DateInputProps['format'],
                })
              }
            >
              <option value="">None (Default)</option>
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
        <h3>Simple</h3>
        {SimpleDateInput}
        <br />
        <h3>Simple wrapped in FormField component</h3>
        <FormField
          label="Form field date label"
          description="This is a description for a date in a form field."
          constraintText={`Enter ${inputFormatPlaceholderText}`}
        >
          {SimpleDateInput}
        </FormField>
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}
