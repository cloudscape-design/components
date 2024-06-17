// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import { Button } from '~components';
import ScreenshotArea from '../utils/screenshot-area';

const items1: ButtonGroupProps.Item[] = [
  {
    type: 'group',
    text: 'Vote',
    items: [
      {
        type: 'icon-button',
        id: 'thumbs-up',
        text: 'Like',
        actionPopoverText: 'Liked',
      },
      {
        type: 'icon-button',
        id: 'thumbs-down',
        iconName: 'thumbs-down',
        text: 'Dislike',
        actionPopoverText: 'Disliked',
      },
    ],
  },
  {
    type: 'icon-button',
    id: 'expand',
    iconName: 'treeview-expand',
    text: 'View',
  },
  {
    type: 'icon-button',
    id: 'favorite',
    iconName: 'star',
    text: 'Favorite',
    actionPopoverText: 'Added to favorites',
    loading: true,
  },
  {
    type: 'icon-button',
    id: 'script',
    iconName: 'script',
    text: 'Script',
    disabled: true,
  },
];

const items2: ButtonGroupProps.Item[] = [
  {
    type: 'group',
    text: 'Vote',
    items: [
      {
        type: 'icon-button',
        id: 'thumbs-up',
        iconName: 'thumbs-up',
        text: 'Like',
        actionPopoverText: 'Liked',
      },
      {
        type: 'icon-button',
        id: 'thumbs-down',
        iconName: 'thumbs-down',
        text: 'Dislike',
        actionPopoverText: 'Disliked',
      },
    ],
  },
  {
    type: 'icon-button',
    id: 'copy',
    iconName: 'copy',
    text: 'Copy',
    actionPopoverText: 'Copied',
  },
  {
    type: 'icon-button',
    id: 'add',
    iconName: 'add-plus',
    text: 'Add',
    actionPopoverText: 'Added',
  },
  {
    type: 'icon-button',
    id: 'remove',
    iconName: 'remove',
    text: 'Remove',
    actionPopoverText: 'Removed',
  },
];

const items3: ButtonGroupProps.Item[] = [
  {
    type: 'group',
    text: 'Vote',
    items: [
      {
        type: 'icon-button',
        id: 'thumbs-up',
        iconName: 'thumbs-up',
        text: 'Like',
        actionPopoverText: 'Liked',
      },
      {
        type: 'icon-button',
        id: 'thumbs-down',
        iconName: 'thumbs-down',
        text: 'Dislike',
        actionPopoverText: 'Disliked',
      },
    ],
  },
  {
    type: 'icon-button',
    id: 'copy',
    iconName: 'copy',
    text: 'Copy',
    actionPopoverText: 'Copied',
  },
  {
    type: 'group',
    text: 'Actions',
    items: [
      {
        type: 'icon-button',
        id: 'add',
        iconName: 'add-plus',
        text: 'Add',
        actionPopoverText: 'Added',
      },
      {
        type: 'icon-button',
        id: 'remove',
        iconName: 'remove',
        text: 'Remove',
        actionPopoverText: 'Removed',
      },
    ],
  },
  {
    type: 'menu-dropdown',
    id: 'more-actions',
    text: 'More actions',
    items: [
      {
        id: 'cut',
        iconName: 'delete-marker',
        text: 'Cut',
      },
      {
        id: 'paste',
        iconName: 'add-plus',
        text: 'Paste',
      },
      {
        text: 'Misc',
        items: [
          { id: 'edit', iconName: 'edit', text: 'Edit' },
          { id: 'open', iconName: 'file-open', text: 'Open' },
          { id: 'search', iconName: 'search', text: 'Search' },
        ],
      },
    ],
  },
];

export default function ButtonGroupPage() {
  const ref = React.useRef<ButtonGroupProps.Ref>(null);

  const onItemClick: ButtonGroupProps['onItemClick'] = event => {
    console.log('Item clicked:', event.detail.id);
  };

  const onFocusOnThumbsUpButtonClick = () => {
    ref.current?.focus('thumbs-up');
  };

  const onFocusOnSearchButtonClick = () => {
    ref.current?.focus('search');
  };

  return (
    <>
      <ScreenshotArea disableAnimations={true}>
        <article>
          <h1>Few Buttons</h1>
          <ol>
            <li>fallback</li>
            <li>actionPopoverText</li>
            <li>no actionPopoverText</li>
            <li>loading</li>
            <li>disabled</li>
          </ol>
          <ButtonGroup variant="icon" items={items1} onItemClick={onItemClick} />
        </article>
        <article>
          <h1>More Buttons</h1>
          <ButtonGroup variant="icon" items={items2} onItemClick={onItemClick} />
        </article>
        <article>
          <h1>Group with overflow</h1>
          <ButtonGroup variant="icon" items={items3} onItemClick={onItemClick} ref={ref} />
          <br />
          <Button onClick={onFocusOnThumbsUpButtonClick}>Focus on thumbs-up</Button>&nbsp;
          <Button onClick={onFocusOnSearchButtonClick}>Focus on aditional items</Button>
        </article>
      </ScreenshotArea>
    </>
  );
}
