// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import ScreenshotArea from '../utils/screenshot-area';
import { Button } from '~components';

const groupDefault: ButtonGroupProps.Item = {
  type: 'group',
  text: 'Vote',
  items: [
    {
      type: 'icon-button',
      id: 'like',
      iconName: 'thumbs-up',
      text: 'Like',
    },
    {
      type: 'icon-button',
      id: 'dislike',
      iconName: 'thumbs-down',
      text: 'Dislike',
    },
  ],
};

const groupLike: ButtonGroupProps.Item = {
  type: 'group',
  text: 'Vote',
  items: [
    {
      type: 'feedback',
      id: 'like',
      iconName: 'thumbs-up-filled',
      text: 'Helpful',
    },
  ],
};

const groupDislike: ButtonGroupProps.Item = {
  type: 'group',
  text: 'Vote',
  items: [
    {
      type: 'feedback',
      id: 'dislike',
      iconName: 'thumbs-down-filled',
      text: 'Not helpful',
    },
  ],
};

const items: ButtonGroupProps.Item[] = [
  {
    type: 'icon-button',
    id: 'copy',
    iconName: 'copy',
    text: 'Copy',
    popoverFeedbackText: 'Copied',
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
        popoverFeedbackText: 'Added',
        disabled: true,
      },
      {
        type: 'icon-button',
        id: 'remove',
        iconName: 'remove',
        text: 'Remove',
        popoverFeedbackText: 'Removed',
        popoverFeedbackType: 'error',
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
  const [feedback, setFeedback] = React.useState<string>('');
  const group = feedback === 'like' ? groupLike : feedback === 'dislike' ? groupDislike : groupDefault;

  const onItemClick: ButtonGroupProps['onItemClick'] = event => {
    document.querySelector('#last-clicked')!.textContent = event.detail.id;

    if (event.detail.id === 'like' || event.detail.id === 'dislike') {
      setFeedback(event.detail.id);
    }
  };

  const onFocusOnCopyButtonClick = () => {
    ref.current?.focus('copy');
  };

  const onFocusOnSearchButtonClick = () => {
    ref.current?.focus('search');
  };

  return (
    <>
      <ScreenshotArea disableAnimations={true}>
        <article>
          <h1>Button Group test page</h1>
          <ButtonGroup
            ariaLabel="Chat actions"
            variant="icon"
            items={[group, ...items]}
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
