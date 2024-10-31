// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { Box, Button, ButtonGroup, ButtonGroupProps, Header, SpaceBetween, StatusIndicator } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { enhanceWindow, WindowWithFlushResponse } from '../common/flush-response';
import ScreenshotArea from '../utils/screenshot-area';

declare const window: WindowWithFlushResponse;
enhanceWindow();

type PageContext = React.Context<
  AppContextType<{
    dropdownExpandToViewport?: boolean;
    manualServerMock?: boolean;
  }>
>;

export default function ButtonGroupPage() {
  const {
    urlParams: { dropdownExpandToViewport = true, manualServerMock = false },
  } = useContext(AppContext as PageContext);

  const ref = React.useRef<ButtonGroupProps.Ref>(null);
  const [feedback, setFeedback] = useState<'none' | 'like' | 'dislike'>('none');
  const [isFavorite, setFavorite] = useState(false);
  const [loadingId, setLoading] = useState<null | string>(null);
  const [canSend, setCanSend] = useState(true);
  const [canRedo, setCanRedo] = useState(true);

  const feedbackGroup: ButtonGroupProps.Group = {
    type: 'group',
    text: 'Vote',
    items: [
      {
        type: 'icon-button',
        id: 'like',
        iconName: feedback === 'like' ? 'thumbs-up-filled' : 'thumbs-up',
        text: 'Like',
      },
      {
        type: 'icon-button',
        id: 'dislike',
        iconName: feedback === 'dislike' ? 'thumbs-down-filled' : 'thumbs-down',
        text: 'Dislike',
      },
    ],
  };

  const favoriteGroup: ButtonGroupProps.Group = {
    type: 'group',
    text: 'Favorite',
    items: [
      {
        type: 'icon-button',
        id: 'favorite',
        iconName: isFavorite ? 'star-filled' : 'star',
        text: 'Add to favorites',
        loading: loadingId === 'favorite',
        popoverFeedback: loadingId === 'favorite' ? '...' : isFavorite ? 'Set as favorite' : 'Removed',
      },
    ],
  };

  const sendGroup: ButtonGroupProps.Group = {
    type: 'group',
    text: 'Send',
    items: [
      {
        type: 'icon-button',
        id: 'send',
        iconName: 'send',
        text: 'Send',
      },
    ],
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
    loading: loadingId === 'add',
  };

  const removeButton: ButtonGroupProps.Item = {
    type: 'icon-button',
    id: 'remove',
    iconName: 'remove',
    text: 'Remove',
    disabled: loadingId === 'remove',
    popoverFeedback:
      loadingId === 'remove' ? (
        <StatusIndicator type="loading">Removing</StatusIndicator>
      ) : (
        <StatusIndicator>Removed</StatusIndicator>
      ),
  };

  const redoButton: ButtonGroupProps.Item = {
    type: 'icon-button',
    id: 'redo',
    iconName: 'redo',
    text: 'Redo',
    disabled: !canRedo,
  };

  const moreActionsMenu: ButtonGroupProps.MenuDropdown = {
    type: 'menu-dropdown',
    id: 'more-actions',
    text: 'More actions',
    loading: !!(loadingId && ['cut', 'paste', 'edit', 'open', 'search'].includes(loadingId)),
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

  function canRenderItem(item: ButtonGroupProps.ItemOrGroup) {
    if (item.type === 'group' && item.text === 'Send' && !canSend) {
      return false;
    }
    return true;
  }
  const items = [
    feedbackGroup,
    favoriteGroup,
    sendGroup,
    copyButton,
    addButton,
    removeButton,
    redoButton,
    moreActionsMenu,
  ].filter(canRenderItem);

  const onItemClick: ButtonGroupProps['onItemClick'] = ({ detail }) => {
    function addLog(text: string) {
      const entry = document.createElement('div');
      entry.textContent = text;
      document.querySelector('#log')!.append(entry);
    }

    function syncAction(action?: () => void) {
      addLog(detail.id);
      action?.();
    }

    function asyncAction(action?: () => void) {
      setLoading(detail.id);
      const callback = () => {
        setLoading(null);
        addLog(detail.id);
        action?.();
      };
      if (manualServerMock) {
        window.__pendingCallbacks.push(callback);
      } else {
        setTimeout(callback, 1000);
      }
    }

    switch (detail.id) {
      case 'like':
      case 'dislike':
        return syncAction(() => setFeedback(prev => (prev !== detail.id ? (detail.id as 'like' | 'dislike') : 'none')));
      case 'favorite':
        return asyncAction(() => setFavorite(prev => !prev));
      case 'send':
        return syncAction(() => setCanSend(false));
      case 'redo':
        return syncAction(() => setCanRedo(false));
      case 'add':
      case 'remove':
      case 'open':
        return asyncAction();
      default:
        return syncAction();
    }
  };

  return (
    <ScreenshotArea disableAnimations={true}>
      <SpaceBetween size="m">
        <Header variant="h1">Button Group test page</Header>

        <Button data-testid="focus-before">Focus before</Button>

        <Box margin={{ vertical: 'xl' }}>
          <ButtonGroup
            ref={ref}
            ariaLabel="Chat actions"
            variant="icon"
            items={items}
            onItemClick={onItemClick}
            dropdownExpandToViewport={dropdownExpandToViewport}
          />
        </Box>

        <Button onClick={() => ref.current?.focus('copy')} data-testid="focus-on-copy">
          Focus on copy
        </Button>

        <Button onClick={() => ref.current?.focus('more-actions')} data-testid="focus-on-more-actions">
          Focus on more actions
        </Button>

        <Box>
          <div id="log"></div>
        </Box>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
