// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import { FormField, SpaceBetween } from '~components';
import Icon from '~components/icon';
import RadioGroup from '~components/radio-group';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import Toggle from '~components/toggle';

import { SimplePage } from '../app/templates';

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
    items: [{ type: 'link', text: 'Billing', href: '#/billing' }],
  },
  {
    type: 'link-group',
    text: 'Navigation Two sans icon',
    href: '#/two',
    items: [{ type: 'link', text: 'Account', href: '#/account' }],
  },
  {
    type: 'expandable-link-group',
    text: 'Expandable link group',
    href: '#/exp-link-group-1',
    items: [
      { type: 'link', icon: <Icon name="file" />, text: 'Page 7', href: '#/page7' },
      { type: 'link', icon: <Icon name="file" />, text: 'Page 8', href: '#/page8' },
    ],
  },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Section Group',
    icon: <Icon name="grid-view" />,
    items: [
      {
        type: 'link',
        icon: <Icon name="file-open" />,
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
  const [expandIconPosition, setExpandIconPosition] = useState<SideNavigationProps.ExpandIconPosition>('start');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [variant, setVariant] = useState<SideNavigationProps.Variant>('default');

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    setActiveHref(e.detail.href);
    e.preventDefault();
  }, []);

  return (
    <SimplePage
      title="Side navigation with new features"
      settings={
        <SpaceBetween direction="horizontal" size="l">
          <FormField label="Expand icon position" description="Controls the `expandIconPosition` prop">
            <RadioGroup
              value={expandIconPosition}
              onChange={({ detail }) => setExpandIconPosition(detail.value as SideNavigationProps.ExpandIconPosition)}
              items={[
                { value: 'start', label: 'Start' },
                { value: 'end', label: 'End' },
              ]}
            />
          </FormField>
          <FormField label="Collapsed" description="Renders only icons; hides text labels and child items.">
            <Toggle checked={collapsed} onChange={({ detail }) => setCollapsed(detail.checked)}>
              {collapsed ? 'On' : 'Off'}
            </Toggle>
          </FormField>
          <FormField label="Highlight variant" description="Controls the `variant` prop">
            <RadioGroup
              value={variant}
              onChange={({ detail }) => setVariant(detail.value as SideNavigationProps.Variant)}
              items={[
                { value: 'default', label: 'Default (text highlight)' },
                { value: 'highlighted', label: 'Highlighted (background fill)' },
              ]}
            />
          </FormField>
        </SpaceBetween>
      }
    >
      <div style={{ maxInlineSize: collapsed ? '64px' : '300px' }}>
        <SideNavigation
          activeHref={activeHref}
          header={{
            href: '#/',
            text: 'Service name',
          }}
          items={ITEMS}
          expandIconPosition={expandIconPosition}
          collapsed={collapsed}
          variant={variant}
          onFollow={onFollow}
        />
      </div>
    </SimplePage>
  );
}
