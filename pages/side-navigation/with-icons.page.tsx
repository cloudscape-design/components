// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import Icon from '~components/icon';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

// A custom inline SVG, demonstrating that the `icon` slot accepts any React node.
const CustomBoltSvg = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
  >
    <path d="M9 1L3 9h4l-1 6 6-8h-4l1-6z" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round" />
  </svg>
);

const ITEMS: SideNavigationProps.Item[] = [
  { type: 'link', icon: <Icon name="folder" />, text: 'Dashboard', href: '#/dashboard' },
  { type: 'link', icon: <Icon name="grid-view" />, text: 'Resources', href: '#/resources' },
  { type: 'link', icon: <Icon name="file" />, text: 'Reports', href: '#/reports' },
  {
    type: 'section',
    text: 'Navigation One',
    icon: <Icon name="envelope" />,
    items: [
      { type: 'link', text: 'Inbox', href: '#/inbox' },
      { type: 'link', text: 'Sent', href: '#/sent' },
      { type: 'link', text: 'Drafts', href: '#/drafts' },
      { type: 'link', text: 'Trash', href: '#/trash' },
    ],
  },
  {
    type: 'link-group',
    text: 'Navigation Two',
    icon: <Icon name="settings" />,
    href: '#/settings',
    items: [
      { type: 'link', text: 'Account', href: '#/account' },
      { type: 'link', text: 'Billing', href: '#/billing' },
    ],
  },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Section Group',
    icon: <Icon name="grid-view" size="inherit" />,
    items: [
      {
        type: 'link',
        icon: <Icon name="file-open" size="inherit" />,
        text: 'Overview',
        href: '#/overview',
      },
      {
        type: 'expandable-link-group',
        text: 'Expandable link group',
        icon: <Icon name="folder-open" />,
        href: '#/exp-link-group',
        items: [
          { type: 'link', icon: <Icon name="file" />, text: 'Page 9', href: '#/page9' },
          { type: 'link', icon: <Icon name="file" />, text: 'Page 10', href: '#/page10' },
        ],
      },
    ],
  },
  { type: 'divider' },
  // Demonstrates a custom React node (inline SVG) in place of an Icon component.
  { type: 'link', icon: CustomBoltSvg, text: 'Custom SVG icon', href: '#/custom' },
  // Demonstrates that the icon prop is optional.
  { type: 'link', text: 'No icon', href: '#/no-icon' },
];

export default function SideNavigationIconsPage() {
  const [activeHref, setActiveHref] = useState<string>('#/dashboard');

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    setActiveHref(e.detail.href);
    e.preventDefault();
  }, []);

  return (
    <>
      <h1>Side navigation with icons</h1>
      <SideNavigation
        activeHref={activeHref}
        header={{
          href: '#/',
          text: 'Service name',
        }}
        items={ITEMS}
        onFollow={onFollow}
      />
    </>
  );
}
