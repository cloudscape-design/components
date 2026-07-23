// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

const ITEMS: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Internal page',
    href: '#/internal',
  },
  {
    type: 'link',
    text: 'External link (no aria label)',
    href: 'https://aws.amazon.com/',
    external: true,
  },
  {
    type: 'link',
    text: 'External link (with aria label)',
    href: 'https://aws.amazon.com/documentation/',
    external: true,
    externalIconAriaLabel: 'Opens in a new tab',
  },
  {
    type: 'link',
    text: 'External link with info badge',
    href: 'https://aws.amazon.com/new/',
    external: true,
    externalIconAriaLabel: 'Opens in a new tab',
    info: <span>New</span>,
  },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Section with external links',
    items: [
      {
        type: 'link',
        text: 'External in section',
        href: 'https://aws.amazon.com/pricing/',
        external: true,
        externalIconAriaLabel: 'Opens in a new tab',
      },
      {
        type: 'link',
        text: 'Internal in section',
        href: '#/internal-section',
      },
    ],
  },
  {
    type: 'link-group',
    text: 'Link group',
    href: '#/link-group',
    items: [
      {
        type: 'link',
        text: 'External in link group',
        href: 'https://aws.amazon.com/blogs/',
        external: true,
        externalIconAriaLabel: 'Opens in a new tab',
      },
    ],
  },
  {
    type: 'expandable-link-group',
    text: 'Expandable link group',
    href: '#/expandable',
    defaultExpanded: true,
    items: [
      {
        type: 'link',
        text: 'External in expandable group',
        href: 'https://aws.amazon.com/whats-new/',
        external: true,
        externalIconAriaLabel: 'Opens in a new tab',
      },
      {
        type: 'link',
        text: 'Internal in expandable group',
        href: '#/internal-expandable',
      },
    ],
  },
];

export default function SideNavigationExternalLinkPage() {
  const [activeHref, setActiveHref] = useState<string>('#/internal');

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    if (!e.detail.external) {
      setActiveHref(e.detail.href);
      e.preventDefault();
    }
  }, []);

  return (
    <>
      <h1>Side Navigation — External link icon</h1>
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
