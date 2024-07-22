// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '~components/badge';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

const items: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Page',
    href: '#/page1',
  },
  {
    type: 'divider',
  },
  {
    type: 'section-group',
    title: 'Section header',
    items: [
      {
        type: 'link',
        text: 'Page',
        href: '#/page1',
      },
      {
        type: 'link',
        text: 'Page',
        href: '#/page1',
      },
    ],
  },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Section group title',
    items: [
      {
        type: 'link',
        text: 'Overview',
        href: '#/page1',
      },
      {
        type: 'section',
        text: 'Contributions',
        items: [
          {
            type: 'link',
            text: 'Design',
            href: '#/design',
          },
          {
            type: 'link',
            text: 'Dev',
            href: '#/dev',
          },
        ],
      },
      {
        type: 'link',
        text: 'Page',
        href: '#/page1',
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
      {
        type: 'link',
        text: 'Page',
        href: '#/page1',
      },
      {
        type: 'link-group',
        text: 'Link group',
        href: '#/link-group',
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
      {
        type: 'link',
        text: 'Page',
        href: '#/page1',
      },
    ],
  },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'H3 Section Header',
    items: [
      {
        type: 'link',
        text: 'Page',
        href: '#/page1',
      },
      {
        type: 'section',
        text: 'Contributions',
        items: [
          {
            type: 'link',
            text: 'Design',
            href: '#/design',
          },
          {
            type: 'link',
            text: 'Dev',
            href: '#/dev',
          },
        ],
      },
    ],
  },
  { type: 'link', text: 'Notifications', href: '#/notifications', info: <Badge color="red">23</Badge> },
  { type: 'link', text: 'Documentation', href: '#', external: true, externalIconAriaLabel: 'Opens in a new tab' },
];

export default function SideNavigationPage() {
  return (
    <>
      <h1>Side navigation with section-groups</h1>
      <SideNavigation
        activeHref="#/"
        header={{
          href: '#/',
          text: 'Header title',
        }}
        items={items}
      />
    </>
  );
}
