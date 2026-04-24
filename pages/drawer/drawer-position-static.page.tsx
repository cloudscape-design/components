// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { Box, Button, ColumnLayout, SpaceBetween, Tabs } from '~components';
import Drawer, { NextDrawerProps as DrawerProps } from '~components/drawer/next';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

const accentColor = '#6237a7';

type PageContext = React.Context<
  AppContextType<{
    tabId?: string;
  }>
>;

function createTab(label: string, content: React.ReactNode) {
  return { id: label, label, content };
}

export default function () {
  const {
    urlParams: { tabId = 'Features' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  return (
    <SimplePage
      title="Drawer position: static"
      subtitle="This page demonstrates drawers with static (default) position."
      i18n={{}}
      screenshotArea={{}}
    >
      <Tabs
        activeTabId={tabId}
        onChange={({ detail }) => setUrlParams({ tabId: detail.activeTabId })}
        tabs={[createTab('Features', <DrawerFeaturesTab />), createTab('Custom placement', <CustomPlacementTab />)]}
      />
    </SimplePage>
  );
}

function DrawerFeaturesTab() {
  return (
    <SpaceBetween size="s">
      <Box>Note: all examples in this tab use a custom wrapper around the drawer to render visible borders.</Box>
      <hr />
      <ColumnLayout columns={2}>
        <Box variant="p">Drawer with content and disabled content paddings.</Box>
        <DrawerWithBorder disableContentPaddings={true}>
          <SpaceBetween size="m">
            <Box>Content line 1</Box>
            <Box>Content line 2</Box>
            <Box>Content line 3</Box>
          </SpaceBetween>
        </DrawerWithBorder>

        <Box variant="p">Drawer with header, content, and footer.</Box>
        <DrawerWithBorder header="Header A" footer="Footer" closeAction={{ ariaLabel: 'Close drawer' }}>
          Content
        </DrawerWithBorder>

        <Box variant="p">Drawer with header actions.</Box>
        <DrawerWithBorder header="Header B" headerActions={<Button>Action</Button>} hideCloseAction={true}>
          Content
        </DrawerWithBorder>
      </ColumnLayout>
    </SpaceBetween>
  );
}

function CustomPlacementTab() {
  return (
    <SpaceBetween size="s">
      <Box>
        Statically positioned drawers can be arranged into custom layouts and wrapped into elements with absolute,
        sticky, or fixed position. In that case, the drawer borders are rendered by the consumers.
      </Box>
      <hr />
      <ColumnLayout columns={2}>
        <Box variant="p">Static drawers around content with custom flex layout.</Box>
        <div style={{ border: `2px solid ${accentColor}` }}>
          <div style={{ display: 'flex' }}>
            <div style={{ border: `2px solid ${accentColor}`, margin: `-2px 0 -2px -2px` }}>
              <Drawer header="Left">Left content</Drawer>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Container content
            </div>
            <div style={{ border: `2px solid ${accentColor}`, margin: '-2px -2px -2px 0' }}>
              <Drawer header="Right">Right content</Drawer>
            </div>
          </div>
          <div style={{ border: `2px solid ${accentColor}`, margin: '0 -2px -2px -2px' }}>
            <Drawer header="Bottom">Bottom content</Drawer>
          </div>
        </div>

        <Box variant="p">Custom sticky drawer at the bottom.</Box>
        <div style={{ border: `2px solid ${accentColor}` }}>
          <div style={{ height: 300, padding: 16 }}>Container content</div>
          <div style={{ borderTop: `2px solid ${accentColor}`, position: 'sticky', bottom: 0 }}>
            <Drawer header="Drawer">I am a static drawer inside a sticky wrapper.</Drawer>
          </div>
        </div>
      </ColumnLayout>
    </SpaceBetween>
  );
}

function DrawerWithBorder(props: DrawerProps) {
  return (
    <div style={{ padding: 2, background: accentColor }}>
      <Drawer {...props} />
    </div>
  );
}
