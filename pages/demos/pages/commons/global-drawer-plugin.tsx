// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Drawer from '@cloudscape-design/components/drawer';
import Header from '@cloudscape-design/components/header';
import awsuiPlugins from '@cloudscape-design/components/internal/plugins';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { mount, unmount } from '../../common/mount';

function GlobalDrawerContent() {
  return (
    <Drawer header={<Header variant="h2">Design exploration</Header>}>
      <SpaceBetween size="m">
        <Box variant="p">This is a custom global drawer component that appears across all demo pages.</Box>
        <Box variant="p">You can add any content here that you want to be accessible from all pages.</Box>
        <Box variant="p">
          This drawer is registered using the Cloudscape AppLayout plugin system and appears in the toolbar.
        </Box>
      </SpaceBetween>
    </Drawer>
  );
}

// Register the global drawer plugin
export function registerGlobalDrawer() {
  awsuiPlugins.appLayout.registerDrawer({
    id: 'global-drawer-demo',
    //type: 'global',
    defaultActive: false,
    resizable: true,
    defaultSize: 400,
    preserveInactiveContent: true,
    ariaLabels: {
      closeButton: 'Close global drawer',
      content: 'Global drawer content',
      triggerButton: 'Open global drawer',
      resizeHandle: 'Resize global drawer',
    },
    trigger: {
      iconSvg: `<svg viewBox="0 0 16 16" focusable="false" aria-hidden="true" role="presentation">
<path d="M11.5 1H6L2 9.5H6.4L7.4 15L14 6.26923L9 6.26923L11.5 1Z" stroke="currentColor"  fill="none" stroke-linejoin="round"/></svg>`,
    },
    mountContent: container => {
      mount(<GlobalDrawerContent />, container);
    },
    unmountContent: container => {
      unmount(container);
    },
  });
}
