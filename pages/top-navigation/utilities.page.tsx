// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Input from '~components/input';
import TopNavigation from '~components/top-navigation';
import { I18N_STRINGS } from './common';

const profileActions = [
  { type: 'button', id: 'profile', text: 'Profile' },
  { type: 'button', id: 'preferences', text: 'Preferences' },
  { type: 'button', id: 'security', text: 'Security' },
  {
    type: 'menu-dropdown',
    id: 'support-group',
    text: 'Support',
    items: [
      {
        id: 'documentation',
        text: 'Documentation',
        href: '#',
        external: true,
        externalIconAriaLabel: ' (opens in new tab)',
      },
      { id: 'feedback', text: 'Feedback', href: '#', external: true, externalIconAriaLabel: ' (opens in new tab)' },
      { id: 'support', text: 'Customer support' },
    ],
  },
  { type: 'button', id: 'signout', text: 'Sign out' },
];

const notificationActions = [
  {
    id: 'notifications',
    text: '',
    items: [
      { id: '1', text: 'Notifications type 1' },
      { id: '2', text: 'Notifications type 2' },
      { id: '3', text: 'Notifications type 3' },
      { id: '1', text: 'Notifications type 1' },
    ],
  },
  { id: 'all', text: 'View all' },
];

const simpleActions = [
  {
    id: '1',
    text: 'Option 1',
  },
  {
    id: '2',
    text: 'Option 2',
  },
  {
    id: '3',
    text: 'Option 3',
  },
  {
    id: '4',
    text: 'Option 4',
  },
  {
    id: '5',
    text: 'Option 5',
  },
];

export default function TopNavigationPage() {
  return (
    <article>
      <h1>Simple TopNavigation</h1>
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Title with an href',
        }}
        utilities={[
          {
            type: 'button',
            variant: 'primary-button',
            text: 'New Thing',
            iconName: 'add-plus',
          },
          { type: 'menu-dropdown', text: 'Settings', iconName: 'settings', items: simpleActions },
          {
            type: 'button',
            text: 'Docs',
            href: 'https://docs.aws.amazon.com/',
            external: true,
            externalIconAriaLabel: 'opens in a new tab',
          },
          {
            type: 'menu-dropdown',
            text: 'John Doe',
            description: 'john.doe@example.com',
            iconName: 'envelope',
            items: profileActions,
          },
        ]}
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Title with an href',
        }}
        search={<Input ariaLabel="Input field" value="" onChange={() => {}} />}
        utilities={[
          { type: 'menu-dropdown', text: 'Settings', iconName: 'settings', items: simpleActions },
          {
            type: 'menu-dropdown',
            text: 'Jane Doe',
            description: 'jane.doe@example.com',
            iconName: 'envelope',
            items: profileActions,
          },
        ]}
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Title with an href',
        }}
        utilities={[
          { type: 'menu-dropdown', text: 'Settings', iconName: 'settings', badge: true, items: simpleActions },
          {
            type: 'menu-dropdown',
            ariaLabel: 'Notifications',
            title: 'Notifications',
            iconName: 'notification',
            items: notificationActions,
            disableUtilityCollapse: true,
            badge: true,
          },
          {
            type: 'menu-dropdown',
            text: 'Jane Doe',
            description: 'jane.doe@example.com',
            iconName: 'envelope',
            items: profileActions,
          },
        ]}
      />
    </article>
  );
}
