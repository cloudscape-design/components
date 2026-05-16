// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Drawer from '~components/drawer';
import Header from '~components/header';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

import { primaryHorizontalContent } from '../common';

type DrawerId = 'navigation' | 'help' | 'settings' | null;

const navItems = [
  { icon: 'menu' as const, id: 'navigation' as const, label: 'Navigation' },
  { icon: 'status-info' as const, id: 'help' as const, label: 'Help' },
  { icon: 'settings' as const, id: 'settings' as const, label: 'Settings' },
];

function ToolbarContent({ activeDrawer, onToggle }: { activeDrawer: DrawerId; onToggle: (id: DrawerId) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '8px 20px' }}>
      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
        {navItems.map(item => (
          <Button
            key={item.id}
            iconName={item.icon}
            variant={activeDrawer === item.id ? 'primary' : 'icon'}
            ariaLabel={item.label}
            onClick={() => onToggle(item.id)}
          />
        ))}
      </SpaceBetween>
      <div style={{ marginInlineStart: 'auto' }}>
        <Box variant="span" fontSize="body-s">
          Home / Projects / my-service
        </Box>
      </div>
    </div>
  );
}

const drawers: Record<string, React.ReactNode> = {
  navigation: (
    <Drawer header={<Header variant="h2">Navigation</Header>}>
      <SideNavigation
        header={{ text: 'CloudManager', href: '#' }}
        items={[
          { type: 'link', text: 'Dashboard', href: '#' },
          { type: 'link', text: 'Projects', href: '#' },
          { type: 'link', text: 'Deployments', href: '#' },
          { type: 'divider' },
          { type: 'link', text: 'Settings', href: '#' },
        ]}
      />
    </Drawer>
  ),
  help: (
    <Drawer header={<Header variant="h2">Help</Header>}>
      <SpaceBetween size="m">
        <Box>Get started with CloudManager.</Box>
        <Link href="#" external={true}>
          Getting started guide
        </Link>
        <Link href="#" external={true}>
          API reference
        </Link>
      </SpaceBetween>
    </Drawer>
  ),
  settings: (
    <Drawer header={<Header variant="h2">Settings</Header>}>
      <Box>Theme, language, and notification preferences.</Box>
    </Drawer>
  ),
};

export default function WithDrawerPage() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerId>(null);
  const toggleDrawer = (id: DrawerId) => setActiveDrawer(prev => (prev === id ? null : id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - var(--app-header-height, 40px))' }}>
      <NavigationBar variant="primary-accent" ariaLabel="Main navigation" content={primaryHorizontalContent} />
      <NavigationBar
        variant="secondary"
        ariaLabel="Toolbar"
        content={<ToolbarContent activeDrawer={activeDrawer} onToggle={toggleDrawer} />}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {activeDrawer && (
          <div style={{ width: 280, borderRight: '1px solid #e9ebed', overflow: 'auto', flexShrink: 0 }} tabIndex={0}>
            {drawers[activeDrawer]}
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }} tabIndex={0}>
          <SpaceBetween size="l">
            <Box variant="h1">Dashboard</Box>
            <Box>Click the toolbar buttons to toggle drawers.</Box>
            {Array.from({ length: 30 }, (_, i) => (
              <Box key={i} padding={{ vertical: 'xxs' }}>
                Content line {i + 1}
              </Box>
            ))}
          </SpaceBetween>
        </div>
      </div>
    </div>
  );
}
