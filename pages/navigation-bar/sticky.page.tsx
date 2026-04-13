// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Container, Header } from '~components';
import ButtonGroup from '~components/button-group';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

const filler = Array.from({ length: 20 }, (_, i) => (
  <Container key={i} header={<Header variant="h2">Section {i + 1}</Header>}>
    <p>Scroll down to see the navigation bar stick to the top of the viewport.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
  </Container>
));

export default function NavigationBarStickyPage() {
  return (
    <article>
      <h1>Navigation Bar — Sticky Positioning</h1>
      <p>
        The navigation bars below use <code>position: sticky</code> via wrapper styles. Scroll to test.
      </p>

      <h2>Single sticky primary bar</h2>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <NavigationBar
          ariaLabel="Sticky primary nav"
          startContent={
            <Link href="#" fontSize="heading-m" color="inverted">
              Sticky App
            </Link>
          }
          endContent={
            <ButtonGroup
              variant="icon"
              ariaLabel="Actions"
              items={[
                { type: 'icon-button', id: 'notifications', text: 'Notifications', iconName: 'notification' },
                { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
              ]}
              onItemClick={() => {}}
            />
          }
        />
      </div>

      <div style={{ padding: '20px' }}>
        <SpaceBetween size="l">{filler}</SpaceBetween>
      </div>
    </article>
  );
}
