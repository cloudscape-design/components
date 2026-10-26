// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { ButtonGroup, ButtonGroupProps } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  const [pinned, setPinned] = useState(false);
  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Feedback',
      items: [
        { type: 'icon-button', id: 'like', iconName: 'thumbs-up', text: 'Like' },
        {
          type: 'icon-toggle-button',
          id: 'pin',
          iconName: 'star',
          pressedIconName: 'star-filled',
          text: 'Pin',
          pressed: pinned,
        },
      ],
    },
    {
      type: 'icon-copy-to-clipboard',
      id: 'copy',
      text: 'Copy',
      textToCopy: 'text',
      copySuccessText: 'Copied',
      copyErrorText: 'Failed',
    },
    { type: 'icon-file-input', id: 'upload', text: 'Upload' },
    {
      type: 'menu-dropdown',
      id: 'more',
      text: 'More actions',
      items: [
        { id: 'edit', text: 'Edit' },
        { id: 'delete', text: 'Delete' },
      ],
    },
  ];
  return (
    <SimplePage title="ButtonGroup - Style API v2" screenshotArea={{}}>
      <ButtonGroup
        variant="icon"
        ariaLabel="Actions"
        items={items}
        onItemClick={({ detail }) => detail.id === 'pin' && setPinned(!!detail.pressed)}
        {...{
          styleClassNames: {
            item: ({ item }: { item: ButtonGroupProps.Item }) =>
              item.type === 'menu-dropdown' ? styles['item-info'] : styles.item,
            divider: styles.divider,
            dropdown: styles['menu-info'],
          },
        }}
      />
    </SimplePage>
  );
}
