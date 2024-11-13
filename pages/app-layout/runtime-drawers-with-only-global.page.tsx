// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import { AppLayout } from '~components';
import awsuiPlugins from '~components/internal/plugins';

import ScreenshotArea from '../utils/screenshot-area';

awsuiPlugins.appLayout.registerDrawer({
  id: 'circle-global',
  type: 'global',
  defaultActive: false,
  resizable: true,
  defaultSize: 350,
  preserveInactiveContent: true,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button',
    resizeHandle: 'Resize handle',
  },

  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" />
    </svg>`,
  },

  onResize: event => {
    console.log('resize', event.detail);
  },

  mountContent: container => {
    ReactDOM.render(<div data-testid="circle-global-bottom-content">circle-global bottom content</div>, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
});

export default function WithDrawersGlobalOnly() {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout toolsHide={true} />
    </ScreenshotArea>
  );
}
