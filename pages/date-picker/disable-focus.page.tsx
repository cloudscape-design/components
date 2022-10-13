// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, DatePicker, Checkbox, FormField, TimeInput, SpaceBetween } from '~components';

export default function DatePickerScenario() {
  const [disabled, setDisabled] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [error, setError] = useState<undefined | string>(undefined);

  const onBlur = () => {
    if (dateValue.includes('2022')) {
      setError("Can't use 2022, choose a better year");
    } else {
      setError(undefined);
    }
  };

  return (
    <Box padding="s">
      <h1>Date picker simple version</h1>
      <br />
      <Checkbox checked={disabled} onChange={event => setDisabled(event.detail.checked)}>
        Disabled
      </Checkbox>
      <br />
      <FormField errorText={error}>
        <SpaceBetween direction="horizontal" size="s">
          <FormField label="Start date">
            <DatePicker
              value={dateValue}
              name={'date-picker-name'}
              ariaLabel={'date-picker-label'}
              locale="en-GB"
              previousMonthAriaLabel={'Previous month'}
              nextMonthAriaLabel={'Next month'}
              todayAriaLabel={'TEST TODAY'}
              openCalendarAriaLabel={selectedDate =>
                'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
              }
              placeholder={'YYYY/MM/DD'}
              onChange={event => setDateValue(event.detail.value)}
              disabled={disabled}
              onBlur={onBlur}
            />
          </FormField>

          <FormField label="Start time">
            <TimeInput
              placeholder="hh:mm"
              value={timeValue}
              onChange={event => setTimeValue(event.detail.value)}
              disabled={disabled}
              onBlur={onBlur}
            />
          </FormField>
        </SpaceBetween>
      </FormField>
      <br />
    </Box>
  );
}
