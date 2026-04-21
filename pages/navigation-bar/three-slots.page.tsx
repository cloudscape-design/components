// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, ButtonDropdownProps, Header, SpaceBetween } from '~components';
import ButtonGroup from '~components/button-group';
import Input from '~components/input';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'signout', text: 'Sign out' },
];

function SearchInput() {
  const [value, setValue] = useState('');
  return (
    <Input
      type="search"
      ariaLabel="Search"
      placeholder="Search..."
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
    />
  );
}

export default function NavigationBarContentPage() {
  return (
    <article>
      <Box margin="m">
        <SpaceBetween size="xl">
          <Box variant="h1">Navigation Bar — Content</Box>

          <Box>
            <Header variant="h2" description="Consumer controls layout via flex inside the content prop.">
              Full layout with logo, search, and utilities
            </Header>
            <NavigationBar
              ariaLabel="Full navigation"
              content={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <Link href="#" fontSize="heading-m" color="inverted">
                    Service
                  </Link>
                  <div style={{ flex: 1 }}>
                    <SearchInput />
                  </div>
                  <ButtonGroup
                    variant="icon"
                    ariaLabel="Utilities"
                    items={[
                      { type: 'icon-button', id: 'notifications', text: 'Notifications', iconName: 'notification' },
                      { type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems },
                    ]}
                    onItemClick={() => {}}
                  />
                </div>
              }
            />
          </Box>

          <Box>
            <Header variant="h2" description="Logo only — no flex wrapper needed for single items.">
              Logo only
            </Header>
            <NavigationBar
              ariaLabel="Logo only"
              content={
                <Link href="#" fontSize="heading-m" color="inverted">
                  Service
                </Link>
              }
            />
          </Box>

          <Box>
            <Header variant="h2">Secondary toolbar</Header>
            <NavigationBar
              variant="secondary"
              ariaLabel="Toolbar"
              content={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <ButtonGroup
                    variant="icon"
                    ariaLabel="Actions"
                    items={[
                      { type: 'icon-button', id: 'back', text: 'Back', iconName: 'angle-left' },
                      { type: 'icon-button', id: 'forward', text: 'Forward', iconName: 'angle-right' },
                    ]}
                    onItemClick={() => {}}
                  />
                  <span style={{ flex: 1, fontSize: 14 }}>Dashboard / Overview</span>
                  <ButtonGroup
                    variant="icon"
                    ariaLabel="View"
                    items={[{ type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' }]}
                    onItemClick={() => {}}
                  />
                </div>
              }
            />
          </Box>
        </SpaceBetween>
      </Box>
    </article>
  );
}
