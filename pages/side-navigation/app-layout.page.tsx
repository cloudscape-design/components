// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Badge from '~components/badge';
import Select from '~components/select';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

import labels from '../app-layout/utils/labels';
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

const itemsControl = (
  <Select
    options={[
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ]}
    selectedOption={{ value: 'option1', label: 'Option 1' }}
    onChange={() => null}
  />
);

export default function SideNavigationPage() {
  const [open, setOpen] = React.useState(true);

  return (
    <AppLayout
      navigationOpen={open}
      onNavigationChange={({ detail }) => {
        setOpen(detail.open);
      }}
      contentType="form"
      ariaLabels={labels}
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
          itemsControl={itemsControl}
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
