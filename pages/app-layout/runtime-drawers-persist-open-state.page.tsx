// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import HelpPanel from '~components/help-panel';
import awsuiPlugins from '~components/internal/plugins';

import { Breadcrumbs, Counter } from './utils/content-blocks';
import appLayoutLabels from './utils/labels';

awsuiPlugins.appLayout.registerDrawer({
  id: 'runtime-drawer-persist-open-state',
  type: 'global',

  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
      <rect fill="currentColor" x="5" y="5" width="6" height="6" />
    </svg>`,
  },
  // preserveInactiveContent: true,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button',
    resizeHandle: 'Resize handle',
  },

  mountContent: (container, { onVisibilityChange }) => {
    awsuiPlugins.appLayout.updateDrawer({ id: 'runtime-drawer-persist-open-state', defaultActive: true });
    onVisibilityChange(isVisible => {
      console.log('onVisibilityChange: ', isVisible);
      awsuiPlugins.appLayout.updateDrawer({ id: 'runtime-drawer-persist-open-state', defaultActive: isVisible });
    });
    render(<Counter id="runtime-drawer-persist-open-state" />, container);
  },
  unmountContent: container => {
    unmountComponentAtNode(container);
  },
});

export default function () {
  const [key, setKey] = useState(0);
  return (
    <AppLayout
      key={key}
      ariaLabels={appLayoutLabels}
      breadcrumbs={<Breadcrumbs />}
      content={
        <>
          <Header variant="h1" description="This drawer can automatically reopen after app layout instance changes">
            Drawer with state persistence
          </Header>
          <button data-testid="remount-app-layout" onClick={() => setKey(key => key + 1)}>
            Remount app layout
          </button>
        </>
      }
      tools={<HelpPanel header={<h2>Info</h2>}>Here is some info for you</HelpPanel>}
    />
  );
}
