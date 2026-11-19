// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useRef, useState } from 'react';

import { useReducedMotion } from '@cloudscape-design/component-toolkit/internal';

import { Box, Button, Icon, RadioGroup, SpaceBetween, Toggle } from '~components';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import { colorBorderDividerDefault } from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';

type CollapsedNavDemoContext = React.Context<
  AppContextType<{
    itemsSet: string;
  }>
>;

const cubeIcon = (
  <Icon
    svg={
      <svg viewBox="0 0 16 16" height="16" width="16">
        <path
          className="filled no-stroke"
          fill="currentColor"
          d="m8.35.34 6.25 3.25.4.2v8.42l-.4.2-6.25 3.26-.35.18-.35-.18-6.25-3.25-.4-.21V3.8l.4-.21L7.65.34 8 .15zM2.5 11.3l4.75 2.46V7.81L2.5 5.44zM8.75 7.8v5.95l4.75-2.46V5.44zM3.42 4.22 8 6.52l4.58-2.3L8 1.85z"
        ></path>
      </svg>
    }
  />
);

const kitchenSink: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Dashboard', href: '#/dashboard', icon: <Icon name="grid-view" /> },
  { type: 'link', text: 'Calendar', href: '#/calendar', icon: <Icon name="calendar" /> },
  { type: 'link', text: 'Settings', href: '#/settings', icon: <Icon name="settings" /> },
  {
    type: 'link-group',
    text: 'Account',
    icon: <Icon name="user-profile" />,
    href: '#/account',
    items: [
      { type: 'link', text: 'Billing', href: '#/account/billing' },
      { type: 'link', text: 'Users', href: '#/account/users' },
      { type: 'link', text: 'Access keys', href: '#/account/access-keys' },
    ],
  },
  {
    type: 'expandable-link-group',
    text: 'Buckets',
    href: '#/buckets',
    icon: <Icon name="folder" />,
    items: [
      { type: 'link', text: 'Photos backup', href: '#/buckets/photos-backup' },
      { type: 'link', text: 'Static assets', href: '#/buckets/static-assets' },
      { type: 'link', text: 'Server logs', href: '#/buckets/server-logs' },
    ],
  },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Monitoring',
    items: [
      { type: 'link', text: 'Alarms', href: '#/monitoring/alarms', icon: <Icon name="status-warning" /> },
      { type: 'link', text: 'Dashboards', href: '#/monitoring/dashboards', icon: <Icon name="grid-view" /> },
      { type: 'link', text: 'Metrics', href: '#/monitoring/metrics', icon: <Icon name="share" /> },
      {
        type: 'link-group',
        text: 'Log groups',
        icon: <Icon name="user-profile" />,
        href: '#/monitoring/log-groups',
        items: [
          { type: 'link', text: 'API access logs', href: '#/monitoring/log-groups/api-access' },
          { type: 'link', text: 'Application logs', href: '#/monitoring/log-groups/application' },
          { type: 'link', text: 'Audit logs', href: '#/monitoring/log-groups/audit' },
        ],
      },
    ],
  },
  { type: 'link', text: 'Documentation', href: '#/docs', external: true },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Data management',
    items: [
      { type: 'link', text: 'Replication rules', href: '#/data/replication-rules', icon: <Icon name="announcement" /> },
      { type: 'link', text: 'Lifecycle rules', href: '#/data/lifecycle-rules', icon: <Icon name="group" /> },
      { type: 'link', text: 'Transfer jobs', href: '#/data/transfer-jobs', icon: <Icon name="share" /> },
      {
        type: 'section',
        text: 'Backups',
        items: [
          { type: 'link', text: 'Backup plans', href: '#/data/backups/plans', icon: <Icon name="file" /> },
          { type: 'link', text: 'Backup vaults', href: '#/data/backups/vaults', icon: <Icon name="file" /> },
          { type: 'link', text: 'Restore jobs', href: '#/data/backups/restore-jobs', icon: <Icon name="file" /> },
          {
            type: 'expandable-link-group',
            href: '#/data/backups/schedules',
            text: 'Schedules',
            icon: <Icon name="settings" />,
            items: [
              { type: 'link', text: 'Daily snapshot', href: '#/data/backups/schedules/daily' },
              { type: 'link', text: 'Weekly snapshot', href: '#/data/backups/schedules/weekly' },
              { type: 'link', text: 'Monthly snapshot', href: '#/data/backups/schedules/monthly' },
              {
                type: 'expandable-link-group',
                href: '#/data/backups/schedules/retention',
                text: 'Retention policies',
                icon: <Icon name="settings" />,
                items: [
                  { type: 'link', text: 'Short-term policy', href: '#/data/backups/schedules/retention/short-term' },
                  { type: 'link', text: 'Long-term policy', href: '#/data/backups/schedules/retention/long-term' },
                  { type: 'link', text: 'Compliance policy', href: '#/data/backups/schedules/retention/compliance' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const simpleItems: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Dashboard',
    href: '#/dashboard',
    icon: <Icon name="grid-view" />,
  },
  {
    type: 'link',
    text: 'Storage',
    href: '#/storage',
    icon: (
      <Icon
        svg={
          <svg viewBox="0 0 16 16" height="16" width="16">
            <path
              className="filled no-stroke"
              fill="currentColor"
              fillRule="evenodd"
              d="M3.3.79C4.54.29 6.2 0 8 0s3.46.29 4.7.79a5 5 0 0 1 1.57.94c.41.39.73.9.73 1.52v9.5a2 2 0 0 1-.73 1.52 5 5 0 0 1-1.57.94c-1.24.5-2.9.79-4.7.79s-3.46-.29-4.7-.79a5 5 0 0 1-1.57-.94A2 2 0 0 1 1 12.75v-9.5c0-.62.32-1.13.73-1.52A5 5 0 0 1 3.3.8m-.8 4.54V8c0 .07.03.22.26.43q.33.33 1.1.64c1.02.41 2.49.68 4.14.68s3.12-.27 4.14-.68q.77-.31 1.1-.64c.23-.21.26-.36.26-.43V5.33a6 6 0 0 1-.8.38c-1.24.5-2.9.79-4.7.79s-3.46-.29-4.7-.79a6 6 0 0 1-.8-.38m11-2.08c0 .07-.03.22-.26.43q-.33.33-1.1.64C11.12 4.73 9.65 5 8 5s-3.12-.27-4.14-.68q-.77-.31-1.1-.64c-.23-.21-.26-.36-.26-.43s.03-.22.26-.43q.33-.33 1.1-.64C4.88 1.77 6.35 1.5 8 1.5s3.12.27 4.14.68q.77.31 1.1.64c.23.21.26.36.26.43m0 6.83a6 6 0 0 1-.8.38c-1.24.5-2.9.79-4.7.79s-3.46-.29-4.7-.79a6 6 0 0 1-.8-.38v2.67c0 .07.03.22.26.43q.33.33 1.1.64c1.02.41 2.49.68 4.14.68s3.12-.27 4.14-.68q.77-.31 1.1-.64c.23-.21.26-.36.26-.43z"
              clipRule="evenodd"
            ></path>
          </svg>
        }
      />
    ),
  },
  {
    type: 'link',
    text: 'Metrics',
    href: '#/page3',
    icon: (
      <Icon
        svg={
          <svg viewBox="0 0 16 16" height="16" width="16">
            <path
              className="filled no-stroke"
              fill="currentColor"
              fillRule="evenodd"
              d="M1 1v11.75C1 13.99 2 15 3.25 15H15v-1.5H3.25a.75.75 0 0 1-.75-.75V1zm13.3 5.01.51-.54-1.1-1.03-.5.55-3.23 3.43-2.27-2.27a1 1 0 0 0-1.42 0L4.22 8.22l-.53.53 1.06 1.06.53-.53L7 7.56l2.29 2.29a1 1 0 0 0 1.43-.03z"
              clipRule="evenodd"
            ></path>
          </svg>
        }
      />
    ),
  },
  { type: 'divider' },
  {
    type: 'link',
    text: 'Notifications',
    href: '#/notifications',
    icon: <Icon name="notification" />,
  },
  {
    type: 'link',
    text: 'Support',
    href: 'https://example.com',
    external: true,
    icon: <Icon name="support" />,
  },
];

const navWithSections: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Dashboard',
    href: '#/dashboard',
    icon: <Icon name="grid-view" />,
  },
  {
    type: 'link',
    text: 'Instances',
    href: '#/instances',
    icon: cubeIcon,
  },
  {
    type: 'section',
    text: 'Reports and Analytics',
    items: [
      {
        type: 'link',
        text: 'Usage',
        href: '#/page4',
        icon: (
          <Icon
            svg={
              <svg viewBox="0 0 16 16" height="16" width="16">
                <path
                  className="filled no-stroke"
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M1 1v11.75C1 13.99 2 15 3.25 15H15v-1.5H3.25a.75.75 0 0 1-.75-.75V1zm8.5 2.75V3H8v9h1.5V3.75M6 8v4H4.5V8zm7-1.25V6h-1.5v6H13V6.75"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
          />
        ),
      },
      {
        type: 'link',
        text: 'Alarms',
        href: '#/page5',
        icon: <Icon name="status-warning" />,
      },
      {
        type: 'link',
        text: 'Logs',
        href: '#/page6',
        icon: <Icon name="list-view" />,
      },
    ],
  },
  {
    type: 'section',
    text: 'Security',
    items: [
      {
        type: 'link',
        text: 'API Keys',
        href: '#/page7',
        icon: <Icon name="key" />,
      },
      {
        type: 'link',
        text: 'Encryption',
        href: '#/page8',
        icon: <Icon name="lock-private" />,
      },
      {
        type: 'link',
        text: 'Authentication',
        href: '#/page9',
        icon: <Icon name="user-profile" />,
      },
    ],
  },
];

const navWithELGs: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Dashboard',
    href: '#/dashboard',
    icon: (
      <Icon
        svg={
          <svg xmlns="http://w3.org" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor">
            <path d="M1.75 6.75 L8 1.5 L14.25 6.75 V13.5 A1 1 0 0 1 13.25 14.5 H2.75 A1 1 0 0 1 1.75 13.5 Z" />
            <path d="M5.75 14.5 V9.5 H10.25 V14.5" />
          </svg>
        }
      />
    ),
  },
  {
    type: 'link',
    text: 'Deployments',
    href: '#/page2',
    icon: cubeIcon,
  },
  {
    type: 'expandable-link-group',
    text: 'Projects',
    href: '#/group1',
    icon: <Icon name="grid-view" />,
    defaultExpanded: true,
    items: [
      {
        type: 'link',
        text: 'Project 1',
        href: '#/page4',
      },
      {
        type: 'link',
        text: 'Project 2',
        href: '#/page5',
      },
      {
        type: 'link',
        text: 'Project 3',
        href: '#/page6',
      },
    ],
  },
  {
    type: 'expandable-link-group',
    text: 'Groups',
    href: '#/group2',
    icon: <Icon name="group" />,
    defaultExpanded: true,
    items: [
      {
        type: 'link',
        text: 'My team',
        href: '#/page7',
      },
      {
        type: 'link',
        text: 'My org',
        href: '#/page8',
      },
      {
        type: 'link',
        text: 'My company',
        href: '#/page9',
      },
    ],
  },
  { type: 'divider' },
  {
    type: 'link',
    text: 'Help and support',
    href: 'https://example.com',
    icon: <Icon name="support" />,
  },
  {
    type: 'link',
    text: 'Feedback',
    href: '#/notifications',
    icon: <Icon name="contact" />,
  },
];

function stripIcons(items: ReadonlyArray<SideNavigationProps.Item>): SideNavigationProps.Item[] {
  return items.map((item): SideNavigationProps.Item => {
    switch (item.type) {
      case 'divider':
        return item;
      case 'link':
        return { ...item, icon: undefined };
      case 'section':
        return { ...item, items: stripIcons(item.items) };
      case 'link-group':
        return { ...item, icon: undefined, items: stripIcons(item.items) };
      case 'expandable-link-group':
        return { ...item, icon: undefined, items: stripIcons(item.items) };
      case 'section-group':
        return {
          ...item,
          items: stripIcons(item.items) as Array<
            | SideNavigationProps.Section
            | SideNavigationProps.Link
            | SideNavigationProps.LinkGroup
            | SideNavigationProps.ExpandableLinkGroup
          >,
        };
    }
  });
}

const COLLAPSED_WIDTH = 52;
const EXPANDED_WIDTH = 220;

const itemsByRadioValue: Record<string, SideNavigationProps.Item[]> = {
  first: simpleItems,
  second: navWithSections,
  third: navWithELGs,
  fourth: kitchenSink,
};

export default function SideNavigationCollapsedPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as CollapsedNavDemoContext);
  const { itemsSet = 'first' } = urlParams;
  const [activeHref, setActiveHref] = useState('#/dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(EXPANDED_WIDTH);
  const [iconLayout, setIconLayout] = useState(true);
  const items = itemsByRadioValue[itemsSet];
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
    <div style={{ display: 'flex', blockSize: '100vh', overflow: 'auto' }}>
      {/* Nav panel */}
      <nav
        id="side-navigation-panel"
        ref={navRef}
        style={{
          inlineSize: `${panelWidth}px`,
          flexShrink: 0,
          transition: reducedMotion ? undefined : 'inline-size 130ms cubic-bezier(0, 0, 0, 1)',
          overflow: 'hidden',
          borderInlineEnd: `1px solid ${colorBorderDividerDefault}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ inlineSize: collapsed ? 'auto' : EXPANDED_WIDTH, boxSizing: 'border-box', overflow: 'auto' }}>
          {/* Toggle button at top */}
          <div
            style={{
              paddingInline: collapsed ? '12px' : '20px 12px',
              paddingBlock: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
            }}
          >
            {!collapsed && <Box variant="h3">Product name</Box>}
            <Button
              ref={toggleRef}
              iconName={'side-bar'}
              variant="icon"
              onClick={handleToggle}
              ariaLabel={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              ariaExpanded={!collapsed}
              ariaControls="side-navigation-panel"
            />
          </div>
          <SideNavigation
            activeHref={activeHref}
            items={iconLayout ? items : stripIcons(items)}
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
          <RadioGroup
            onChange={({ detail }) => setUrlParams({ itemsSet: detail.value })}
            value={itemsSet}
            items={[
              { value: 'first', label: 'Simple' },
              { value: 'second', label: 'With sections' },
              { value: 'third', label: 'With ELGs' },
              { value: 'fourth', label: 'Kitchen sink' },
            ]}
          />
          <Toggle onChange={({ detail }) => setIconLayout(detail.checked)} checked={iconLayout}>
            Icon layout
          </Toggle>
        </SpaceBetween>
      </div>
    </div>
  );
}
