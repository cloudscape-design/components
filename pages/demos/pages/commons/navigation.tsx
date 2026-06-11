// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import SideNavigation, { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

const navHeader = { text: 'Service', href: '#/' };
export const navItems: SideNavigationProps['items'] = [
  {
    type: 'section',
    text: 'Reports and analytics',
    items: [
      { type: 'link', text: 'Distributions', href: '#/distributions' },
      { type: 'link', text: 'Cache statistics', href: '#/cache' },
      { type: 'link', text: 'Monitoring and alarms', href: '#/monitoring' },
      { type: 'link', text: 'Popular objects', href: '#/popular' },
      { type: 'link', text: 'Top referrers', href: '#/referrers' },
      { type: 'link', text: 'Usage', href: '#/usage' },
      { type: 'link', text: 'Viewers', href: '#/viewers' },
    ],
  },
  {
    type: 'section',
    text: 'Private content',
    items: [
      { type: 'link', text: 'How-to guide', href: '#/howto' },
      { type: 'link', text: 'Origin access identity', href: '#/origin' },
    ],
  },
];

interface NavigationProps {
  activeHref?: string;
  header?: SideNavigationProps['header'];
  items?: SideNavigationProps['items'];
  onFollowHandler?: SideNavigationProps['onFollow'];
}

export function Navigation({
  activeHref: activeHrefProp,
  header = navHeader,
  items = navItems,
  onFollowHandler,
}: NavigationProps) {
  const [activeHref, setActiveHref] = useState(activeHrefProp || '#/distributions');

  const handleFollow: SideNavigationProps['onFollow'] = event => {
    event.preventDefault();
    setActiveHref(event.detail.href);
    onFollowHandler?.(event);
  };

  return <SideNavigation items={items} header={header} activeHref={activeHref} onFollow={handleFollow} />;
}
