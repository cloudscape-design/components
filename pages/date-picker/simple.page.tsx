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
  }>
>;

export const dateRangePickerDemoDefaults = {
  monthOnly: false,
  hasValue: false,
};

export default function DateInputScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DatePickerDemoContext);
  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const hasValue = urlParams.hasValue ?? dateRangePickerDemoDefaults.hasValue;

  const [value, setValue] = useState<DatePickerProps['value']>('');

  useEffect(() => {
    const initValue = monthOnly ? '2025-02' : '2025-02-00';
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
          <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
            Month-only
          </Checkbox>
          <Checkbox checked={hasValue} onChange={({ detail }) => setUrlParams({ hasValue: detail.checked })}>
            Has initial value
          </Checkbox>
        </SpaceBetween>
        <Link id="focus-dismiss-helper">Focusable element before the date picker</Link>
        <br />
        <FormField label="Certificate expiry date" constraintText={`Use YYYY/MM${monthOnly ? '' : '/DD'} format.`}>
          <DatePicker
            value={value}
            name={'date-picker-name'}
            granularity={monthOnly ? 'month' : 'day'}
            locale="en-GB"
            i18nStrings={i18nStrings}
            openCalendarAriaLabel={selectedDate =>
              'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
            }
            placeholder={monthOnly ? 'YYYY/MM' : 'YYYY/MM/DD'}
            onChange={e => setValue(e.detail.value)}
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
