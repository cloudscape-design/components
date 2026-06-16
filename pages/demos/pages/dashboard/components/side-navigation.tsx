// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import Popover from '@cloudscape-design/components/popover';
import { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

import { Navigation as CommonNavigation } from '../../commons';
import { DensityPreferencesDialog } from './density-preferences';

const navItems: SideNavigationProps['items'] = [
  { type: 'link', text: 'Dashboard', href: '#/' },
  {
    type: 'link',
    text: 'Events',
    href: '#/events',
    info: (
      <Box color="text-status-info" variant="span">
        <Popover
          header="Introducing events"
          size="medium"
          triggerType="text"
          content={
            <>
              AWS can schedule events for your instances, such as reboot, stop/start, or retirement.{' '}
              <Link
                external={true}
                ariaLabel="Learn more about events management, opens in new tab"
                href="#"
                variant="primary"
              >
                Learn more
              </Link>
            </>
          }
          renderWithPortal={true}
          dismissAriaLabel="Close"
        >
          <Box
            variant="span"
            fontSize="body-s"
            fontWeight="bold"
            data-testid="new-feature-announcement-trigger"
            color="text-status-info"
          >
            New
          </Box>
        </Popover>
      </Box>
    ),
  },
  { type: 'link', text: 'Tags', href: '#/tags' },
  { type: 'link', text: 'Reports', href: '#/reports' },
  { type: 'link', text: 'Limits', href: '#/limits' },
  {
    text: 'Instances',
    type: 'section',
    defaultExpanded: true,
    items: [
      { type: 'link', text: 'Instances', href: '#/instances' },
      {
        type: 'link',
        text: 'Launch templates',
        href: '#/launch_templates',
        info: (
          <Box color="text-status-info" variant="span">
            <Popover
              header="Introducing launch templates"
              size="medium"
              triggerType="text"
              content={
                <>
                  Launch templates is a new capability that enables a new way to templatize your launch requests. Launch
                  templates streamline and simplify the launch process for auto scaling, spot fleet, spot, and on-demand
                  instances.{' '}
                  <Link
                    external={true}
                    href="#"
                    ariaLabel="Learn more about launch templates, opens in new tab"
                    variant="primary"
                  >
                    Learn more
                  </Link>
                </>
              }
              renderWithPortal={true}
              dismissAriaLabel="Close"
            >
              <Box fontSize="body-s" fontWeight="bold" variant="span" color="text-status-info">
                New
              </Box>
            </Popover>
          </Box>
        ),
      },
      { type: 'link', text: 'Spot requests', href: '#/spot_requests' },
      { type: 'link', text: 'Reserved instances', href: '#/reserved_instances' },
      { type: 'link', text: 'Dedicated hosts', href: '#/dedicated_hosts' },
      {
        type: 'link',
        text: 'Scheduled instances',
        href: '#/scheduled_instances',
        info: (
          <Box color="text-status-info" variant="span">
            <Popover
              data-testid="beta"
              header="Beta feature"
              size="medium"
              triggerType="text"
              content={
                <>
                  We are improving the way to create scheduled instances.{' '}
                  <Link
                    external={true}
                    href="#"
                    ariaLabel="Learn more about instance scheduling, opens in new tab"
                    variant="primary"
                  >
                    Learn more
                  </Link>
                </>
              }
              renderWithPortal={true}
              dismissAriaLabel="Close"
            >
              <Box fontSize="body-s" fontWeight="bold" variant="span" color="text-status-info">
                Beta
              </Box>
            </Popover>
          </Box>
        ),
      },
      { type: 'link', text: 'Capacity reservations', href: '#/capacity_reservations' },
    ],
  },
  {
    text: 'Images',
    type: 'section',
    defaultExpanded: false,
    items: [
      { type: 'link', text: 'AMIs', href: '#/amis' },
      { type: 'link', text: 'Bundle tasks', href: '#/bundle_tasks' },
    ],
  },
  {
    text: 'Elastic block store',
    type: 'section',
    defaultExpanded: false,
    items: [
      { type: 'link', text: 'Volumes', href: '#/volumes' },
      { type: 'link', text: 'Snapshots', href: '#/snapshots' },
      { type: 'link', text: 'Lifecycle manager', href: '#/lifecycle_manager' },
    ],
  },
  {
    text: ' Network & security',
    type: 'section',
    defaultExpanded: false,
    items: [
      { type: 'link', text: 'Security groups', href: '#/security_groups' },
      { type: 'link', text: 'Elastic IPs', href: '#/elastic_ips' },
      { type: 'link', text: 'Placement groups', href: '#/placement_groups' },
      { type: 'link', text: 'Key pairs', href: '#/key_pairs' },
      { type: 'link', text: 'Network interfaces', href: '#/network_interfaces' },
    ],
  },
  {
    text: 'Load balancing',
    type: 'section',
    defaultExpanded: false,
    items: [
      { type: 'link', text: 'Load balancers', href: '#/load_balancers' },
      { type: 'link', text: 'Target groups', href: '#/target_groups' },
    ],
  },
  {
    text: 'Auto scaling',
    type: 'section',
    defaultExpanded: false,
    items: [
      { type: 'link', text: 'Launch configurations', href: '#/launch_configurations' },
      { type: 'link', text: 'Auto scaling groups', href: '#/auto_scaling_groups' },
    ],
  },
  { type: 'divider' },
  {
    type: 'link',
    href: '#/density_settings',
    text: 'Density settings',
  },
];

export function DashboardSideNavigation() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const onFollowHandler: SideNavigationProps['onFollow'] = event => {
    event.preventDefault();
    if (event.detail.href === '#/density_settings') {
      setDialogVisible(true);
    }
  };

  return (
    <>
      <CommonNavigation items={navItems} activeHref="#/" onFollowHandler={onFollowHandler} />
      {dialogVisible && <DensityPreferencesDialog onDismiss={() => setDialogVisible(false)} />}
    </>
  );
}
