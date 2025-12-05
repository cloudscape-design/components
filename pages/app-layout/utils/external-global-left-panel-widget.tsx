// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { Box, Button, SplitView } from '~components';
import { registerLeftDrawer, updateDrawer } from '~components/internal/plugins/widget';
import { mount, unmount } from '~mount';

import styles from '../styles.scss';

const DEFAULT_SIZE = 360;
const CHAT_SIZE = 280;
const MIN_CHAT_SIZE = 150;
const MIN_ARTIFACT_SIZE = 360;

const AIDrawer = () => {
  const [hasArtifact, setHasArtifact] = useState(false);
  const [artifactLoaded, setArtifactLoaded] = useState(false);
  const [chatSize, setChatSize] = useState(CHAT_SIZE);
  const [_maxPanelSize, ref] = useContainerQuery(entry => entry.contentBoxWidth - MIN_ARTIFACT_SIZE);
  const maxPanelSize = _maxPanelSize ?? Number.MAX_SAFE_INTEGER;
  const constrainedChatSize = Math.min(chatSize, maxPanelSize);
  const collapsed = constrainedChatSize < MIN_CHAT_SIZE;

  const chatContent = (
    <>
      <Box variant="h2" padding={{ bottom: 'm' }}>
        Chat demo
      </Box>
      <Button
        onClick={() => {
          setHasArtifact(true);
          updateDrawer({ type: 'expandDrawer', payload: { id: 'ai-panel' } });
          updateDrawer({
            type: 'updateDrawerConfig',
            payload: {
              id: 'ai-panel',
              defaultSize: DEFAULT_SIZE + CHAT_SIZE,
              minSize: DEFAULT_SIZE + CHAT_SIZE,
            } as any,
          });
        }}
      >
        Open artifact
      </Button>
      <Button
        onClick={() => {
          updateDrawer({ type: 'exitExpandedMode' });
        }}
      >
        exit expanded mode
      </Button>
      <Button
        className="resize-to-max-width"
        onClick={() => {
          updateDrawer({ type: 'resizeDrawer', payload: { id: 'ai-panel', size: window.innerWidth + 1000 } });
        }}
      >
        resize to window.innerWidth + 1000
      </Button>
      {new Array(100).fill(null).map((_, index) => (
        <div key={index}>Tela content</div>
      ))}
    </>
  );
  const artifactContent = (
    <Box padding="m">
      <Box variant="h2" padding={{ bottom: 'm' }}>
        Artifact
      </Box>
      <Button
        onClick={() => {
          setHasArtifact(false);
          updateDrawer({ type: 'exitExpandedMode' });
          updateDrawer({
            type: 'updateDrawerConfig',
            payload: { id: 'ai-panel', defaultSize: DEFAULT_SIZE, minSize: DEFAULT_SIZE } as any,
          });
        }}
      >
        Close artifact panel
      </Button>
      <Button onClick={() => setArtifactLoaded(true)}>Load artifact details</Button>
      {artifactLoaded && new Array(100).fill(null).map((_, index) => <div key={index}>Tela content</div>)}
    </Box>
  );
  return (
    <div ref={ref} style={{ width: '100%', overflow: 'hidden' }}>
      <SplitView
        resizable={true}
        panelSize={constrainedChatSize}
        maxPanelSize={maxPanelSize}
        minPanelSize={MIN_CHAT_SIZE}
        onPanelResize={({ detail }) => setChatSize(detail.panelSize)}
        panelContent={chatContent}
        mainContent={<div className={styles['ai-artifact-panel']}>{artifactContent}</div>}
        display={hasArtifact ? (collapsed ? 'main-only' : 'all') : 'panel-only'}
      />
    </div>
  );
};

registerLeftDrawer({
  id: 'ai-panel',
  resizable: true,
  isExpandable: true,
  defaultSize: DEFAULT_SIZE,
  preserveInactiveContent: true,

  ariaLabels: {
    closeButton: 'Close AI Panel drawer',
    content: 'AI Panel',
    triggerButton: 'AI Panel',
    resizeHandle: 'Resize handle',
    expandedModeButton: 'Expanded mode button',
    exitExpandedModeButton: 'Console',
  },

  trigger: {
    customIcon: `
      <svg width="94" height="24" viewBox="0 0 94 24" fill="none" focusable="false" aria-hidden="true">
        <rect width="94" height="24" rx="4" fill="url(#paint0_linear_145_32649)"/>
        <defs>
          <linearGradient id="paint0_linear_145_32649" x1="135.919" y1="21" x2="108.351" y2="74.1863" gradientUnits="userSpaceOnUse">
            <stop stop-color="#B8E7FF"/>
            <stop offset="0.255" stop-color="#0099FF"/>
            <stop offset="0.514134" stop-color="#5C7FFF"/>
            <stop offset="0.732534" stop-color="#8575FF"/>
            <stop offset="1" stop-color="#962EFF"/>
          </linearGradient>
        </defs>
      </svg>
    `,
  },

  exitExpandedModeTrigger: {
    customIcon: `
      <svg width="94" height="24" viewBox="0 0 94 24" fill="none" focusable="false" aria-hidden="true">
        <rect width="94" height="24" rx="4" fill="url(#paint0_linear_145_32649)"/>
        <defs>
          <linearGradient id="paint0_linear_145_32649" x1="135.919" y1="21" x2="108.351" y2="74.1863" gradientUnits="userSpaceOnUse">
            <stop stop-color="#B8E7FF"/>
            <stop offset="0.255" stop-color="#0099FF"/>
            <stop offset="0.514134" stop-color="#5C7FFF"/>
            <stop offset="0.732534" stop-color="#8575FF"/>
            <stop offset="1" stop-color="#962EFF"/>
          </linearGradient>
        </defs>
      </svg>
    `,
  },

  onResize: event => {
    console.log('resize', event.detail);
  },
  onToggle: event => {
    console.log('toggle', event.detail);
  },

  mountContent: container => {
    mount(<AIDrawer />, container);
  },
  unmountContent: container => unmount(container),

  mountHeader: container => {
    mount(<div className={styles['ai-panel-logo']}>AI Panel</div>, container);
  },
  unmountHeader: container => unmount(container),

  headerActions: [
    {
      type: 'menu-dropdown',
      id: 'more-actions',
      text: 'More actions',
      items: [
        {
          id: 'add',
          iconName: 'add-plus',
          text: 'Add',
        },
        {
          id: 'remove',
          iconName: 'remove',
          text: 'Remove',
        },
      ],
    },
    {
      type: 'icon-button',
      id: 'add',
      iconName: 'add-plus',
      text: 'Add',
    },
  ],

  onHeaderActionClick: ({ detail }) => {
    console.log('onHeaderActionClick: ', detail);
  },

  onToggleFocusMode: ({ detail }) => {
    console.log('onToggleFocusMode: ', detail);
  },
});
