// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Alert, AlertProps, Button, Checkbox, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function AlertStyleV2Page() {
  const [useCustom, setUseCustom] = useState(true);
  const [dismissible, setDismissible] = useState(true);
  const props = (
    type: AlertProps.Type,
    header: string,
    children: string,
    className: string,
    dismissClassName: string
  ) => ({
    type,
    header,
    children,
    dismissible,
    className: useCustom ? className : undefined,
    dismissClassName: useCustom ? dismissClassName : undefined,
  });
  return (
    <SimplePage
      title="Alert with Style API v2"
      screenshotArea={{}}
      i18n={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={useCustom} onChange={({ detail }) => setUseCustom(detail.checked)}>
            Custom styling
          </Checkbox>
          <Checkbox checked={dismissible} onChange={({ detail }) => setDismissible(detail.checked)}>
            Dismissible
          </Checkbox>
        </SpaceBetween>
      }
    >
      <Alert
        {...props(
          'info',
          'Information',
          'Your instance is running in the us-east-1 region.',
          styles['custom-alert'],
          styles['custom-dismiss']
        )}
      />
      <Alert
        {...props(
          'success',
          'Deployment successful',
          'All 3 stacks have been deployed without errors.',
          styles['custom-alert-success'],
          styles['custom-dismiss-success']
        )}
      />
      <Alert
        {...props(
          'warning',
          'Approaching limit',
          'You have used 85% of your allocated storage.',
          styles['custom-alert-warning'],
          styles['custom-dismiss-warning']
        )}
      />
      <Alert
        {...props(
          'error',
          'Connection failed',
          'Unable to reach the database endpoint. Check your security group rules.',
          styles['custom-alert-error'],
          styles['custom-dismiss-error']
        )}
        action={<Button>Retry</Button>}
      />
    </SimplePage>
  );
}
