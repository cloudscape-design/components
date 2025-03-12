// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';
import range from 'lodash/range';

import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

import { Box } from '~components';
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
    <div>
      <SideNavigation
        header={{
          href: '#',
          text: 'Service name',
        }}
        items={range(30).map(i => ({ type: 'link', text: `Navigation #${i + 1}`, href: `#item-${i}` }))}
      />

      <div style={{ backgroundColor: '#fff', borderTop: '1px solid #ccc', position: 'sticky', padding: '20px', bottom: 0}}>
        hi do stuff
      </div>
    </div>
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

export function ScrollableDrawerContent({ contentType = 'text' }: { contentType?: 'text' | 'image' }) {
  return contentType === 'image' ? (
    <SpaceBetween size="l">
      <div className={styles.contentPlaceholder} />
      <div className={styles.contentPlaceholder} />
      <div className={styles.contentPlaceholder} />
    </SpaceBetween>
  ) : (
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
        Orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Varius quam quisque id diam vel.
        Risus viverra adipiscing at in. Orci sagittis eu volutpat odio facilisis mauris. Mauris vitae ultricies leo
        integer malesuada nunc. Sem et tortor consequat id porta nibh. Semper auctor neque vitae tempus quam
        pellentesque.
      </p>
      <p>Ante in nibh mauris cursus mattis molestie.</p>
      <p>
        Pharetra et ultrices neque ornare. Bibendum neque egestas congue quisque egestas diam in arcu cursus. Porttitor
        eget dolor morbi non arcu risus quis. Integer quis auctor elit sed vulputate mi sit. Mauris nunc congue nisi
        vitae suscipit tellus mauris a diam. Diam donec adipiscing tristique risus nec feugiat in. Arcu felis bibendum
        ut tristique et egestas quis. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. In hac habitasse
        platea dictumst quisque sagittis. Sollicitudin tempor id eu nisl nunc mi ipsum. Ornare aenean euismod elementum
        nisi quis. Elementum curabitur vitae nunc sed velit dignissim sodales. Amet tellus cras adipiscing enim eu. Id
        interdum velit laoreet id donec ultrices tincidunt. Ullamcorper eget nulla facilisi etiam. Sodales neque sodales
        ut etiam sit amet nisl purus. Auctor urna nunc id cursus metus aliquam eleifend mi in. Urna condimentum mattis
        pellentesque id. Porta lorem mollis aliquam ut porttitor leo a. Lectus quam id leo in vitae turpis massa sed.
        Pharetra pharetra massa massa ultricies mi.
      </p>
    </TextContent>
  );
}

export function ContentFill() {
  return (
    <div style={{ minBlockSize: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          insetBlockStart: '50%',
          insetInlineStart: '50%',
          transform: getIsRtl(document.body) ? 'translate(50%, -50%)' : 'translate(-50%, -50%)',
        }}
      >
        <Box fontSize="heading-m">
          In Visual Refresh, there should be a cross exactly in each corner of <br />
          the content area, without any scrollbars.
        </Box>
      </div>
      <CornerMarker insetBlockStart={0} insetInlineStart={0} />
      <CornerMarker insetBlockEnd={0} insetInlineStart={0} />
      <CornerMarker insetBlockStart={0} insetInlineEnd={0} />
      <CornerMarker insetBlockEnd={0} insetInlineEnd={0} />
    </div>
  );
}

function CornerMarker(props: {
  insetBlockStart?: number;
  insetInlineEnd?: number;
  insetInlineStart?: number;
  insetBlockEnd?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      style={{ inlineSize: '50px', blockSize: '50px', position: 'absolute', ...props }}
    >
      <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="10" x2="10" y2="0" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function CustomDrawerContent() {
  return (
    <div className={styles['custom-drawer-wrapper']}>
      <div className={styles['drawer-sticky-header']} data-testid="drawer-sticky-header">
        <Box variant="h3" tagOverride="h2" padding="n">
          <span id="custom-drawer-heading">Sticky header</span>
        </Box>
      </div>
      <div
        className={styles['drawer-scrollable-content']}
        role="region"
        aria-labelledby="custom-drawer-heading"
        tabIndex={0}
      >
        <ScrollableDrawerContent />
      </div>
      <div className={styles['drawer-sticky-footer']} data-testid="drawer-sticky-footer">
        <p>This is a sticky footer, it should always be visisble when the panel is open.</p>
      </div>
    </div>
  );
}

export function Counter({ id }: { id: string }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <span id={`${id}-text`}>Clicked: {count}</span>
      <button id={`${id}-button`} onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
