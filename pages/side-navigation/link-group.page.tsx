// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import Popover from '~components/popover';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

import ScreenshotArea from '../utils/screenshot-area';

const items: SideNavigationProps.Item[] = [
  {
    type: 'link-group',
    text: 'Dashboards',
    href: '#/dashboards',
    items: [
      { type: 'link', text: 'Overview', href: '#/dashboards/overview' },
      { type: 'link', text: 'Metrics', href: '#/dashboards/metrics' },
      { type: 'link', text: 'Alarms', href: '#/dashboards/alarms' },
    ],
  },
  {
    type: 'link-group',
    text: 'Resources',
    href: '#/resources',
    info: <Popover content="This is new">New</Popover>,
    items: [
      { type: 'link', text: 'Instances', href: '#/resources/instances' },
      { type: 'link', text: 'Volumes', href: '#/resources/volumes' },
      { type: 'link', text: 'Snapshots', href: '#/resources/snapshots' },
      { type: 'link', text: 'Security groups', href: '#/resources/security-groups' },
    ],
  },
  {
    type: 'link-group',
    text: 'Label with a long name so that it wraps',
    href: '#/resources',
    info: <Popover content="This is new">New</Popover>,
    items: [{ type: 'link', text: 'Instances', href: '#/resources/instances' }],
  },
];

export default function SideNavigationLinkGroupInfoPage() {
  const [activeHref, setActiveHref] = useState('#/dashboards/overview');

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    setActiveHref(e.detail.href);
    e.preventDefault();
  }, []);

  return (
    <>
      <h1>Side navigation — Link group</h1>
      <ScreenshotArea style={{ maxWidth: 300 }}>
        <SideNavigation
          activeHref={activeHref}
          header={{ href: '#/', text: 'Service name' }}
          items={items}
          onFollow={onFollow}
        />
      </ScreenshotArea>
    </>
  );
}
