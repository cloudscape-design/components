// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { Box, Button, ButtonGroup, ButtonGroupProps, Header, SpaceBetween, StatusIndicator } from '~components';
import FileTokenGroup from '~components/file-token-group';

import AppContext, { AppContextType } from '../app/app-context';
import { enhanceWindow, WindowWithFlushResponse } from '../common/flush-response';
import { i18nStrings } from '../file-upload/shared';
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
  const [useExperimentalFeatures, setUseExperimentalFeatures] = useState(false);
  const [loadingId, setLoading] = useState<null | string>(null);
  const [canSend, setCanSend] = useState(true);
  const [canRedo, setCanRedo] = useState(true);
  const [files, setFiles] = useState<File[]>([]);

  const toggleTexts = {
    like: ['Like', 'Liked'],
    dislike: ['Dislike', 'Disliked'],
    favorite: ['Add to favorites', 'Added to favorites'],
  };

  const toggleFeedbackGroup: ButtonGroupProps.Group = {
    type: 'group',
    text: 'Toggle feedback group',
    items: [
      {
        type: 'icon-toggle-button',
        id: 'like',
        iconName: 'thumbs-up',
        pressedIconName: 'thumbs-up-filled',
        text: feedback === 'like' ? toggleTexts.like[1] : toggleTexts.like[0],
        pressed: feedback === 'like',
      },
      {
        type: 'icon-toggle-button',
        id: 'dislike',
        iconName: 'thumbs-down',
        pressedIconName: 'thumbs-down-filled',
        text: feedback === 'dislike' ? toggleTexts.dislike[1] : toggleTexts.dislike[0],
        pressed: feedback === 'dislike',
      },
    ],
  };

  const fileGroup: ButtonGroupProps.Group = {
    type: 'group',
    text: 'Files',
    items: [
      {
        type: 'icon-file-input',
        id: 'file-input',
        text: 'Choose files',
        multiple: true,
        accept: 'image/png, image/jpeg',
      },
    ],
  };

  const favoriteGroup: ButtonGroupProps.Group = {
    type: 'group',
    text: 'Favorite',
    items: [
      {
        type: 'icon-toggle-button',
        id: 'favorite',
        iconName: 'star',
        pressedIconName: 'star-filled',
        text: isFavorite ? toggleTexts.favorite[1] : toggleTexts.favorite[0],
        loading: loadingId === 'favorite',
        pressed: isFavorite,
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

  const disabledReasonGroup: ButtonGroupProps.Group = {
    type: 'group',
    text: 'Disabled reason group',
    items: [
      {
        type: 'icon-button',
        id: 'icon-button-disabled-reason',
        iconName: 'thumbs-up',
        text: 'Helpful',
        disabled: true,
        disabledReason: 'Disabled reason icon-button',
      },
      {
        type: 'icon-toggle-button',
        id: 'icon-toggle-button-disabled-reason',
        iconName: 'thumbs-down',
        pressedIconName: 'thumbs-down-filled',
        text: 'Not helpful',
        pressed: false,
        disabled: true,
        disabledReason: 'Disabled reason icon-toggle-button',
      },
      {
        type: 'menu-dropdown',
        id: 'menu-dropdown-disabled-reason',
        text: 'More actions',
        disabled: true,
        disabledReason: 'Disabled reason menu-dropdown',
        items: [
          {
            id: 'cut',
            iconName: 'delete-marker',
            text: 'Cut',
          },
        ],
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
      {
        text: 'Settings',
        items: [
          {
            id: 'experimental-features',
            itemType: 'checkbox',
            iconName: 'bug',
            text: 'Experimental features',
            checked: useExperimentalFeatures,
          },
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
    fileGroup,
    toggleFeedbackGroup,
    favoriteGroup,
    sendGroup,
    copyButton,
    addButton,
    removeButton,
    redoButton,
    moreActionsMenu,
    disabledReasonGroup,
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
        return syncAction(() => setFeedback(detail.pressed ? (detail.id as 'like' | 'dislike') : 'none'));
      case 'favorite':
        return asyncAction(() => setFavorite(!!detail.pressed));
      case 'send':
        return syncAction(() => setCanSend(false));
      case 'redo':
        return syncAction(() => setCanRedo(false));
      case 'add':
      case 'remove':
      case 'open':
        return asyncAction();
      case 'experimental-features':
        return syncAction(() => setUseExperimentalFeatures(!!detail.pressed));
      case 'file-input':
      default:
        return syncAction();
    }
  };

  const onFilesChange: ButtonGroupProps['onFilesChange'] = ({ detail }) => {
    return setFiles(detail.files);
  };

  const onDismiss = (event: { detail: { fileIndex: number } }) => {
    const newItems = [...files];
    newItems.splice(event.detail.fileIndex, 1);
    setFiles(newItems);
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
            onFilesChange={onFilesChange}
            dropdownExpandToViewport={dropdownExpandToViewport}
          />
        </Box>

        <Button onClick={() => ref.current?.focus('copy')} data-testid="focus-on-copy">
          Focus on copy
        </Button>

        <Button onClick={() => ref.current?.focus('more-actions')} data-testid="focus-on-more-actions">
          Focus on more actions
        </Button>

        <FileTokenGroup
          items={files.map(file => ({
            file,
          }))}
          onDismiss={onDismiss}
          i18nStrings={i18nStrings}
          alignment="horizontal"
        />

        <Box>
          <div id="log"></div>
        </Box>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
