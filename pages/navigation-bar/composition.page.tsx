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

const toolItems = [
  { type: 'icon-button' as const, id: 'home', text: 'Home', iconName: 'view-full' as const },
  { type: 'icon-button' as const, id: 'search', text: 'Search', iconName: 'search' as const },
  { type: 'icon-button' as const, id: 'folder', text: 'Files', iconName: 'folder' as const },
  { type: 'icon-button' as const, id: 'edit', text: 'Editor', iconName: 'edit' as const },
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
          content={
            <Link href="#" fontSize="heading-m" color="inverted">
              My Application
            </Link>
          }
        />
        <NavigationBar
          variant="secondary"
          ariaLabel="Page navigation"
          content={
            <BreadcrumbGroup
              items={[
                { text: 'Home', href: '#' },
                { text: 'Projects', href: '#' },
                { text: 'Project Alpha', href: '#' },
              ]}
            />
          }
        />
        <div style={{ padding: '20px' }}>
          <Container header={<Header>Project Alpha</Header>}>Page content goes here.</Container>
        </div>
      </ScreenshotArea>

      <h2>App shell: horizontal bar + vertical rail + side navigation</h2>
      <ScreenshotArea gutters={false}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <NavigationBar
            variant="primary"
            ariaLabel="Top navigation"
            content={
              <Link href="#" fontSize="heading-m" color="inverted">
                Dashboard
              </Link>
            }
          />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <NavigationBar
              variant="secondary"
              placement="inline-start"
              ariaLabel="Tool rail"
              content={<ButtonGroup variant="icon" ariaLabel="Tools" items={toolItems} onItemClick={() => {}} />}
            />
            <div style={{ width: '200px', borderInlineEnd: '1px solid #e9ebed', overflow: 'auto' }}>
              <SideNavigation
                header={{ text: 'Navigation', href: '#' }}
                items={[
                  { type: 'link', text: 'Overview', href: '#' },
                  { type: 'link', text: 'Analytics', href: '#' },
                  { type: 'link', text: 'Deployments', href: '#' },
                ]}
                activeHref="#"
              />
            </div>
            <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
              <Container header={<Header>Overview</Header>}>Main content area.</Container>
            </div>
          </div>
        </div>
      </ScreenshotArea>

      <h2>Three-bar: primary + secondary + vertical rail</h2>
      <ScreenshotArea gutters={false}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <NavigationBar
            variant="primary"
            ariaLabel="Top navigation"
            content={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <Link href="#" fontSize="heading-m" color="inverted">
                  My App
                </Link>
                <div style={{ flex: 1 }}>
                  <Input
                    type="search"
                    ariaLabel="Search"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={({ detail }) => setSearchValue(detail.value)}
                  />
                </div>
                <ButtonGroup
                  variant="icon"
                  ariaLabel="Utilities"
                  items={[{ type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems }]}
                  onItemClick={() => {}}
                />
              </div>
            }
          />
          <NavigationBar
            variant="secondary"
            ariaLabel="Breadcrumb toolbar"
            content={
              <BreadcrumbGroup
                items={[
                  { text: 'Home', href: '#' },
                  { text: 'Projects', href: '#' },
                  { text: 'Alpha', href: '#' },
                ]}
              />
            }
          />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <NavigationBar
              variant="secondary"
              placement="inline-start"
              ariaLabel="Tool rail"
              content={<ButtonGroup variant="icon" ariaLabel="Tools" items={[...toolItems]} onItemClick={() => {}} />}
            />
            <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
              <Container header={<Header>Content</Header>}>
                Three-bar layout: primary top nav, secondary breadcrumb toolbar, vertical tool rail.
              </Container>
            </div>
          </div>
        </div>
      </ScreenshotArea>

      <h2>Dual vertical: two rails on the left</h2>
      <ScreenshotArea gutters={false}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <NavigationBar
            variant="primary"
            ariaLabel="Top navigation"
            content={
              <Link href="#" fontSize="heading-m" color="inverted">
                IDE Layout
              </Link>
            }
          />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Outer rail: section switching (narrower, icon-only) */}
            <NavigationBar
              variant="secondary"
              placement="inline-start"
              ariaLabel="Section switcher"
              content={<ButtonGroup variant="icon" ariaLabel="Sections" items={toolItems} onItemClick={() => {}} />}
            />
            {/* Inner rail: context tools for the active section */}
            <NavigationBar
              variant="secondary"
              placement="inline-start"
              ariaLabel="Context tools"
              content={
                <ButtonGroup
                  variant="icon"
                  ariaLabel="Context actions"
                  items={[
                    { type: 'icon-button', id: 'add', text: 'New file', iconName: 'add-plus' },
                    { type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' },
                    { type: 'icon-button', id: 'filter', text: 'Filter', iconName: 'filter' },
                  ]}
                  onItemClick={() => {}}
                />
              }
            />
            <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
              <Container header={<Header>Editor</Header>}>
                Two vertical rails on the left: outer for section switching, inner for context tools.
              </Container>
            </div>
          </div>
        </div>
      </ScreenshotArea>
    </article>
  );
}
