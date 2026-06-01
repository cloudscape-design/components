// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Checkbox, SpaceBetween, Textarea } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2TextareaPage() {
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [warning, setWarning] = useState(false);
  const [content, setContent] = useState('This is styled textarea content.\nIt supports multiple lines of text.');

  return (
    <SimplePage
      title="Textarea with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
            disabled
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
      <Textarea
        value={content}
        onChange={({ detail }) => setContent(detail.value)}
        disabled={disabled}
        invalid={invalid}
        warning={warning}
        rows={4}
        className={styles['styled-textarea']}
      />
    </SimplePage>
  );
}
