// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, ButtonDropdownProps } from '~components';
import BreadcrumbGroup from '~components/breadcrumb-group';
import ButtonGroup from '~components/button-group';
import Input from '~components/input';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'preferences', text: 'Preferences' },
  { id: 'signout', text: 'Sign out' },
];

export default function NavigationBarSimplePage() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <article>
      <h1>Simple Navigation Bar</h1>
      <ScreenshotArea gutters={false}>
        <SpaceBetween size="l">
          <Box>
            <h2>Primary with search and utilities</h2>
            <NavigationBar
              ariaLabel="Main navigation"
              startContent={
                <Link href="#" fontSize="heading-m" color="inverted">
                  Service Name
                </Link>
              }
              centerContent={
                <Input
                  ariaLabel="Search"
                  type="search"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={({ detail }) => setSearchValue(detail.value)}
                />
              }
              endContent={
                <ButtonGroup
                  variant="icon"
                  ariaLabel="Utilities"
                  items={[
                    { type: 'icon-button', id: 'notifications', text: 'Notifications', iconName: 'notification' },
                    { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
                    { type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems },
                  ]}
                  onItemClick={() => {}}
                />
              }
            />
          </Box>

          <Box>
            <h2>Secondary toolbar with breadcrumbs</h2>
            <NavigationBar
              variant="secondary"
              ariaLabel="Page toolbar"
              startContent={
                <BreadcrumbGroup
                  items={[
                    { text: 'Home', href: '#' },
                    { text: 'Projects', href: '#' },
                    { text: 'Project Alpha', href: '#' },
                  ]}
                />
              }
              endContent={
                <ButtonGroup
                  variant="icon"
                  ariaLabel="Page actions"
                  items={[
                    { type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' },
                    { type: 'icon-button', id: 'download', text: 'Export', iconName: 'download' },
                    { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
                  ]}
                  onItemClick={() => {}}
                />
              }
            />
          </Box>

          <Box>
            <h2>Primary — start and end only</h2>
            <NavigationBar
              ariaLabel="Minimal navigation"
              startContent={
                <Link href="#" fontSize="heading-m" color="inverted">
                  Dashboard
                </Link>
              }
              endContent={
                <ButtonGroup
                  variant="icon"
                  ariaLabel="Account"
                  items={[{ type: 'menu-dropdown', id: 'profile', text: 'Jane Doe', items: profileItems }]}
                  onItemClick={() => {}}
                />
              }
            />
          </Box>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
