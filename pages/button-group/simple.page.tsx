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
    id: 'expand',
    iconName: 'treeview-expand',
    text: 'View',
  },
  {
    id: 'thump-up',
    iconName: 'thumbs-up',
    text: 'Like',
    actionPopoverText: 'Liked',
    loading: true,
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
    iconName: 'copy',
    text: 'Copy',
    actionPopoverText: 'Copied',
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
    iconName: 'copy',
    text: 'Copy',
    actionPopoverText: 'Copied',
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
      { id: 'search', iconName: 'search', text: 'Search', actionPopoverText: 'Search' },
    ],
  },
];

export default function ButtonGroupPage() {
  const ref = React.useRef<ButtonGroupProps.Ref>(null);

  const onItemClick = (event: CustomEvent<ButtonGroupProps.ItemClickDetails>) => {
    console.log('Item clicked:', event.detail.id);
  };

  const onFocusOnCopyButtonClick = () => {
    ref.current?.focus('copy');
  };

  const onFocusOnCutButtonClick = () => {
    ref.current?.focus('cut');
  };

  return (
    <>
      <ScreenshotArea disableAnimations={true}>
        <article>
          <h1>Few Buttons</h1>
          <ol>
            <li>fallback</li>
            <li>no actionPopoverText</li>
            <li>loading</li>
            <li>disabled</li>
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
          <Button onClick={onFocusOnCopyButtonClick}>Focus on copy</Button>&nbsp;
          <Button onClick={onFocusOnCutButtonClick}>Focus on aditional items</Button>
        </article>
      </ScreenshotArea>
    </>
  );
}
