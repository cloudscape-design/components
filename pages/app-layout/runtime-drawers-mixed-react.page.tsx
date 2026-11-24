// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import awsuiPlugins from '~components/internal/plugins';

import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';

import iframeStyles from '../utils/iframe-wrapper.scss';

// Reproduces runtime drawer triggers disappearing when the secondary AppLayout runs a different React version than
// the primary one.
//
// The primary AppLayout below runs on the React version of this page (16, or 18 with `npm run start:react18`).
// Its content is a same-origin child frame (react19-child.html) whose secondary AppLayout runs on React 19. The
// secondary layout converts each runtime drawer's `iconSvg` string into a React element with React 19 and hands it to
// the primary layout, which renders it with its own React and throws "Minified React error #31" in
// AppLayoutBuiltInErrorBoundary. The runtime drawer triggers then vanish from the toolbar.
//
// Requires the toolbar AppLayout: open with `?appLayoutToolbar=true`.

awsuiPlugins.appLayout.registerDrawer({
  id: 'related-resources',
  ariaLabels: {
    content: 'Related resources',
    closeButton: 'Close related resources',
    triggerButton: 'Open related resources',
    resizeHandle: 'Resize related resources',
  },
  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" />
    </svg>`,
  },
  mountContent: container => {
    container.textContent = 'Related resources drawer content';
  },
  unmountContent: container => {
    container.textContent = '';
  },
});

awsuiPlugins.appLayout.registerDrawer({
  id: 'alchemist-widget',
  ariaLabels: {
    content: 'Alchemist widget',
    closeButton: 'Close alchemist widget',
    triggerButton: 'Open alchemist widget',
    resizeHandle: 'Resize alchemist widget',
  },
  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
      <rect x="2" y="7" width="12" height="7" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M4,7V5a4,4,0,0,1,8,0V7" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>`,
  },
  mountContent: container => {
    container.textContent = 'Alchemist widget drawer content';
  },
  unmountContent: container => {
    container.textContent = '';
  },
});

export default function RuntimeDrawersMixedReactPage() {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        // Only one AppLayout can subscribe to runtime drawers. The child frame's layout does, as in the console.
        {...{ __disableRuntimeDrawers: true }}
        data-testid="primary-layout"
        ariaLabels={labels}
        navigationHide={true}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <iframe className={iframeStyles['full-screen']} title="React 19 child frame" src="./react19-child.html" />
        }
      />
    </ScreenshotArea>
  );
}
