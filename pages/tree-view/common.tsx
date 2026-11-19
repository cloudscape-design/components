// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { SpaceBetween } from '~components';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import StatusIndicator from '~components/status-indicator/internal';

import { Item } from './items/dynamic-items';

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
  {
    actionType,
    itemLabel,
    disabled,
  }: {
    actionType?: 'button-group' | 'button-dropdown' | 'inline-button-dropdown' | 'text' | 'custom-inline-button-group';
    itemLabel?: string;
    disabled?: boolean;
  } = {
    actionType: 'inline-button-dropdown',
  }
) {
  const [markedAsFavorite, setMarkedAsFavorite] = useState(false);

  if (actionType === 'text') {
    return <Box color="text-status-inactive">Some metadata</Box>;
  }

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
            disabled,
          },
          {
            type: 'icon-toggle-button',
            id: 'favorite',
            text: 'Favorite',
            pressed: markedAsFavorite,
            iconName: 'star',
            pressedIconName: 'star-filled',
            disabled,
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
            setMarkedAsFavorite(!markedAsFavorite);
          }
        }}
        ariaLabel={itemLabel}
      />
    );
  }

  const buttonDropdownItems = [
    { id: 'start', text: 'Start' },
    { id: 'stop', text: 'Stop', disabled: true },
    {
      id: 'hibernate',
      text: 'Hibernate',
      disabled: true,
    },
    { id: 'reboot', text: 'Reboot', disabled: true },
    { id: 'terminate', text: 'Terminate' },
  ];

  if (actionType === 'custom-inline-button-group') {
    return (
      <SpaceBetween direction="horizontal" size="s">
        <Button variant="inline-icon" iconName="settings" disabled={disabled} ariaLabel={`Settings for ${itemLabel}`} />
        <Button variant="inline-icon" iconName="star" disabled={disabled} ariaLabel={`Favorite ${itemLabel}`} />
        <ButtonDropdown
          items={buttonDropdownItems}
          ariaLabel={`Control instance for ${itemLabel}`}
          variant="inline-icon"
          disabled={disabled}
        />
      </SpaceBetween>
    );
  }

  if (actionType === 'inline-button-dropdown') {
    return (
      <ButtonDropdown
        items={buttonDropdownItems}
        ariaLabel={`Control instance for ${itemLabel}`}
        variant="inline-icon"
        disabled={disabled}
      />
    );
  }

  return <ButtonDropdown items={buttonDropdownItems} ariaLabel={`Control instance for ${itemLabel}`} variant="icon" />;
}
