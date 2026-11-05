// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { DateInput, DateInputProps, KeyValuePairs } from '~components';

import { SimplePage } from '../app/templates';
import { getInputFieldClassNames } from '../style-api/input-field';

// The `input` slot forwards to the whole Input style API; the shared helper maps the owned states to classes.
function StyledDateInput({ value: initialValue, invalid, warning, disabled, readOnly, ...rest }: DateInputProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <DateInput
      {...rest}
      ariaLabel="Date input field"
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      invalid={invalid}
      warning={warning}
      disabled={disabled}
      readOnly={readOnly}
      {...{ styleClassNames: { input: getInputFieldClassNames({ invalid, warning, disabled, readOnly }) } }}
    />
  );
}

export default function () {
  return (
    <SimplePage title="Date input - Style API v2" screenshotArea={{}} i18n={{}}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            type: 'pair',
            label: 'Default',
            value: <StyledDateInput value="2024-03-15" />,
          },
          {
            type: 'pair',
            label: 'Placeholder',
            value: <StyledDateInput value="" placeholder="YYYY/MM/DD" />,
          },
          {
            type: 'pair',
            label: 'Invalid',
            value: <StyledDateInput value="2024-13-45" invalid={true} />,
          },
          {
            type: 'pair',
            label: 'Warning',
            value: <StyledDateInput value="1999-01-01" warning={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled',
            value: <StyledDateInput value="2024-03-15" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled with placeholder',
            value: <StyledDateInput value="" placeholder="YYYY/MM/DD" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: <StyledDateInput value="2024-03-15" readOnly={true} />,
          },
          {
            type: 'pair',
            label: 'Long localized format',
            value: <StyledDateInput value="2024-03-15" format="long-localized" locale="en-US" />,
          },
        ]}
      />
    </SimplePage>
  );
}
