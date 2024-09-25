// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<
  AppContextType<{
    dropdownExpandToViewport?: boolean;
  }>
>;

const likeButton: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'like',
  iconName: 'thumbs-up',
  text: 'Like',
  popoverFeedback: <StatusIndicator type="success">Liked</StatusIndicator>,
};

const dislikeButton: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'dislike',
  iconName: 'thumbs-down',
  text: 'Dislike',
  popoverFeedback: <StatusIndicator type="error">Disliked</StatusIndicator>,
};

const feedbackGroup: ButtonGroupProps.Group = {
  type: 'group',
  text: 'Vote',
  items: [likeButton, dislikeButton],
};

const copyButton: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'copy',
  iconName: 'copy',
  text: 'Copy',
  popoverFeedback: <StatusIndicator type="success">Copied</StatusIndicator>,
};

const addButton: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'add',
  iconName: 'add-plus',
  text: 'Add',
  popoverFeedback: 'Added',
  disabled: true,
};

const sendButton: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'send',
  iconName: 'send',
  text: 'Send',
};

const removeButton: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'remove',
  iconName: 'remove',
  text: 'Remove',
};

const redoButton: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'redo',
  iconName: 'redo',
  text: 'Redo',
};

const moreActionsMenu: ButtonGroupProps.MenuDropdown = {
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
};

export default function ButtonGroupPage() {
  const {
    urlParams: { dropdownExpandToViewport = true },
  } = useContext(AppContext as PageContext);
  const ref = React.useRef<ButtonGroupProps.Ref>(null);

  const [items, setItems] = useState([
    feedbackGroup,
    copyButton,
    addButton,
    sendButton,
    redoButton,
    removeButton,
    moreActionsMenu,
  ]);

  const onItemClick: ButtonGroupProps['onItemClick'] = event => {
    document.querySelector('#last-clicked')!.textContent = event.detail.id;

    if (event.detail.id === 'dislike') {
      setItems(prev => prev.filter(item => item.type !== 'group'));
    }
    if (event.detail.id === 'redo') {
      setItems(prev =>
        prev.map(item => (item.type === 'icon-button' && item.id === 'redo' ? { ...item, disabled: true } : item))
      );
    }
    if (event.detail.id === 'remove') {
      setItems(prev =>
        prev.map(item => (item.type === 'icon-button' && item.id === 'remove' ? { ...item, loading: true } : item))
      );
    }
  };

  const onFocusOnCopyButtonClick = () => {
    ref.current?.focus('copy');
  };

  const onFocusOnMoreActionsButtonClick = () => {
    ref.current?.focus('more-actions');
  };

  return (
    <ScreenshotArea disableAnimations={true}>
      <h1>Button Group test page</h1>
      <SpaceBetween size="m" direction="vertical">
        <Button data-testid="focus-before">Focus before</Button>

        <Box margin={{ vertical: 'xl' }}>
          <ButtonGroup
            ariaLabel="Chat actions"
            variant="icon"
            items={items}
            onItemClick={onItemClick}
            ref={ref}
            dropdownExpandToViewport={dropdownExpandToViewport}
          />
        </Box>

        <Button onClick={onFocusOnCopyButtonClick} data-testid="focus-on-copy">
          Focus on copy
        </Button>

        <Button onClick={onFocusOnMoreActionsButtonClick} data-testid="focus-on-more-actions">
          Focus on more actions
        </Button>

        <div id="last-clicked"></div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
