// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import { Box, Button, SpaceBetween, StatusIndicator } from '~components';
import AppContext, { AppContextType } from '../app/app-context';

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

const removeButton: ButtonGroupProps.Item = {
  type: 'icon-button',
  id: 'remove',
  iconName: 'remove',
  text: 'Remove',
  popoverFeedback: 'Removed',
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

const actionsGroup: ButtonGroupProps.Group = {
  type: 'group',
  text: 'Actions',
  items: [addButton, removeButton, moreActionsMenu],
};

export default function ButtonGroupPage() {
  const {
    urlParams: { dropdownExpandToViewport = true },
  } = useContext(AppContext as PageContext);
  const ref = React.useRef<ButtonGroupProps.Ref>(null);

  const onItemClick: ButtonGroupProps['onItemClick'] = event => {
    document.querySelector('#last-clicked')!.textContent = event.detail.id;

    if (event.detail.id === 'dislike') {
      setItems([copyButton, actionsGroup]);
    }
  };

  const onFocusOnCopyButtonClick = () => {
    ref.current?.focus('copy');
  };

  const [items, setItems] = useState([feedbackGroup, copyButton, actionsGroup]);

  return (
    <Box margin="m">
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

        <div id="last-clicked"></div>
      </SpaceBetween>
    </Box>
  );
}
