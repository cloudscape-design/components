// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

import './css-style-api.css';

const ITEMS: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Dashboard', href: '#/dashboard' },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Compute',
    items: [
      { type: 'link', text: 'Instances', href: '#/instances' },
      { type: 'link', text: 'Launch templates', href: '#/launch-templates' },
    ],
  },
  {
    type: 'expandable-link-group',
    text: 'Storage',
    href: '#/storage',
    items: [
      { type: 'link', text: 'Volumes', href: '#/volumes' },
      { type: 'link', text: 'Snapshots', href: '#/snapshots' },
    ],
  },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Network',
    items: [
      { type: 'link', text: 'VPCs', href: '#/vpcs' },
      { type: 'link', text: 'Subnets', href: '#/subnets' },
    ],
  },
];

export default function Page() {
  const [activeHref, setActiveHref] = useState('#/instances');

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    setActiveHref(e.detail.href);
    e.preventDefault();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div>
        <h2>Default</h2>
        <SideNavigation
          activeHref={activeHref}
          header={{ href: '#/', text: 'AWS Console' }}
          items={ITEMS}
          onFollow={onFollow}
        />
      </div>
      <div>
        <h2>Custom styled (dark)</h2>
        <SideNavigation
          className="custom-nav"
          activeHref={activeHref}
          header={{ href: '#/', text: 'AWS Console' }}
          items={ITEMS}
          onFollow={onFollow}
        />
      </div>
    </div>
  );
}
