// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { KeyValuePairs, TimeInput, TimeInputProps } from '~components';

import { SimplePage } from '../app/templates';
import { getInputFieldClassNames } from '../style-api/input-field';

// The `input` slot forwards to the whole Input style API; the shared helper maps the owned states to classes.
function StyledTimeInput({ value: initialValue, invalid, warning, disabled, readOnly, ...rest }: TimeInputProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <TimeInput
      {...rest}
      ariaLabel="Time input field"
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
    <SimplePage title="Time input - Style API v2" screenshotArea={{}} i18n={{}}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            type: 'pair',
            label: 'Default',
            value: <StyledTimeInput value="14:30:00" />,
          },
          {
            type: 'pair',
            label: 'Placeholder',
            value: <StyledTimeInput value="" placeholder="hh:mm:ss" />,
          },
          {
            type: 'pair',
            label: 'Invalid',
            value: <StyledTimeInput value="25:99:00" invalid={true} />,
          },
          {
            type: 'pair',
            label: 'Warning',
            value: <StyledTimeInput value="23:59:59" warning={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled',
            value: <StyledTimeInput value="14:30:00" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled with placeholder',
            value: <StyledTimeInput value="" placeholder="hh:mm:ss" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: <StyledTimeInput value="14:30:00" readOnly={true} />,
          },
          {
            type: 'pair',
            label: '12-hour format',
            value: <StyledTimeInput value="02:30" format="hh:mm" use24Hour={false} />,
          },
        ]}
      />
    </SimplePage>
  );
}
