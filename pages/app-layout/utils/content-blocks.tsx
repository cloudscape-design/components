// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';
import range from 'lodash/range';

import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Container from '~components/container';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Header from '~components/header';
import HelpPanel from '~components/help-panel';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import TextContent from '~components/text-content';

import styles from '../styles.scss';

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
          data-testid={`container-${i + 1}`}
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
  const [visible, setVisible] = useState(true);
  const demoNotification: FlashbarProps.MessageDefinition = {
    type: 'success',
    header: 'Success message',
    statusIconAriaLabel: 'success',
    dismissLabel: 'Dismiss notification',
    dismissible: true,
    onDismiss: () => setVisible(false),
  };
  return <Flashbar items={visible ? [demoNotification] : []} />;
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

export function ScrollableDrawerContent() {
  return (
    <div className={styles['drawer-scrollable-content']}>
      <TextContent>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in hac. Nec
          sagittis aliquam malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id venenatis.
          Penatibus et magnis dis parturient montes nascetur ridiculus mus mauris. Nisi porta lorem mollis aliquam ut
          porttitor leo a. Facilisi morbi tempus iaculis urna. Odio tempor orci dapibus ultrices in iaculis nunc.
        </p>
        <div data-testid="scroll-me">The end</div>
        <p>
          Ut diam quam nulla porttitor massa id neque. Duis at tellus at urna condimentum mattis pellentesque id nibh.
          Metus vulputate eu scelerisque felis imperdiet proin fermentum.
        </p>
        <h3>Another h3</h3>
        <p>
          Orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Varius quam quisque id diam
          vel. Risus viverra adipiscing at in. Orci sagittis eu volutpat odio facilisis mauris. Mauris vitae ultricies
          leo integer malesuada nunc. Sem et tortor consequat id porta nibh. Semper auctor neque vitae tempus quam
          pellentesque.
        </p>
        <p>Ante in nibh mauris cursus mattis molestie.</p>
        <p>
          Pharetra et ultrices neque ornare. Bibendum neque egestas congue quisque egestas diam in arcu cursus.
          Porttitor eget dolor morbi non arcu risus quis. Integer quis auctor elit sed vulputate mi sit. Mauris nunc
          congue nisi vitae suscipit tellus mauris a diam. Diam donec adipiscing tristique risus nec feugiat in. Arcu
          felis bibendum ut tristique et egestas quis. Nulla porttitor massa id neque aliquam vestibulum morbi blandit.
          In hac habitasse platea dictumst quisque sagittis. Sollicitudin tempor id eu nisl nunc mi ipsum. Ornare aenean
          euismod elementum nisi quis. Elementum curabitur vitae nunc sed velit dignissim sodales. Amet tellus cras
          adipiscing enim eu. Id interdum velit laoreet id donec ultrices tincidunt. Ullamcorper eget nulla facilisi
          etiam. Sodales neque sodales ut etiam sit amet nisl purus. Auctor urna nunc id cursus metus aliquam eleifend
          mi in. Urna condimentum mattis pellentesque id. Porta lorem mollis aliquam ut porttitor leo a. Lectus quam id
          leo in vitae turpis massa sed. Pharetra pharetra massa massa ultricies mi.
        </p>
      </TextContent>
    </div>
  );
}

export function CustomDrawerContent() {
  return (
    <div className={styles['custom-drawer-wrapper']}>
      <div className={styles['drawer-sticky-header']} data-testid="drawer-sticky-header">
        <h2>Header</h2>
      </div>
      <ScrollableDrawerContent />
      <div className={styles['drawer-sticky-footer']} data-testid="drawer-sticky-footer">
        <p>This is a sticky footer, it should always be visisble when the panel is open.</p>
      </div>
    </div>
  );
}
