// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Input from '~components/input';
import TopNavigation from '~components/top-navigation';

import ScreenshotArea from '../utils/screenshot-area';
import { I18N_STRINGS, profileActions } from './common';
import logo from './logos/simple-logo.svg';

export default function Page() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <ScreenshotArea gutters={false}>
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Service name',
          logo: { src: logo, alt: 'Service name logo' },
        }}
        search={
          <Input
            ariaLabel="Input field"
            value={searchValue}
            type="search"
            placeholder="Search"
            onChange={({ detail }) => setSearchValue(detail.value)}
          />
        }
        utilities={[
          { type: 'button', variant: 'link', external: true, text: 'AWS', href: 'https://console.aws.amazon.com/' },
          {
            type: 'button',
            iconName: 'notification',
            ariaLabel: 'Notifications',
            badge: true,
            disableUtilityCollapse: true,
          },
          { type: 'button', iconName: 'settings', title: 'Settings', ariaLabel: 'Settings' },
          {
            type: 'menu-dropdown',
            text: 'Customer name',
            description: 'customer@example.com',
            iconName: 'user-profile',
            items: profileActions,
            disableTextCollapse: true,
          },
        ]}
      />

      <h1>Top Navigation Overflow menu</h1>

      <button id="focus">Move focus</button>
    </ScreenshotArea>
  );
}
