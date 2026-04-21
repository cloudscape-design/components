// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Demonstrates NavigationBar as a standalone toolbar replacement for the
 * AppLayout toolbar. This is the key use case for non-console consumers
 * who cannot use AppLayout but need a toolbar with drawer triggers,
 * breadcrumbs, and custom actions.
 */
import React from 'react';

import { Container, Header } from '~components';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

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
          content={
            <Link href="#" fontSize="heading-m" color="inverted">
              My Service
            </Link>
          }
        />
        <NavigationBar
          variant="secondary"
          ariaLabel="Page toolbar"
          content={
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
          content={
            <Link href="#" fontSize="heading-m" color="inverted">
              Analytics Dashboard
            </Link>
          }
        />
        <NavigationBar
          variant="secondary"
          ariaLabel="Dashboard toolbar"
          content={
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              <Button iconName="menu" variant="icon" ariaLabel="Open navigation" />
              <span style={{ fontWeight: 'bold' }}>Q1 2026 Report</span>
            </SpaceBetween>
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
