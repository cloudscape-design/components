// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import { Button } from '~components';
import ScreenshotArea from '../utils/screenshot-area';

const copyAction: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'copy',
  iconName: 'copy',
  text: 'Copy',
  feedbackText: 'Copied',
};
const addAction: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'add',
  iconName: 'add-plus',
  text: 'Add',
  feedbackText: 'Added',
};
const removeAction: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'remove',
  iconName: 'remove',
  text: 'Remove',
  feedbackText: 'Failed to remove',
  popoverFeedbackType: 'error',
};
const moreActions: ButtonGroupProps.MenuDropdown = {
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
};

const itemsPending: ButtonGroupProps.Item[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [
      {
        type: 'icon-button',
        id: 'like',
        iconName: 'thumbs-up',
        text: 'Helpful',
      },
      {
        type: 'icon-button',
        id: 'dislike',
        iconName: 'thumbs-down',
        text: 'Not helpful',
      },
    ],
  },
  copyAction,
  addAction,
  removeAction,
  moreActions,
];

const itemsLiked: ButtonGroupProps.Item[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [
      {
        type: 'icon-button',
        id: 'like',
        iconName: 'thumbs-up-filled',
        text: 'Thanks for providing feedback',
        feedbackText: 'Helpful',
        feedbackMode: 'inline',
        disabled: true,
      },
    ],
  },
  copyAction,
  addAction,
  removeAction,
  moreActions,
];

const itemsDisliked: ButtonGroupProps.Item[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [
      {
        type: 'icon-button',
        id: 'dislike',
        iconName: 'thumbs-down-filled',
        text: 'Thanks for providing feedback',
        feedbackText: 'Not helpful',
        feedbackMode: 'inline',
        disabled: true,
      },
    ],
  },
  copyAction,
  addAction,
  removeAction,
  moreActions,
];

export default function ButtonGroupPage() {
  const ref = React.useRef<ButtonGroupProps.Ref>(null);

  const onItemClick: ButtonGroupProps['onItemClick'] = event => {
    document.querySelector('#last-clicked')!.textContent = event.detail.id;
    if (event.detail.id === 'like') {
      setFeedback('liked');
    } else if (event.detail.id === 'dislike') {
      setFeedback('disliked');
    }
  };

  const onFocusOnCopyButtonClick = () => {
    ref.current?.focus('copy');
  };

  const onFocusOnSearchButtonClick = () => {
    ref.current?.focus('search');
  };

  const [feedback, setFeedback] = useState<null | 'liked' | 'disliked'>(null);

  return (
    <>
      <ScreenshotArea disableAnimations={true}>
        <article>
          <h1>Button Group test page</h1>
          <ButtonGroup
            variant="icon"
            ariaLabel="Chat actions"
            items={feedback === 'liked' ? itemsLiked : feedback === 'disliked' ? itemsDisliked : itemsPending}
            onItemClick={onItemClick}
            ref={ref}
          />
          <br />
          <Button onClick={onFocusOnCopyButtonClick}>Focus on copy</Button>&nbsp;
          <Button onClick={onFocusOnSearchButtonClick}>Focus on item in the menu</Button>
          <br />
          <br />
          <div id="last-clicked"></div>
        </article>
      </ScreenshotArea>
    </>
  );
}
