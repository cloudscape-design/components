// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

const ITEMS: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Link',
    href: '#/page1',
  },
  {
    type: 'expandable-link-group',
    text: 'Expandable link group',
    href: '#/exp-link-group',
    items: [
      {
        type: 'link',
        text: 'Page 2',
        href: '#/page2',
      },
      {
        type: 'link',
        text: 'Page 3',
        href: '#/page3',
      },
    ],
  },
];

export default function SideNavigationPage() {
  const [activeHref, setActiveHref] = useState<string>('#/page1');

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    setActiveHref(e.detail.href);
    e.preventDefault();
  }, []);

  return (
    <>
      <h1>Side Navigation</h1>
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
