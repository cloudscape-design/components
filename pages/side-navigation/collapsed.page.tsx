// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { useReducedMotion } from '@cloudscape-design/component-toolkit/internal';

import { Box, Button, Icon, SpaceBetween } from '~components';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import { colorBorderDividerDefault } from '~design-tokens';

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Calendar', href: '#/calendar', icon: <Icon name="calendar" /> },
  {
    type: 'expandable-link-group',
    text: 'Projects',
    href: '#/projects',
    icon: <Icon name="folder" />,
    items: [
      { type: 'link', text: 'Project 1', href: '#/projects/project-1' },
      { type: 'link', text: 'Project 2', href: '#/projects/project-2' },
      { type: 'link', text: 'Project 3', href: '#/projects/project-3' },
    ],
  },
  { type: 'link', text: 'Settings', href: '#/settings', icon: <Icon name="settings" /> },
  {
    type: 'section',
    text: 'Resources',
    items: [
      { type: 'link', text: 'Announcements', href: '#/announcements', icon: <Icon name="announcement" /> },
      { type: 'link', text: 'Team', href: '#/team', icon: <Icon name="group" /> },
      { type: 'link', text: 'Networking', href: '#/networking', icon: <Icon name="share" /> },
    ],
  },
  { type: 'link', text: 'Documentation', href: '#/docs', external: true },
];

const COLLAPSED_WIDTH = 52;
const EXPANDED_WIDTH = 220;

export default function SideNavigationCollapsedPage() {
  const [activeHref, setActiveHref] = useState('#/calendar');
  const [collapsed, setCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(EXPANDED_WIDTH);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion(navRef);

  function handleToggle() {
    const willCollapse = !collapsed;
    // Focus management: move focus to toggle if focused item will be hidden
    if (willCollapse) {
      const focused = document.activeElement;
      if (navRef.current?.contains(focused)) {
        toggleRef.current?.focus();
      }
    }
    setCollapsed(willCollapse);
    setPanelWidth(willCollapse ? COLLAPSED_WIDTH : EXPANDED_WIDTH);
  }

  return (
    <div style={{ display: 'flex', blockSize: '100vh', overflow: 'hidden' }}>
      {/* Nav panel */}
      <nav
        id="side-navigation-panel"
        ref={navRef}
        style={{
          inlineSize: `${panelWidth}px`,
          flexShrink: 0,
          transition: reducedMotion ? undefined : 'inline-size 400ms cubic-bezier(0, 0, 0, 1)',
          overflow: 'hidden',
          borderInlineEnd: `1px solid ${colorBorderDividerDefault}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ inlineSize: collapsed ? 'auto' : EXPANDED_WIDTH, boxSizing: 'border-box' }}>
          {/* Toggle button at top */}
          <div
            style={{
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
            }}
          >
            {!collapsed && <Box variant="h3">Product name</Box>}
            <Button
              ref={toggleRef}
              iconName={collapsed ? 'angle-right' : 'angle-left'}
              variant="icon"
              onClick={handleToggle}
              ariaLabel={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              ariaExpanded={!collapsed}
              ariaControls="side-navigation-panel"
            />
          </div>
          <SideNavigation
            activeHref={activeHref}
            items={items}
            collapsed={collapsed}
            onFollow={e => {
              e.preventDefault();
              setActiveHref(e.detail.href);
            }}
          />
        </div>
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        <SpaceBetween size="m">
          <Box variant="h1">Collapsed state demo</Box>
          <Box>Active: {activeHref}</Box>
          <Box color="text-status-inactive">
            Toggle the navigation panel using the button. Items without icons are hidden in collapsed mode. Sections
            show their icon-bearing children as a flat list, and the section title becomes a divider in its place.
          </Box>
        </SpaceBetween>
      </div>
    </div>
  );
}
