// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import ScreenshotArea from '../utils/screenshot-area';

const simpleItems: ButtonGroupProps['items'] = [
  { type: 'icon-button', id: 'thump-up', iconName: 'thumbs-up', text: 'Like' },
  { type: 'icon-button', id: 'thump-down', iconName: 'thumbs-down', text: 'Dislike' },
  { type: 'divider' },
  { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy', successText: 'Copied' },
  { type: 'divider' },
  { type: 'icon-button', id: 'add', iconName: 'add-plus', text: 'Add' },
  { type: 'icon-button', id: 'remove', iconName: 'remove', text: 'Remove' },
];

const items: ButtonGroupProps['items'] = [
  { type: 'icon-button', id: 'thump-up', iconName: 'thumbs-up', text: 'Like' },
  { type: 'icon-button', id: 'thump-down', iconName: 'thumbs-down', text: 'Dislike' },
  { type: 'divider' },
  { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy', successText: 'Copied' },
  { type: 'divider' },
  { type: 'icon-button', id: 'add', iconName: 'add-plus', text: 'Add' },
  { type: 'icon-button', id: 'remove', iconName: 'remove', text: 'Remove' },
  { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
  { type: 'icon-button', id: 'open', iconName: 'file-open', text: 'Open' },
  { type: 'icon-button', id: 'search', iconName: 'search', text: 'Search' },
];

export default function ButtonGroupPage() {
  const onItemClick = (event: CustomEvent<ButtonGroupProps.ItemClickDetails>) => {
    console.log('Item clicked:', event.detail.id);
  };

  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>Simple ButtonGroup</h1>
        <ButtonGroup items={simpleItems} onItemClick={onItemClick} />
      </article>
      <article>
        <h1>ButtonGroup with overflow</h1>
        <ButtonGroup items={items} onItemClick={onItemClick} />
      </article>
    </ScreenshotArea>
  );
}
