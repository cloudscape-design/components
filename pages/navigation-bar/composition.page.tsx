// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { ButtonDropdownProps, Container, Header } from '~components';
import BreadcrumbGroup from '~components/breadcrumb-group';
import ButtonGroup from '~components/button-group';
import Input from '~components/input';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SideNavigation from '~components/side-navigation';

import ScreenshotArea from '../utils/screenshot-area';

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'preferences', text: 'Preferences' },
  { id: 'signout', text: 'Sign out' },
];

export default function NavigationBarCompositionPage() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <article>
      <h1>Navigation Bar — Composition Patterns</h1>

      <h2>Multi-row: primary + secondary</h2>
      <ScreenshotArea gutters={false}>
        <NavigationBar
          variant="primary"
          ariaLabel="Global navigation"
          startContent={
            <Link href="#" fontSize="heading-m" color="inverted">
              My Application
            </Link>
          }
          centerContent={
            <Input
              ariaLabel="Search"
              type="search"
              placeholder="Search resources..."
              value={searchValue}
              onChange={({ detail }) => setSearchValue(detail.value)}
            />
          }
          endContent={
            <ButtonGroup
              variant="icon"
              ariaLabel="Global actions"
              items={[
                { type: 'icon-button', id: 'notifications', text: 'Notifications', iconName: 'notification' },
                { type: 'menu-dropdown', id: 'profile', text: 'Jane Doe', items: profileItems },
              ]}
              onItemClick={() => {}}
            />
          }
        />
        <NavigationBar
          variant="secondary"
          ariaLabel="Page navigation"
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
              ]}
              onItemClick={() => {}}
            />
          }
        />
        <div style={{ padding: '20px' }}>
          <Container header={<Header>Project Alpha</Header>}>Page content goes here.</Container>
        </div>
      </ScreenshotArea>

      <h2>App shell: horizontal bar + vertical rail + side navigation</h2>
      <ScreenshotArea gutters={false}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <NavigationBar
            variant="primary"
            ariaLabel="Top navigation"
            startContent={
              <Link href="#" fontSize="heading-m" color="inverted">
                Dashboard
              </Link>
            }
            endContent={
              <ButtonGroup
                variant="icon"
                ariaLabel="Utilities"
                items={[
                  { type: 'icon-button', id: 'help', text: 'Help', iconName: 'status-info' },
                  { type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems },
                ]}
                onItemClick={() => {}}
              />
            }
          />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <NavigationBar
              variant="secondary"
              placement="inline-start"
              ariaLabel="Tool rail"
              startContent={
                <ButtonGroup
                  variant="icon"
                  ariaLabel="Tools"
                  items={[
                    { type: 'icon-button', id: 'home', text: 'Home', iconName: 'view-full' },
                    { type: 'icon-button', id: 'search', text: 'Search', iconName: 'search' },
                    { type: 'icon-button', id: 'folder', text: 'Files', iconName: 'folder' },
                    { type: 'icon-button', id: 'edit', text: 'Editor', iconName: 'edit' },
                  ]}
                  onItemClick={() => {}}
                />
              }
              endContent={
                <ButtonGroup
                  variant="icon"
                  ariaLabel="Account"
                  items={[{ type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' }]}
                  onItemClick={() => {}}
                />
              }
            />
            <div style={{ width: '240px', borderInlineEnd: '1px solid #e9ebed', overflow: 'auto' }}>
              <SideNavigation
                header={{ text: 'Navigation', href: '#' }}
                items={[
                  { type: 'link', text: 'Overview', href: '#' },
                  { type: 'link', text: 'Analytics', href: '#' },
                  { type: 'link', text: 'Deployments', href: '#' },
                  { type: 'link', text: 'Monitoring', href: '#' },
                  {
                    type: 'section',
                    text: 'Settings',
                    items: [
                      { type: 'link', text: 'General', href: '#' },
                      { type: 'link', text: 'Permissions', href: '#' },
                    ],
                  },
                ]}
                activeHref="#"
              />
            </div>
            <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
              <Container header={<Header>Overview</Header>}>
                <p>Main content area with a vertical tool rail, side navigation, and primary top bar.</p>
              </Container>
            </div>
          </div>
        </div>
      </ScreenshotArea>
    </article>
  );
}
