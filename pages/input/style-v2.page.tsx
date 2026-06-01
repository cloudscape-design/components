// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Checkbox, Input, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2InputPage() {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [warning, setWarning] = useState(false);
  const [textValue, setTextValue] = useState('Hello world');
  return (
    <SimplePage
      title="Input with Style API v2"
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
          <Checkbox checked={warning} onChange={({ detail }) => setWarning(detail.checked)}>
            warning
          </Checkbox>
        </SpaceBetween>
      }
    >
      <Input
        value={textValue}
        onChange={({ detail }) => setTextValue(detail.value)}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        warning={warning}
        classNames={{ root: styles['styled-input'] }}
      />
    </SimplePage>
  );
}
