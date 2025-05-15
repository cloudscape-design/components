// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonGroup from '~components/button-group';
import StatusIndicator from '~components/status-indicator/internal';

import { Item } from './generate-data';

export function Content(item: Item) {
  if (item.status) {
    return <StatusIndicator type={item.status}>{item.name}</StatusIndicator>;
  }

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {item.name}

      {item.errorCount && item.errorCount > 0 && <StatusIndicator type="error">{item.errorCount}</StatusIndicator>}
      {item.warningCount && item.warningCount > 0 && (
        <StatusIndicator type="warning">{item.warningCount}</StatusIndicator>
      )}
      {item.successCount && item.successCount > 0 && (
        <StatusIndicator type="success">{item.successCount}</StatusIndicator>
      )}
    </div>
  );
}

export function Actions() {
  return (
    <ButtonGroup
      variant="icon"
      items={[
        {
          id: 'settings',
          iconName: 'settings',
          type: 'icon-button',
          text: 'Settings',
        },
        {
          id: 'menu',
          type: 'menu-dropdown',
          text: 'Menu',
          items: [
            { id: 'start', text: 'Start' },
            { id: 'stop', text: 'Stop', disabled: true },
            {
              id: 'hibernate',
              text: 'Hibernate',
              disabled: true,
            },
            { id: 'reboot', text: 'Reboot', disabled: true },
            { id: 'terminate', text: 'Terminate' },
          ],
        },
      ]}
      onItemClick={() => {}}
    />
  );
}
