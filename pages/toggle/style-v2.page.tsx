// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Checkbox, SpaceBetween, Toggle } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function ToggleStyleV2() {
  const [notifications, setNotifications] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <SimplePage
      title="Toggle with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
            disabled
          </Checkbox>
          <Checkbox checked={readOnly} onChange={({ detail }) => setReadOnly(detail.checked)}>
            readOnly
          </Checkbox>
        </SpaceBetween>
      }
    >
      <Toggle
        className={styles['toggle-success']}
        checked={notifications}
        disabled={disabled}
        readOnly={readOnly}
        onChange={({ detail }) => setNotifications(detail.checked)}
      >
        Enable notifications
      </Toggle>
    </SimplePage>
  );
}
