// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Autosuggest, Checkbox, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2AutosuggestPage() {
  const [value, setValue] = useState('');
  const [styled, setStyled] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const groupedOptions = [
    {
      label: 'Compute',
      options: [
        { value: 'EC2', className: styled ? styles['option-compute'] : undefined },
        { value: 'Lambda', className: styled ? styles['option-compute'] : undefined },
        { value: 'ECS', className: styled ? styles['option-compute'] : undefined },
      ],
    },
    {
      label: 'Storage',
      options: [
        { value: 'S3', className: styled ? styles['option-storage'] : undefined },
        { value: 'EBS', className: styled ? styles['option-storage'] : undefined },
        { value: 'EFS', disabled: true, className: styled ? styles['option-storage'] : undefined },
      ],
    },
  ];

  return (
    <SimplePage
      title="Autosuggest with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={styled} onChange={({ detail }) => setStyled(detail.checked)}>
            styled
          </Checkbox>
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
      <Autosuggest
        value={value}
        onChange={({ detail }) => setValue(detail.value)}
        placeholder="Search services..."
        enteredTextLabel={v => `Use: ${v}`}
        options={groupedOptions}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        className={styled ? (invalid ? styles['styled-autosuggest-invalid'] : styles['styled-autosuggest']) : undefined}
      />
    </SimplePage>
  );
}
