// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import Badge from '~components/badge';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

const ITEMS: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Page 1',
    href: '#/page1',
  },
  {
    type: 'link',
    text: 'Page 2',
    href: '#/page2',
  },
  {
    type: 'section',
    text: 'Section',
    items: [
      {
        type: 'link',
        text: 'Page 3',
        href: '#/page3',
      },
      {
        type: 'link',
        text: 'Page 4',
        href: '#/page4',
      },
      {
        type: 'link',
        text: 'Page 5',
        href: '#/page5',
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
        text: 'Page 6',
        href: '#/page6',
      },
      {
        type: 'link',
        text: 'Page 7',
        href: '#/page7',
      },
      {
        type: 'link',
        text: 'Page 8',
        href: '#/page8',
      },
    ],
  },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Section Group',
    items: [
      {
        type: 'link',
        text: 'Overview',
        href: '#/page6',
      },
      {
        type: 'expandable-link-group',
        text: 'Expandable link group',
        href: '#/exp-link-group',
        items: [
          {
            type: 'link',
            text: 'Page 9',
            href: '#/page9',
          },
          {
            type: 'link',
            text: 'Page 10',
            href: '#/page10',
          },
        ],
      },
    ],
  },
  { type: 'divider' },
  {
    type: 'expandable-link-group',
    text: 'Expandable link group',
    href: '#/exp-link-group',
    items: [
      {
        type: 'link',
        text: 'Page 9',
        href: '#/page9',
      },
      {
        type: 'link',
        text: 'Page 10',
        href: '#/page10',
      },
      {
        type: 'expandable-link-group',
        text: 'Expandable link group',
        href: '#/exp-link-group-inner',
        items: [
          {
            type: 'link',
            text: 'Page 11',
            href: '#/page11',
          },
          {
            type: 'link',
            text: 'Page 12',
            href: '#/page12',
          },
        ],
      },
    ],
  },
  { type: 'divider' },
  { type: 'link', text: 'Notifications', href: '#/notifications', info: <Badge color="red">23</Badge> },
  { type: 'link', text: 'Documentation', href: '#', external: true, externalIconAriaLabel: 'Opens in a new tab' },
];

export default function SideNavigationPage() {
  const [activeHref, setActiveHref] = useState<string>('#/page2');

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
