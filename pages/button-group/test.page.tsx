// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import ScreenshotArea from '../utils/screenshot-area';
import { Button, StatusIndicator } from '~components';

const items: ButtonGroupProps.Item[] = [
  {
    type: 'group',
    text: 'Vote',
    items: [
      {
        type: 'icon-button',
        id: 'like',
        iconName: 'thumbs-up',
        text: 'Like',
        popoverFeedback: <StatusIndicator type="success">Liked</StatusIndicator>,
      },
      {
        type: 'icon-button',
        id: 'dislike',
        iconName: 'thumbs-down',
        text: 'Dislike',
        popoverFeedback: <StatusIndicator type="error">Disliked</StatusIndicator>,
      },
    ],
  },
  {
    type: 'icon-button',
    id: 'copy',
    iconName: 'copy',
    text: 'Copy',
    popoverFeedback: <StatusIndicator type="success">Copied</StatusIndicator>,
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
        popoverFeedback: 'Added',
        disabled: true,
      },
      {
        type: 'icon-button',
        id: 'remove',
        iconName: 'remove',
        text: 'Remove',
        popoverFeedback: 'Removed',
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
        disabled: true,
        disabledReason: 'No content to paste',
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
    document.querySelector('#last-clicked')!.textContent = event.detail.id;
  };

  const onFocusOnCopyButtonClick = () => {
    ref.current?.focus('copy');
  };

  const onFocusOnSearchButtonClick = () => {
    ref.current?.focus('search');
  };

  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>Button Group test page</h1>
        <ButtonGroup ariaLabel="Chat actions" variant="icon" items={items} onItemClick={onItemClick} ref={ref} />
        <br />
        <Button onClick={onFocusOnCopyButtonClick}>Focus on copy</Button>&nbsp;
        <Button onClick={onFocusOnSearchButtonClick}>Focus on item in the menu</Button>
        <br />
        <br />
        <div id="last-clicked"></div>
      </article>
    </ScreenshotArea>
  );
}
