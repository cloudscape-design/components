// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import Badge from '~components/badge';
import Button from '~components/button';
import Popover from '~components/popover';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const restrictedInfo = (feature: string) => (
  <Popover
    header={`${feature} requires advanced features`}
    content={
      <SpaceBetween size="s">
        <span>Activate advanced features on your account to use {feature.toLowerCase()}.</span>
        <Button variant="primary">Activate advanced features</Button>
      </SpaceBetween>
    }
  >
    Upgrade
  </Popover>
);

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'VPC dashboard', href: '#/dashboard' },
  { type: 'link', text: 'EC2 Global View', href: '#/global-view', info: <Badge color="green">New</Badge> },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Virtual private cloud',
    items: [
      { type: 'link', text: 'Your VPCs', href: '#/vpcs' },
      { type: 'link', text: 'Subnets', href: '#/subnets' },
      { type: 'link', text: 'Route tables', href: '#/route-tables' },
      { type: 'link', text: 'Internet gateways', href: '#/internet-gateways' },
    ],
  },
  {
    type: 'section-group',
    title: 'Security',
    items: [
      { type: 'link', text: 'Network ACLs', href: '#/network-acls' },
      { type: 'link', text: 'Security groups', href: '#/security-groups' },
    ],
  },
  {
    type: 'section-group',
    title: 'Network Firewall',
    info: restrictedInfo('Network Firewall'),
    items: [
      { type: 'link', text: 'Firewalls', href: '#/firewalls' },
      { type: 'link', text: 'Firewall policies', href: '#/firewall-policies' },
    ],
  },
  { type: 'divider' },
  {
    type: 'expandable-link-group',
    text: 'Transit gateways',
    href: '#/transit-gateways',
    info: restrictedInfo('Transit gateways'),
    items: [
      { type: 'link', text: 'Transit gateway attachments', href: '#/transit-gateways/attachments' },
      { type: 'link', text: 'Transit gateway route tables', href: '#/transit-gateways/route-tables' },
    ],
  },
  {
    type: 'section',
    text: 'Virtual private network (VPN)',
    items: [
      { type: 'link', text: 'Customer gateways', href: '#/customer-gateways' },
      { type: 'link', text: 'Site-to-Site VPN connections', href: '#/vpn-connections' },
    ],
  },
];

export default function SideNavigationInfoPage() {
  const [activeHref, setActiveHref] = useState('#/dashboard');

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    setActiveHref(e.detail.href);
    e.preventDefault();
  }, []);

  return (
    <SimplePage title="Side navigation with info on group headers" screenshotArea={{ style: { maxWidth: 300 } }}>
      <SideNavigation activeHref={activeHref} header={{ href: '#/', text: 'VPC' }} items={items} onFollow={onFollow} />
    </SimplePage>
  );
}
