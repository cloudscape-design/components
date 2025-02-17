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
  }>
>;

export default function DateInputScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateInputDemoContext);
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
        <SpaceBetween direction="horizontal" size="s">
          <Checkbox checked={hasValue} onChange={({ detail }) => setUrlParams({ hasValue: detail.checked })}>
            Has initial value
          </Checkbox>
        </SpaceBetween>
        <DateInput
          className="testing-date-input"
          name="date"
          ariaLabel="Enter the date in YYYY/MM/DD"
          placeholder="YYYY/MM/DD"
          onChange={e => setValue(e.detail.value)}
          value={value}
        />
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}
