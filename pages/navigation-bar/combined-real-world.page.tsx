// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Container, Header } from '~components';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

const filler = Array.from({ length: 10 }, (_, i) => (
  <Container key={i} header={<Header variant="h2">Resource {i + 1}</Header>}>
    <p>Resource details and configuration for item {i + 1}.</p>
  </Container>
));

export default function NavigationBarCombinedPage() {
  const [navOpen, setNavOpen] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Primary navigation — sticky top */}
      <NavigationBar
        ariaLabel="Global navigation"
        content={
          <Link href="#" fontSize="heading-m" color="inverted">
            CloudOps Dashboard
          </Link>
        }
      />

      {/* Secondary toolbar */}
      <NavigationBar
        variant="secondary"
        ariaLabel="Page toolbar"
        content={
          <SpaceBetween size="xs" direction="horizontal" alignItems="center">
            <Button
              iconName="menu"
              variant="icon"
              ariaLabel={navOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setNavOpen(!navOpen)}
            />
            <BreadcrumbGroup
              items={[
                { text: 'Home', href: '#' },
                { text: 'Projects', href: '#' },
                { text: 'Infrastructure', href: '#' },
              ]}
            />
          </SpaceBetween>
        }
      />

      {/* Body: side nav + content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {navOpen && (
          <div style={{ width: 280, borderInlineEnd: '1px solid #e9ebed', overflow: 'auto' }}>
            <SideNavigation
              header={{ text: 'Infrastructure', href: '#' }}
              activeHref="#"
              items={[
                { type: 'link', text: 'Overview', href: '#' },
                { type: 'link', text: 'Instances', href: '#' },
                { type: 'link', text: 'Load Balancers', href: '#' },
                { type: 'link', text: 'Databases', href: '#' },
                {
                  type: 'section',
                  text: 'Monitoring',
                  items: [
                    { type: 'link', text: 'Alarms', href: '#' },
                    { type: 'link', text: 'Dashboards', href: '#' },
                    { type: 'link', text: 'Logs', href: '#' },
                  ],
                },
                {
                  type: 'section',
                  text: 'Settings',
                  items: [
                    { type: 'link', text: 'General', href: '#' },
                    { type: 'link', text: 'Permissions', href: '#' },
                    { type: 'link', text: 'Tags', href: '#' },
                  ],
                },
              ]}
            />
          </div>
        )}

        <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
          <SpaceBetween size="l">
            <Header variant="h1" actions={<Button variant="primary">Create resource</Button>}>
              Infrastructure Overview
            </Header>
            {filler}
          </SpaceBetween>
        </div>
      </div>
    </div>
  );
}
