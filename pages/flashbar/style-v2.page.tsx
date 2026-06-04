// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Checkbox, Flashbar, FlashbarProps, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

const baseItems: FlashbarProps.MessageDefinition[] = [
  {
    type: 'success',
    header: 'Deployment complete',
    content: 'All resources have been successfully deployed to production.',
    dismissible: true,
    id: 'success-1',
    action: <Button>View details</Button>,
  },
  {
    type: 'error',
    header: 'Build failed',
    content: 'The pipeline encountered an error during the packaging stage.',
    dismissible: true,
    id: 'error-1',
    action: <Button>Retry</Button>,
  },
  {
    type: 'info',
    header: 'Maintenance scheduled',
    content: 'A maintenance window is scheduled for Saturday 2:00 AM UTC.',
    dismissible: true,
    id: 'info-1',
  },
  {
    type: 'warning',
    header: 'Certificate expiring',
    content: 'Your TLS certificate expires in 7 days. Renew to avoid service disruption.',
    dismissible: true,
    id: 'warning-1',
    action: <Button>Renew now</Button>,
  },
  {
    type: 'in-progress',
    header: 'Deployment in progress',
    content: 'Deploying version 2.4.1 to production environment.',
    loading: true,
    dismissible: true,
    id: 'in-progress-1',
  },
];

const itemClassNames: Record<string, string> = {
  success: styles['flash-success'],
  error: styles['flash-error'],
  info: styles['flash-info'],
  warning: styles['flash-warning'],
};

export default function FlashbarStyleV2Page() {
  const [stacked, setStacked] = useState(false);
  const [useCustom, setUseCustom] = useState(true);
  const [items, setItems] = useState(baseItems);

  return (
    <SimplePage
      title="Flashbar with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={useCustom} onChange={({ detail }) => setUseCustom(detail.checked)}>
            Custom styling
          </Checkbox>
          <Checkbox checked={stacked} onChange={({ detail }) => setStacked(detail.checked)}>
            Stacked
          </Checkbox>
        </SpaceBetween>
      }
    >
      <Flashbar
        items={items.map(item => ({
          ...item,
          className: useCustom ? itemClassNames[item.type ?? 'info'] : undefined,
          dismissButtonClassName: useCustom ? styles.dismiss : undefined,
          onDismiss: () => setItems(prev => prev.filter(i => i.id !== item.id)),
        }))}
        stackItems={stacked}
        i18nStrings={{ ariaLabel: 'Notifications' }}
        className={useCustom ? styles['styled-flashbar'] : undefined}
      />
    </SimplePage>
  );
}
