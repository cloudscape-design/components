// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { ActionCard, Checkbox, ColumnLayout, Icon, IconProps } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function ActionCardStyleV2Page() {
  const [disabled, setDisabled] = useState(false);
  const props = (header: string, description: string, iconName: IconProps.Name, className: string) => ({
    header,
    description,
    disabled,
    icon: <Icon name={iconName} />,
    className,
  });
  return (
    <SimplePage
      title="ActionCard with Style API v2"
      screenshotArea={{}}
      settings={
        <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
          Disable cards
        </Checkbox>
      }
    >
      <ColumnLayout columns={2}>
        <ActionCard {...props('Settings', 'Configure preferences', 'settings', '')} />
        <ActionCard {...props('Run Tests', 'Execute test suite', 'status-positive', styles['card-accent'])} />
        <ActionCard {...props('Deploy Service', 'Push changes to production', 'upload', styles['card-success'])} />
        <ActionCard {...props('Review Logs', 'Inspect application logs', 'status-warning', styles['card-warning'])} />
      </ColumnLayout>
    </SimplePage>
  );
}
