// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Checkbox, DatePicker, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function DatePickerStyleV2Page() {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [value, setValue] = useState('2026-06-01');

  return (
    <SimplePage
      title="DatePicker with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
            disabled
          </Checkbox>
          <Checkbox checked={readOnly} onChange={({ detail }) => setReadOnly(detail.checked)}>
            readOnly
          </Checkbox>
          <Checkbox checked={invalid} onChange={({ detail }) => setInvalid(detail.checked)}>
            invalid
          </Checkbox>
        </SpaceBetween>
      }
    >
      <DatePicker
        value={value}
        onChange={({ detail }) => setValue(detail.value)}
        placeholder="YYYY/MM/DD"
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        classNames={{ root: styles['styled-date-picker'] }}
      />
    </SimplePage>
  );
}
