// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown from '~components/button-dropdown';
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

export function Actions(
  { actionType }: { actionType?: 'button-group' | 'button-dropdown' | 'inline-button-dropdown' } = {
    actionType: 'button-dropdown',
  }
) {
  const [pressed, setPressed] = useState(false);

  if (actionType === 'button-group') {
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
            type: 'icon-toggle-button',
            id: 'favorite',
            text: 'Favorite',
            pressed: pressed,
            iconName: 'star',
            pressedIconName: 'star-filled',
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
        onItemClick={({ detail }) => {
          if (detail.id === 'favorite') {
            setPressed(!pressed);
          }
        }}
      />
    );
  }

  if (actionType === 'inline-button-dropdown') {
    return (
      <ButtonDropdown
        items={[
          { id: 'start', text: 'Start' },
          { id: 'stop', text: 'Stop', disabled: true },
          {
            id: 'hibernate',
            text: 'Hibernate',
            disabled: true,
          },
          { id: 'reboot', text: 'Reboot', disabled: true },
          { id: 'terminate', text: 'Terminate' },
        ]}
        ariaLabel="Control instance"
        variant="inline-icon"
      />
    );
  }

  return (
    <ButtonDropdown
      items={[
        { id: 'start', text: 'Start' },
        { id: 'stop', text: 'Stop', disabled: true },
        {
          id: 'hibernate',
          text: 'Hibernate',
          disabled: true,
        },
        { id: 'reboot', text: 'Reboot', disabled: true },
        { id: 'terminate', text: 'Terminate' },
      ]}
      ariaLabel="Control instance"
      variant="icon"
    />
  );
}
