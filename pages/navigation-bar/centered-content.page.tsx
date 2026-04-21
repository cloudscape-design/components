// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { ButtonDropdownProps, Container, Header, SpaceBetween } from '~components';
import ButtonGroup from '~components/button-group';
import Input from '~components/input';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'signout', text: 'Sign out' },
];

// Consumer-controlled centered content wrapper — bar spans full width,
// content is constrained and centered inside it.
function CenteredContent({ children, maxWidth = 1200 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <div style={{ maxWidth, marginInline: 'auto', width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
      {children}
    </div>
  );
}

export default function NavigationBarCenteredContentPage() {
  const [search, setSearch] = useState('');

  return (
    <article>
      <h1>Navigation Bar — Centered Content (consumer-controlled)</h1>
      <p>
        The bar spans full width. The consumer constrains and centers content inside the <code>content</code> prop. No{' '}
        <code>maxWidth</code> prop on the component.
      </p>

      {/* Full-width bar, content centered at 1200px */}
      <NavigationBar
        variant="primary"
        ariaLabel="Primary navigation"
        content={
          <CenteredContent maxWidth={1200}>
            <Link href="#" fontSize="heading-m" color="inverted">
              My Application
            </Link>
            <div style={{ flex: 1 }}>
              <Input
                type="search"
                ariaLabel="Search"
                placeholder="Search..."
                value={search}
                onChange={({ detail }) => setSearch(detail.value)}
              />
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
          </CenteredContent>
        }
      />

      {/* Secondary bar, content centered at 1200px */}
      <NavigationBar
        variant="secondary"
        ariaLabel="Toolbar"
        content={
          <CenteredContent maxWidth={1200}>
            <span style={{ flex: 1, fontSize: 14 }}>Dashboard / Overview</span>
            <ButtonGroup
              variant="icon"
              ariaLabel="Actions"
              items={[{ type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' }]}
              onItemClick={() => {}}
            />
          </CenteredContent>
        }
      />

      {/* Page content also centered at 1200px for alignment */}
      <div style={{ maxWidth: 1200, marginInline: 'auto', padding: 20 }}>
        <SpaceBetween size="m">
          <Container header={<Header variant="h2">Content area</Header>}>
            <p>
              Bar background spans full width. Content is centered at 1200px — controlled by the consumer inside the{' '}
              <code>content</code> prop.
            </p>
            <p>
              This approach gives full control: different max-widths per bar, asymmetric layouts, or no centering at
              all.
            </p>
          </Container>
          <Container header={<Header variant="h2">Narrower content example (800px)</Header>}>
            <NavigationBar
              variant="secondary"
              ariaLabel="Narrow toolbar"
              content={
                <CenteredContent maxWidth={800}>
                  <span style={{ flex: 1, fontSize: 14 }}>Constrained to 800px</span>
                  <ButtonGroup
                    variant="icon"
                    ariaLabel="Actions"
                    items={[{ type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' }]}
                    onItemClick={() => {}}
                  />
                </CenteredContent>
              }
            />
          </Container>
        </SpaceBetween>
      </div>
    </article>
  );
}
