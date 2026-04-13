// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Demonstrates NavigationBar as a standalone toolbar replacement for the
 * AppLayout toolbar. This is the key use case for non-console consumers
 * who cannot use AppLayout but need a toolbar with drawer triggers,
 * breadcrumbs, and custom actions.
 */
import React from 'react';

import { ButtonDropdownProps, Container, Header } from '~components';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonGroup from '~components/button-group';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'preferences', text: 'Preferences' },
  { id: 'signout', text: 'Sign out' },
];

export default function NavigationBarToolbarReplacementPage() {
  return (
    <article>
      <h1>Navigation Bar — Toolbar Replacement Patterns</h1>

      <h2>AppLayout-style: primary header + secondary toolbar with breadcrumbs</h2>
      <p>
        Replicates the AppLayout toolbar pattern (side nav trigger + breadcrumbs + drawer triggers) without requiring
        AppLayout. The secondary bar serves as the toolbar.
      </p>
      <ScreenshotArea gutters={false}>
        <NavigationBar
          variant="primary"
          ariaLabel="Main navigation"
          startContent={
            <Link href="#" fontSize="heading-m" color="inverted">
              My Service
            </Link>
          }
          endContent={
            <ButtonGroup
              variant="icon"
              ariaLabel="Utilities"
              items={[
                { type: 'icon-button', id: 'help', text: 'Help', iconName: 'status-info' },
                { type: 'icon-button', id: 'notifications', text: 'Notifications', iconName: 'notification' },
                { type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems },
              ]}
              onItemClick={() => {}}
            />
          }
        />
        <NavigationBar
          variant="secondary"
          ariaLabel="Page toolbar"
          startContent={
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              <Button iconName="menu" variant="icon" ariaLabel="Open side navigation" />
              <BreadcrumbGroup
                items={[
                  { text: 'Home', href: '#' },
                  { text: 'Projects', href: '#' },
                  { text: 'Project Alpha', href: '#' },
                ]}
              />
            </SpaceBetween>
          }
          endContent={
            <ButtonGroup
              variant="icon"
              ariaLabel="Panel triggers"
              items={[
                { type: 'icon-button', id: 'info', text: 'Info panel', iconName: 'status-info' },
                { type: 'icon-button', id: 'settings', text: 'Settings panel', iconName: 'settings' },
              ]}
              onItemClick={() => {}}
            />
          }
        />
        <div style={{ padding: '20px' }}>
          <Container header={<Header>Project Alpha</Header>}>
            <p>
              This layout replicates what AppLayout provides (header + toolbar with breadcrumbs and drawer triggers) but
              without requiring AppLayout. Useful for non-console applications that need a similar structure with more
              flexibility.
            </p>
          </Container>
        </div>
      </ScreenshotArea>

      <h2>Toolbar with custom actions (no AppLayout equivalent)</h2>
      <p>
        A toolbar with a search bar, view toggles, and action buttons — content that the AppLayout toolbar cannot
        render.
      </p>
      <ScreenshotArea gutters={false}>
        <NavigationBar
          variant="primary"
          ariaLabel="Main navigation"
          startContent={
            <Link href="#" fontSize="heading-m" color="inverted">
              Analytics Dashboard
            </Link>
          }
          endContent={
            <ButtonGroup
              variant="icon"
              ariaLabel="Account"
              items={[{ type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems }]}
              onItemClick={() => {}}
            />
          }
        />
        <NavigationBar
          variant="secondary"
          ariaLabel="Dashboard toolbar"
          startContent={
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              <Button iconName="menu" variant="icon" ariaLabel="Open navigation" />
              <span style={{ fontWeight: 'bold' }}>Q1 2026 Report</span>
            </SpaceBetween>
          }
          endContent={
            <ButtonGroup
              variant="icon"
              ariaLabel="View controls"
              items={[
                { type: 'icon-button', id: 'refresh', text: 'Refresh data', iconName: 'refresh' },
                { type: 'icon-button', id: 'download', text: 'Export', iconName: 'download' },
                { type: 'icon-button', id: 'expand', text: 'Full screen', iconName: 'expand' },
              ]}
              onItemClick={() => {}}
            />
          }
        />
        <div style={{ padding: '20px' }}>
          <Container header={<Header>Dashboard Content</Header>}>
            <p>The toolbar above contains custom actions that the AppLayout toolbar cannot render.</p>
          </Container>
        </div>
      </ScreenshotArea>
    </article>
  );
}
