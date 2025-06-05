// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, DatePicker, DatePickerProps, Link } from '~components';

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
  const { urlParams } = useContext(AppContext as DatePickerDemoContext);
  const [value, setValue] = useState('2018-01-02');
  const inputFormat = urlParams.inputFormat ?? '';
  const format = urlParams.format ?? '';
  const monthOnly = urlParams.monthOnly ?? false;
  const isIso = (format === 'long-localized' && inputFormat === 'iso') || inputFormat === 'iso';
  const inputFormatPlaceholderText = `YYYY${isIso ? '-' : '/'}MM${monthOnly ? `` : `${isIso ? '-' : '/'}DD`}`;

  return (
    <Box padding="s">
      <h1>Date picker with a default date</h1>
      <Link id="focus-dismiss-helper">Focusable element</Link>
      <br />
      <br />
      <DatePicker
        value={value}
        name={'date-picker-name'}
        ariaLabel={'date-picker-label'}
        granularity={monthOnly ? 'month' : 'day'}
        locale="en-GB"
        format={format === '' ? undefined : format}
        inputFormat={inputFormat === '' ? undefined : inputFormat}
        i18nStrings={i18nStrings}
        placeholder={inputFormatPlaceholderText}
        onChange={event => setValue(event.detail.value)}
        openCalendarAriaLabel={selectedDate =>
          'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
        }
      />
    </Box>
  );
}
