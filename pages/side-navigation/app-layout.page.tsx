// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import AppLayout from '~components/app-layout';
import Badge from '~components/badge';

import logoSmall from './logos/logo-small.svg';

const items: SideNavigationProps.Item[] = [
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
  return (
    <AppLayout
      toolsHide={true}
      navigationOpen={true}
      contentType="form"
      ariaLabels={{ navigationClose: 'Close' }}
      navigation={
        <SideNavigation
          activeHref="#/"
          header={{
            href: '#/',
            text: 'Header title',
            logo: {
              src: logoSmall,
              alt: 'logo',
            },
          }}
          items={items}
        />
      }
      content={
        <>
          <h1>App Layout with Side navigation</h1>
        </>
      }
    />
  );
}
