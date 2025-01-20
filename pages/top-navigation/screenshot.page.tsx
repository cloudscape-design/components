// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Input from '~components/input';
import TopNavigation from '~components/top-navigation';

import ScreenshotArea from '../utils/screenshot-area';
import { I18N_STRINGS } from './common';
import logo from './logos/simple-logo.svg';

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

const noop = () => {};

export default function TopNavigationPage() {
  return (
    <>
      <h1>Simple TopNavigation</h1>
      <ScreenshotArea>
        {[1200, 1000, 800, 600, 400, 300].map(width => (
          <section key={width} style={{ width }}>
            <h2>Maximum width: {width}px</h2>
            <TopNavigation
              i18nStrings={I18N_STRINGS}
              identity={{
                href: '#',
                title: 'Service title',
                logo: {
                  src: logo,
                  alt: 'Logo',
                },
              }}
              utilities={[
                {
                  type: 'button',
                  variant: 'primary-button',
                  text: 'Sign in',
                },
              ]}
            />
            <br />
            <TopNavigation
              i18nStrings={I18N_STRINGS}
              identity={{
                href: '#',
                title: 'Service title',
                logo: {
                  src: logo,
                  alt: 'Logo',
                },
              }}
              utilities={[
                {
                  type: 'button',
                  iconName: 'heart',
                  ariaLabel: 'Favorite',
                },
                {
                  type: 'button',
                  variant: 'link',
                  text: 'Docs',
                  external: true,
                  externalIconAriaLabel: 'Opens in a new tab',
                },
              ]}
            />
            <br />
            <TopNavigation
              i18nStrings={I18N_STRINGS}
              identity={{
                href: '#',
                title: 'Title with an href',
                logo: {
                  src: logo,
                  alt: 'Logo',
                },
              }}
              utilities={[
                {
                  type: 'button',
                  text: 'Events',
                  iconName: 'calendar',
                },
                {
                  type: 'button',
                  text: 'Docs',
                  href: 'https://docs.aws.amazon.com/',
                  external: true,
                  externalIconAriaLabel: 'opens in a new tab',
                },
                {
                  type: 'menu-dropdown',
                  text: 'Settings',
                  iconName: 'settings',
                  items: simpleActions,
                },
                {
                  type: 'menu-dropdown',
                  text: 'John Doe',
                  title: 'John Doe',
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
              search={<Input type="search" placeholder="Search for a thing..." value="" onChange={noop} />}
              utilities={[
                { type: 'menu-dropdown', text: 'Settings', iconName: 'settings', items: simpleActions },
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
              utilities={[
                {
                  type: 'button',
                  text: 'Docs',
                  href: 'https://docs.aws.amazon.com/',
                  external: true,
                  externalIconAriaLabel: 'opens in a new tab',
                },
                {
                  type: 'button',
                  text: 'Events',
                  href: 'https://docs.aws.amazon.com',
                  iconName: 'calendar',
                  disableTextCollapse: true,
                },
                {
                  type: 'button',
                  text: 'Favorites',
                  iconName: 'heart',
                  href: 'https://docs.aws.amazon.com',
                  disableTextCollapse: true,
                },
                {
                  type: 'menu-dropdown',
                  text: 'Settings',
                  iconName: 'settings',
                  badge: true,
                  items: simpleActions,
                },
                {
                  type: 'menu-dropdown',
                  ariaLabel: 'Notifications',
                  title: 'Notifications',
                  iconName: 'notification',
                  items: notificationActions,
                  disableUtilityCollapse: false,
                  badge: true,
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
          </section>
        ))}
      </ScreenshotArea>
    </>
  );
}
