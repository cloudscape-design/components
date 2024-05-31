// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import { Button } from '~components';
import ScreenshotArea from '../utils/screenshot-area';

const items1: ButtonGroupProps.ItemOrGroup[] = [
  {
    id: 'vote',
    text: 'Vote',
    items: [
      {
        id: 'thump-up',
        iconName: 'thumbs-up',
        text: 'Like',
        actionPopoverText: 'Liked',
        tooltipDisabled: true,
      },
      {
        id: 'thump-down',
        iconName: 'thumbs-down',
        text: 'Dislike',
        actionPopoverText: 'Disliked',
      },
    ],
  },
  {
    id: 'expand',
    iconName: 'treeview-expand',
    text: 'View',
  },
  {
    id: 'script',
    iconName: 'script',
    text: 'Script',
    disabled: true,
  },
];

const items2: ButtonGroupProps.ItemOrGroup[] = [
  {
    id: 'vote',
    text: 'Vote',
    items: [
      {
        id: 'thump-up',
        iconName: 'thumbs-up',
        text: 'Like',
        actionPopoverText: 'Liked',
      },
      {
        id: 'thump-down',
        iconName: 'thumbs-down',
        text: 'Dislike',
        actionPopoverText: 'Disliked',
      },
    ],
  },
  {
    id: 'copy',
    text: 'Copy',
    items: [
      {
        id: 'copy',
        iconName: 'copy',
        text: 'Copy',
        actionPopoverText: 'Copied',
      },
    ],
  },
  {
    id: 'add',
    iconName: 'add-plus',
    text: 'Add',
    actionPopoverText: 'Added',
  },
  {
    id: 'remove',
    iconName: 'remove',
    text: 'Remove',
    actionPopoverText: 'Removed',
  },
];

const items3: ButtonGroupProps.ItemOrGroup[] = [
  {
    id: 'vote',
    text: 'Vote',
    items: [
      {
        id: 'thump-up',
        iconName: 'thumbs-up',
        text: 'Like',
        actionPopoverText: 'Liked',
      },
      {
        id: 'thump-down',
        iconName: 'thumbs-down',
        text: 'Dislike',
        actionPopoverText: 'Disliked',
      },
    ],
  },
  {
    id: 'copy',
    text: 'Copy',
    items: [
      {
        id: 'copy',
        iconName: 'copy',
        text: 'Copy',
        actionPopoverText: 'Copied',
      },
    ],
  },
  {
    id: 'actions',
    text: 'Actions',
    items: [
      {
        id: 'add',
        iconName: 'add-plus',
        text: 'Add',
        actionPopoverText: 'Added',
      },
      {
        id: 'remove',
        iconName: 'remove',
        text: 'Remove',
        actionPopoverText: 'Removed',
      },
    ],
  },
  {
    id: 'cut',
    iconName: 'delete-marker',
    text: 'Cut',
    actionPopoverText: 'Cutted',
  },
  {
    id: 'paste',
    iconName: 'add-plus',
    text: 'Paste',
    actionPopoverText: 'Pasted',
  },
  {
    id: 'misc',
    text: 'Misc',
    items: [
      { id: 'edit', iconName: 'edit', text: 'Edit', actionPopoverText: 'Edited' },
      { id: 'open', iconName: 'file-open', text: 'Open', actionPopoverText: 'Opened' },
      { id: 'search', iconName: 'search', text: 'Search' },
    ],
  },
];

const items4: ButtonGroupProps.ItemOrGroup[] = [
  {
    id: 'vote',
    text: 'Vote',
    items: [
      {
        id: 'thump-up',
        iconName: 'thumbs-up',
        text: 'Like',
        actionPopoverText: 'Liked',
        loading: true,
      },
      {
        id: 'thump-down',
        iconName: 'thumbs-down',
        text: 'Dislike',
        actionPopoverText: 'Disliked',
      },
    ],
  },
  {
    id: 'expand',
    iconName: 'treeview-expand',
    text: 'View',
  },
];

export default function ButtonGroupPage() {
  const ref = React.useRef<ButtonGroupProps.Ref>(null);

  const onItemClick = (event: CustomEvent<ButtonGroupProps.ItemClickDetails>) => {
    console.log('Item clicked:', event.detail.id);
  };

  const onFocusButtonClick = () => {
    ref.current?.focus('copy');
  };

  return (
    <>
      <ScreenshotArea disableAnimations={true}>
        <article>
          <h1>Few Buttons</h1>
          <ol>
            <li>Tooltip disabled</li>
            <li>Tooltip enabled and actionPopoverText</li>
            <li>Tooltip enabled no actionPopoverText</li>
            <li>Disabled</li>
          </ol>
          <ButtonGroup items={items1} onItemClick={onItemClick} />
        </article>
        <article>
          <h1>More Buttons</h1>
          <ButtonGroup items={items2} onItemClick={onItemClick} />
        </article>
        <article>
          <h1>Group with overflow</h1>
          <ButtonGroup items={items3} onItemClick={onItemClick} ref={ref} />
          <br />
          <Button onClick={onFocusButtonClick}>Focus on copy</Button>
        </article>
        <article>
          <h1>Loading</h1>
          <ButtonGroup items={items4} onItemClick={onItemClick} />
        </article>
      </ScreenshotArea>
    </>
  );
}
