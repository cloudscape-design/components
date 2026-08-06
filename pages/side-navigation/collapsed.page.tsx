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
            // header={{
            //   href: '#/',
            //   text: 'Service name',
            //   logo: {
            //     alt: 'logo',
            //     svg: (
            //       <svg width="26" height="15" viewBox="0 0 26 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            //         <path
            //           d="M7.19068 5.35736C7.19068 5.66092 7.22462 5.90705 7.28402 6.08754C7.35191 6.26803 7.43677 6.46494 7.55557 6.67825C7.59801 6.74388 7.61498 6.80951 7.61498 6.86694C7.61498 6.94898 7.56406 7.03103 7.45374 7.11307L6.91912 7.45765C6.84275 7.50687 6.76638 7.53149 6.69849 7.53149C6.61363 7.53149 6.52877 7.49046 6.44391 7.41663C6.3251 7.29356 6.22327 7.16229 6.13841 7.03103C6.05355 6.89156 5.96869 6.73567 5.87535 6.54698C5.21344 7.30177 4.38181 7.67916 3.38046 7.67916C2.66763 7.67916 2.09907 7.48226 1.68325 7.08846C1.26744 6.69465 1.05529 6.16958 1.05529 5.51324C1.05529 4.81588 1.30987 4.24979 1.82752 3.82317C2.34516 3.39655 3.03253 3.18324 3.90659 3.18324C4.19511 3.18324 4.49212 3.20785 4.80611 3.24888C5.12009 3.2899 5.44256 3.35553 5.782 3.42937V2.83046C5.782 2.20694 5.64622 1.77211 5.38316 1.51778C5.1116 1.26345 4.65336 1.14039 3.99994 1.14039C3.70292 1.14039 3.39743 1.17321 3.08345 1.24704C2.76946 1.32088 2.46397 1.41113 2.16696 1.52599C2.03118 1.58342 1.92935 1.61623 1.86995 1.63264C1.81054 1.64905 1.76811 1.65725 1.73417 1.65725C1.61537 1.65725 1.55596 1.57521 1.55596 1.40292V1.00092C1.55596 0.869649 1.57294 0.771198 1.61537 0.713768C1.6578 0.656339 1.73417 0.598909 1.85297 0.541479C2.14998 0.393803 2.5064 0.27074 2.92221 0.172289C3.33803 0.0656338 3.7793 0.0164085 4.24603 0.0164085C5.25587 0.0164085 5.99415 0.237923 6.46937 0.680951C6.9361 1.12398 7.1737 1.79673 7.1737 2.69919V5.35736H7.19068ZM3.74536 6.60441C4.02539 6.60441 4.31392 6.55518 4.61941 6.45673C4.92491 6.35828 5.19646 6.17779 5.42559 5.93166C5.56136 5.77578 5.66319 5.60349 5.71411 5.40659C5.76503 5.20969 5.79897 4.97176 5.79897 4.69282V4.34824C5.55288 4.29081 5.28981 4.24159 5.01826 4.20877C4.7467 4.17595 4.48364 4.15955 4.22057 4.15955C3.65201 4.15955 3.23619 4.2662 2.95616 4.48771C2.67612 4.70923 2.54034 5.02099 2.54034 5.4312C2.54034 5.8168 2.64217 6.10395 2.85432 6.30085C3.05799 6.50596 3.355 6.60441 3.74536 6.60441ZM10.5596 7.49046C10.4069 7.49046 10.305 7.46585 10.2372 7.40842C10.1693 7.3592 10.1099 7.24434 10.0589 7.08846L8.06474 0.746585C8.01382 0.5825 7.98836 0.475845 7.98836 0.418416C7.98836 0.287148 8.05625 0.21331 8.19203 0.21331H9.02366C9.18489 0.21331 9.29521 0.237923 9.35461 0.295352C9.4225 0.344578 9.47341 0.459437 9.52433 0.615317L10.95 6.04652L12.2738 0.615317C12.3162 0.451233 12.3671 0.344578 12.435 0.295352C12.5029 0.246127 12.6217 0.21331 12.7745 0.21331H13.4534C13.6146 0.21331 13.7249 0.237923 13.7928 0.295352C13.8607 0.344578 13.9201 0.459437 13.954 0.615317L15.2948 6.11215L16.7629 0.615317C16.8138 0.451233 16.8732 0.344578 16.9326 0.295352C17.0005 0.246127 17.1108 0.21331 17.2636 0.21331H18.0528C18.1885 0.21331 18.2649 0.278944 18.2649 0.418416C18.2649 0.459437 18.2564 0.500458 18.248 0.549684C18.2395 0.598909 18.2225 0.664543 18.1885 0.754789L16.1434 7.09666C16.0925 7.26075 16.0331 7.3674 15.9652 7.41663C15.8973 7.46585 15.787 7.49867 15.6427 7.49867H14.9129C14.7517 7.49867 14.6414 7.47405 14.5735 7.41663C14.5056 7.3592 14.4462 7.25254 14.4123 7.08846L13.0969 1.79673L11.7901 7.08025C11.7477 7.24434 11.6967 7.35099 11.6289 7.40842C11.561 7.46585 11.4422 7.49046 11.2894 7.49046H10.5596ZM21.4642 7.71198C21.0229 7.71198 20.5816 7.66275 20.1573 7.5643C19.733 7.46585 19.402 7.3592 19.1814 7.23613C19.0456 7.16229 18.9523 7.08025 18.9183 7.00641C18.8844 6.93258 18.8674 6.85053 18.8674 6.7767V6.35828C18.8674 6.18599 18.9353 6.10395 19.0626 6.10395C19.1135 6.10395 19.1644 6.11215 19.2154 6.12856C19.2663 6.14497 19.3426 6.17779 19.4275 6.2106C19.716 6.33367 20.03 6.43212 20.361 6.49775C20.7004 6.56339 21.0314 6.5962 21.3708 6.5962C21.9054 6.5962 22.3212 6.50596 22.6098 6.32546C22.8983 6.14497 23.051 5.88243 23.051 5.54606C23.051 5.31634 22.9747 5.12765 22.8219 4.97176C22.6692 4.81588 22.3806 4.67641 21.9648 4.54514L20.7344 4.17595C20.1149 3.98726 19.6566 3.70831 19.3766 3.33912C19.0966 2.97814 18.9523 2.57613 18.9523 2.14951C18.9523 1.80493 19.0287 1.50137 19.1814 1.23884C19.3342 0.976304 19.5378 0.746585 19.7924 0.566092C20.047 0.377395 20.3355 0.237923 20.675 0.139472C21.0144 0.0410212 21.3708 0 21.7442 0C21.9309 0 22.1261 0.00820423 22.3128 0.0328169C22.5079 0.0574296 22.6861 0.0902465 22.8643 0.123063C23.0341 0.164085 23.1953 0.205106 23.348 0.254331C23.5008 0.303557 23.6196 0.352782 23.7045 0.402007C23.8233 0.467641 23.9081 0.533275 23.959 0.607113C24.01 0.672747 24.0354 0.762994 24.0354 0.877853V1.26345C24.0354 1.43574 23.9675 1.52599 23.8402 1.52599C23.7723 1.52599 23.662 1.49317 23.5178 1.42754C23.0341 1.21423 22.491 1.10757 21.8885 1.10757C21.4047 1.10757 21.0229 1.18141 20.7598 1.33729C20.4967 1.49317 20.361 1.73109 20.361 2.06747C20.361 2.29718 20.4458 2.49409 20.6155 2.64997C20.7853 2.80585 21.0993 2.96173 21.549 3.1012L22.754 3.47039C23.365 3.65909 23.8063 3.92162 24.0694 4.258C24.3324 4.59437 24.4597 4.97997 24.4597 5.40659C24.4597 5.75937 24.3833 6.07934 24.2391 6.35828C24.0863 6.63722 23.8827 6.88335 23.6196 7.08025C23.3565 7.28536 23.0425 7.43303 22.6776 7.53969C22.2958 7.65455 21.8969 7.71198 21.4642 7.71198Z"
            //           fill="currentColor"
            //         />
            //         <path
            //           d="M20.9632 10.3035C21.8712 10.1969 23.8739 9.96714 24.2303 10.4102C24.5867 10.845 23.8315 12.6745 23.492 13.4868C23.3902 13.7329 23.6108 13.8313 23.84 13.6426C25.3335 12.4284 25.7238 9.8933 25.4183 9.52411C25.1129 9.16312 22.4907 8.85136 20.8953 9.93432C20.6492 10.1066 20.6916 10.3363 20.9632 10.3035Z"
            //           fill="currentColor"
            //         />
            //         <path
            //           d="M12.7317 14.742C16.2195 14.742 20.2758 13.6837 23.0677 11.69C23.5259 11.3619 23.1271 10.8614 22.6604 11.0665C19.529 12.3464 16.1261 12.9699 13.0287 12.9699C8.43781 12.9699 3.99963 11.7475 0.40156 9.72922C0.0875771 9.54872 -0.150031 9.86048 0.113035 10.0902C3.43955 12.9945 7.84379 14.742 12.7317 14.742Z"
            //           fill="currentColor"
            //         />
            //       </svg>
            //     ),
            //   },
            // }}
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
