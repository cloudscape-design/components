// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import AppLayout from '~components/app-layout';
import Badge from '~components/badge';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Flashbar from '~components/flashbar';
import Header from '~components/header';
import Link from '~components/link';
import Pagination from '~components/pagination';
import Popover from '~components/popover';
import Select from '~components/select';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';
import TextFilter from '~components/text-filter';

import labels from '../app-layout/utils/labels';

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
  const [activeHref, setActiveHref] = useState('#/transit-gateways');
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [flashDismissed, setFlashDismissed] = useState(false);

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    setActiveHref(e.detail.href);
    e.preventDefault();
  }, []);

  return (
    <AppLayout
      ariaLabels={labels}
      contentType="table"
      navigationOpen={navigationOpen}
      onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'VPC', href: '#/' },
            { text: 'Transit gateways', href: '#/transit-gateways' },
          ]}
        />
      }
      notifications={
        <Flashbar
          items={
            flashDismissed
              ? []
              : [
                  {
                    type: 'info',
                    dismissible: true,
                    dismissLabel: 'Dismiss',
                    onDismiss: () => setFlashDismissed(true),
                    content:
                      'You can visualize and monitor your transit gateways from the network manager. Register your transit gateway by creating a global network to get started.',
                  },
                ]
          }
        />
      }
      navigation={
        <SideNavigation
          activeHref={activeHref}
          header={{ href: '#/dashboard', text: 'VPC dashboard' }}
          itemsControl={
            <Select
              selectedOption={null}
              placeholder="Choose a VPC"
              options={[{ value: 'vpc-626163728', label: 'vpc-626163728' }]}
              ariaLabel="Filter by VPC"
            />
          }
          items={items}
          onFollow={onFollow}
        />
      }
      content={
        <Table
          variant="full-page"
          items={[]}
          columnDefinitions={[
            { id: 'name', header: 'Name', cell: () => null },
            { id: 'id', header: 'Transit gateway ID', cell: () => null },
            { id: 'owner', header: 'Owner ID', cell: () => null },
            { id: 'state', header: 'State', cell: () => null },
          ]}
          selectionType="multi"
          header={
            <Header
              variant="awsui-h1-sticky"
              info={<Link variant="info">Info</Link>}
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button iconName="refresh" ariaLabel="Refresh" />
                  <ButtonDropdown items={[{ id: 'delete', text: 'Delete', disabled: true }]}>Actions</ButtonDropdown>
                  <Button variant="primary">Create transit gateway</Button>
                </SpaceBetween>
              }
            >
              Transit gateways
            </Header>
          }
          filter={
            <TextFilter
              filteringText=""
              filteringPlaceholder="Find transit gateway by attribute or tag"
              filteringAriaLabel="Find transit gateway"
            />
          }
          pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No transit gateways</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                You do not have any transit gateways in this region.
              </Box>
              <Button>Create transit gateway</Button>
            </Box>
          }
        />
      }
    />
  );
}
