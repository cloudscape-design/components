// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonDropdownProps } from '~components';
import ButtonGroup from '~components/button-group';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

import ScreenshotArea from '../utils/screenshot-area';

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'signout', text: 'Sign out' },
];

export default function NavigationBarIntegPage() {
  return (
    <article>
      <h1>NavigationBar Integ Page</h1>
      <ScreenshotArea gutters={false}>
        <NavigationBar
          data-testid="primary-bar"
          ariaLabel="Primary navigation"
          startContent={
            <Link href="#" fontSize="heading-m" color="inverted">
              App Name
            </Link>
          }
          endContent={
            <ButtonGroup
              variant="icon"
              ariaLabel="Utilities"
              items={[
                { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
                { type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems },
              ]}
              onItemClick={() => {}}
            />
          }
        />
        <NavigationBar
          data-testid="secondary-bar"
          variant="secondary"
          ariaLabel="Page toolbar"
          startContent={<span>Toolbar content</span>}
          endContent={
            <ButtonGroup
              variant="icon"
              ariaLabel="Actions"
              items={[{ type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' }]}
              onItemClick={() => {}}
            />
          }
        />
      </ScreenshotArea>
    </article>
  );
}
