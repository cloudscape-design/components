// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Checkbox, Input, TopNavigation } from '~components';

import { SimplePage } from '../app/templates';
import logo from './logos/simple-logo.svg';

import styles from './style-v2.scss';

export default function TopNavigationStyleV2Page() {
  const [useCustom, setUseCustom] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  return (
    <SimplePage
      title="Top Navigation with Style API v2"
      screenshotArea={{}}
      settings={
        <Checkbox checked={useCustom} onChange={({ detail }) => setUseCustom(detail.checked)}>
          Custom styling
        </Checkbox>
      }
    >
      <TopNavigation
        identity={{ title: 'CloudApp', href: '#', logo: { src: logo, alt: 'Logo' } }}
        search={
          <Input
            type="search"
            placeholder="Search resources..."
            value={searchValue}
            onChange={({ detail }) => setSearchValue(detail.value)}
            classNames={{ root: styles['search-input'] }}
          />
        }
        utilities={[
          {
            type: 'button',
            iconName: 'notification',
            ariaLabel: 'Notifications',
            disableUtilityCollapse: true,
          },
          {
            type: 'button',
            text: 'Settings',
            iconName: 'settings',
            href: '#',
          },
          {
            type: 'menu-dropdown',
            text: 'Jane Doe',
            description: 'jane.doe@example.com',
            iconName: 'user-profile',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'preferences', text: 'Preferences' },
              { id: 'signout', text: 'Sign out' },
            ],
          },
        ]}
        classNames={
          useCustom
            ? {
                root: styles['styled-nav'],
                utility: ({ utility }) => {
                  if (utility.iconName === 'notification') {
                    return styles['utility-notification'];
                  }
                  if (utility.text === 'Settings') {
                    return styles['utility-settings'];
                  }
                  if (utility.type === 'menu-dropdown') {
                    return styles['utility-profile'];
                  }
                  return '';
                },
              }
            : undefined
        }
      />
    </SimplePage>
  );
}
