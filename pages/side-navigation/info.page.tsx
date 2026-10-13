// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import Link from '~components/link';
import Popover from '~components/popover';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

import { SimplePage } from '../app/templates';

const info = (header: string) => (
  <Popover header={header} content={<Link href="#">Learn more</Link>}>
    Info
  </Popover>
);

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'link', href: '#/link', info: info('link') },
  {
    type: 'link-group',
    text: 'link-group',
    href: '#/link-group',
    info: info('link-group'),
    items: [{ type: 'link', text: 'link', href: '#/link-group/link', info: info('link') }],
  },
  { type: 'divider' },
  {
    type: 'expandable-link-group',
    text: 'expandable-link-group',
    href: '#/expandable-link-group',
    defaultExpanded: true,
    info: info('expandable-link-group'),
    items: [{ type: 'link', text: 'link', href: '#/expandable-link-group/link', info: info('link') }],
  },
  {
    // Sections do not support info.
    type: 'section',
    text: 'section',
    items: [{ type: 'link', text: 'link', href: '#/section/link', info: info('link') }],
  },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'section-group',
    info: info('section-group'),
    items: [{ type: 'link', text: 'link', href: '#/section-group/link', info: info('link') }],
  },
];

export default function SideNavigationInfoPage() {
  const [activeHref, setActiveHref] = useState('#/link');

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    setActiveHref(e.detail.href);
    e.preventDefault();
  }, []);

  return (
    <SimplePage title="Side navigation with info" screenshotArea={{ style: { maxWidth: 300 } }}>
      <SideNavigation
        activeHref={activeHref}
        header={{ href: '#/', text: 'Service name' }}
        items={items}
        onFollow={onFollow}
      />
    </SimplePage>
  );
}
