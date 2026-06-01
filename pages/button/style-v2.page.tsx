// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Button, Checkbox, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2ButtonPage() {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <SimplePage
      title="Button with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
            disabled
          </Checkbox>
          <Checkbox checked={loading} onChange={({ detail }) => setLoading(detail.checked)}>
            loading
          </Checkbox>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="m" direction="horizontal">
        <Button
          variant="primary"
          disabled={disabled}
          loading={loading}
          iconName="remove"
          className={styles['button-danger']}
        >
          Delete
        </Button>
        <Button variant="primary" disabled={disabled} loading={loading} className={styles['button-danger']}>
          Terminate instances
        </Button>
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <Button
          variant="icon"
          iconName="close"
          ariaLabel="Close"
          disabled={disabled}
          className={styles['button-icon-circle']}
        />
        <Button
          variant="icon"
          iconName="copy"
          ariaLabel="Copy"
          disabled={disabled}
          className={styles['button-icon-circle']}
        />
        <Button
          variant="icon"
          iconName="settings"
          ariaLabel="Settings"
          disabled={disabled}
          className={styles['button-icon-circle']}
        />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <Button variant="link" disabled={disabled} className={styles['button-link-custom']}>
          Learn more
        </Button>
        <Button
          variant="link"
          iconName="external"
          iconAlign="right"
          disabled={disabled}
          className={styles['button-link-custom']}
        >
          Documentation
        </Button>
      </SpaceBetween>
    </SimplePage>
  );
}
