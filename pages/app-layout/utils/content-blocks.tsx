// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';
import Container from '~components/container';
import Header from '~components/header';
import Button from '~components/button';
import SpaceBetween from '~components/space-between';
import BreadcrumbGroup from '~components/breadcrumb-group';
import SideNavigation from '~components/side-navigation';
import HelpPanel from '~components/help-panel';
import styles from '../styles.scss';
import Flashbar from '~components/flashbar';
import clsx from 'clsx';

export function Breadcrumbs() {
  return (
    <BreadcrumbGroup
      items={[
        { text: 'Home', href: '#' },
        { text: 'Service', href: '#' },
      ]}
    />
  );
}

export function Containers() {
  const [count, setCount] = useState(2);
  return (
    <SpaceBetween size="l">
      {range(count).map(i => (
        <Container
          key={i}
          header={
            <Header variant="h2" actions={<Button onClick={() => setCount(count - 1)}>Remove</Button>}>
              Demo container #{i + 1}
            </Header>
          }
        >
          <div className={styles.contentPlaceholder} />
        </Container>
      ))}
      <Button onClick={() => setCount(count + 1)}>Add container</Button>
    </SpaceBetween>
  );
}

export function Tools({ children }: { children: React.ReactNode }) {
  return <HelpPanel header={<h2>Overview</h2>}>{children}</HelpPanel>;
}

export function Navigation() {
  return (
    <SideNavigation
      header={{
        href: '#',
        text: 'Service name',
      }}
      items={range(30).map(i => ({ type: 'link', text: `Navigation #${i + 1}`, href: `#item-${i}` }))}
    />
  );
}

export function Notifications() {
  return (
    <Flashbar
      stackItems={true}
      items={[
        {
          type: 'success',
          dismissible: true,
          dismissLabel: 'Dismiss message',
          content: 'This is a success flash message',
          id: 'message_5',
        },
        {
          type: 'warning',
          dismissible: true,
          dismissLabel: 'Dismiss message',
          content: 'This is a warning flash message',
          id: 'message_4',
        },
        {
          type: 'error',
          dismissible: true,
          dismissLabel: 'Dismiss message',
          header: 'Failed to update instance id-4890f893e',
          content: 'This is a dismissible error message',
          id: 'message_3',
        },
        {
          type: 'info',
          dismissible: true,
          dismissLabel: 'Dismiss message',
          content: 'This is an info flash message',
          id: 'message_2',
        },
      ]}
    />
  );
}

export function Footer({ legacyConsoleNav }: { legacyConsoleNav: boolean }) {
  return (
    <>
      <footer id="f" className={clsx(styles.footer, legacyConsoleNav && styles.legacyNav)}>
        © 2008 - 2020, Amazon Web Services, Inc. or its affiliates. All rights reserved
      </footer>
    </>
  );
}
