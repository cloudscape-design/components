// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import { Button } from '~components';
import ScreenshotArea from '../utils/screenshot-area';

const items: ButtonGroupProps.ItemOrGroup[] = [
  {
    id: 'vote',
    text: 'Vote',
    items: [
      {
        id: 'like',
        iconName: 'thumbs-up',
        text: 'Like',
        actionPopoverText: 'Liked',
      },
      {
        id: 'dislike',
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
      { id: 'search', iconName: 'search', text: 'Search' },
    ],
  },
];

export default function ButtonGroupPage() {
  const ref = React.useRef<ButtonGroupProps.Ref>(null);

  const onItemClick = (event: CustomEvent<ButtonGroupProps.ItemClickDetails>) => {
    document.querySelector('#last-clicked')!.textContent = event.detail.id;
  };

  const onFocusButtonClick = () => {
    ref.current?.focus('copy');
  };

  return (
    <>
      <ScreenshotArea disableAnimations={true}>
        <article>
          <h1>Button Group test page</h1>
          <ButtonGroup items={items} onItemClick={onItemClick} ref={ref} />
          <br />
          <Button onClick={onFocusButtonClick}>Focus on copy</Button>
          <br />
          <br />
          <div id="last-clicked"></div>
        </article>
      </ScreenshotArea>
    </>
  );
}
