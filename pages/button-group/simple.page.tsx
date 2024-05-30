// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import ScreenshotArea from '../utils/screenshot-area';

const items1: ButtonGroupProps['items'] = [
  {
    type: 'button',
    variant: 'icon',
    id: 'thump-up',
    iconName: 'thumbs-up',
    text: 'Like',
    actionPopoverText: 'Liked',
    tooltipDisabled: true,
  },
  {
    type: 'button',
    variant: 'icon',
    id: 'thump-down',
    iconName: 'thumbs-down',
    text: 'Dislike',
    actionPopoverText: 'Disliked',
  },
  {
    type: 'button',
    variant: 'icon',
    id: 'thump-down',
    iconName: 'treeview-expand',
    text: 'View',
  },
];

const items2: ButtonGroupProps['items'] = [
  {
    type: 'button',
    variant: 'icon',
    id: 'thump-up',
    iconName: 'thumbs-up',
    text: 'Like',
    actionPopoverText: 'Liked',
  },
  {
    type: 'button',
    variant: 'icon',
    id: 'thump-down',
    iconName: 'thumbs-down',
    text: 'Dislike',
    actionPopoverText: 'Disliked',
  },
  { type: 'divider' },
  {
    type: 'button',
    variant: 'icon',
    id: 'copy',
    iconName: 'copy',
    text: 'Copy',
    actionPopoverText: 'Copied',
  },
  { type: 'divider' },
  {
    type: 'button',
    variant: 'icon',
    id: 'add',
    iconName: 'add-plus',
    text: 'Add',
    actionPopoverText: 'Added',
  },
  {
    type: 'button',
    variant: 'icon',
    id: 'remove',
    iconName: 'remove',
    text: 'Remove',
    actionPopoverText: 'Removed',
  },
];

const items3: ButtonGroupProps['items'] = [
  {
    type: 'button',
    variant: 'icon',
    id: 'thump-up',
    iconName: 'thumbs-up',
    text: 'Like',
    actionPopoverText: 'Liked',
  },
  {
    type: 'button',
    variant: 'icon',
    id: 'thump-down',
    iconName: 'thumbs-down',
    text: 'Dislike',
    actionPopoverText: 'Disliked',
  },
  { type: 'divider' },
  {
    type: 'button',
    variant: 'icon',
    id: 'copy',
    iconName: 'copy',
    text: 'Copy',
    actionPopoverText: 'Copied',
  },
  { type: 'divider' },
  {
    type: 'button',
    variant: 'icon',
    id: 'add',
    iconName: 'add-plus',
    text: 'Add',
    actionPopoverText: 'Added',
  },
  {
    type: 'button',
    variant: 'icon',
    id: 'remove',
    iconName: 'remove',
    text: 'Remove',
    actionPopoverText: 'Removed',
  },
  { type: 'button', variant: 'icon', id: 'edit', iconName: 'edit', text: 'Edit' },
  { type: 'button', variant: 'icon', id: 'open', iconName: 'file-open', text: 'Open' },
  { type: 'button', variant: 'icon', id: 'search', iconName: 'search', text: 'Search' },
];

const items4: ButtonGroupProps['items'] = [
  {
    type: 'button',
    id: 'thump-up',
    iconName: 'thumbs-up',
    text: 'Like',
    actionPopoverText: 'Liked',
  },
  {
    type: 'button',
    id: 'thump-down',
    text: 'Open',
    actionPopoverText: 'Disliked',
  },
  { type: 'divider' },
  {
    type: 'button',
    variant: 'icon',
    id: 'copy',
    iconName: 'copy',
    text: 'Copy',
    actionPopoverText: 'Copied',
  },
  { type: 'divider' },
  {
    type: 'button',
    variant: 'icon',
    id: 'add',
    iconName: 'add-plus',
    text: 'Add',
    actionPopoverText: 'Added',
  },
  {
    type: 'button',
    variant: 'icon',
    id: 'remove',
    iconName: 'remove',
    text: 'Remove',
    actionPopoverText: 'Removed',
  },
  { type: 'button', variant: 'icon', id: 'edit', iconName: 'edit', text: 'Edit' },
  { type: 'button', variant: 'icon', id: 'open', iconName: 'file-open', text: 'Open' },
  { type: 'button', id: 'search', text: 'Search' },
];

export default function ButtonGroupPage() {
  const onItemClick = (event: CustomEvent<ButtonGroupProps.ItemClickDetails>) => {
    console.log('Item clicked:', event.detail.id);
  };

  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>Few Buttons</h1>
        <ButtonGroup items={items1} onItemClick={onItemClick} />
      </article>
      <article>
        <h1>More Buttons</h1>
        <ButtonGroup items={items2} onItemClick={onItemClick} />
      </article>
      <article>
        <h1>Group with overflow</h1>
        <ButtonGroup items={items3} onItemClick={onItemClick} />
      </article>
      <article>
        <h1>Group with different button variants</h1>
        <ButtonGroup items={items4} onItemClick={onItemClick} />
      </article>
    </ScreenshotArea>
  );
}
