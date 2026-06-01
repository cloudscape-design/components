// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { ButtonGroup, ButtonGroupProps, Checkbox } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function ButtonGroupStyleV2Page() {
  const [isFavorite, setFavorite] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Actions',
      items: [
        { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy', disabled },
        { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit', disabled },
        { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete', disabled },
      ],
    },
    {
      type: 'group',
      text: 'Toggle',
      items: [
        {
          type: 'icon-toggle-button',
          id: 'favorite',
          iconName: 'star',
          pressedIconName: 'star-filled',
          text: isFavorite ? 'Unfavorite' : 'Favorite',
          pressed: isFavorite,
        },
      ],
    },
    {
      type: 'menu-dropdown',
      id: 'more',
      text: 'More',
      items: [
        { id: 'export', text: 'Export' },
        { id: 'share', text: 'Share' },
      ],
    },
  ];

  const handleClick = ({ detail }: { detail: { id: string; pressed?: boolean } }) => {
    if (detail.id === 'favorite') {
      setFavorite(detail.pressed ?? !isFavorite);
    }
  };

  return (
    <SimplePage
      title="ButtonGroup with Style API v2"
      screenshotArea={{}}
      settings={
        <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
          Disable actions
        </Checkbox>
      }
    >
      <ButtonGroup
        classNames={{ root: styles['button-group-minimal'] }}
        variant="icon"
        items={items}
        onItemClick={handleClick}
      />
      <ButtonGroup
        classNames={{ root: styles['button-group-card'] }}
        variant="icon"
        items={items}
        onItemClick={handleClick}
      />
    </SimplePage>
  );
}
