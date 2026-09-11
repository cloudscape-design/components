// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import AppLayout from '~components/app-layout';
import BreadcrumbGroup, { BreadcrumbGroupProps } from '~components/breadcrumb-group';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import { registerBreadcrumbsConsumer } from '~components/internal/plugins/widget';
import SpaceBetween from '~components/space-between';

import labels from './utils/labels';

// Same simulated console Global Navigation header as global-nav-breadcrumbs.page.tsx: it consumes
// the `registerBreadcrumbsConsumer` widget API and renders in sink mode (__disableGlobalization)
// so its own render never re-registers. Here it is the single consumer for SEVERAL App Layouts.

function GlobalNavigationHeader() {
  const [crumbs, setCrumbs] = useState<BreadcrumbGroupProps | null>(null);

  useEffect(() => registerBreadcrumbsConsumer({ onBreadcrumbsChange: setCrumbs }).unregister, []);

  const sinkProps = { ...crumbs, __disableGlobalization: true } as unknown as React.ComponentProps<
    typeof BreadcrumbGroup
  >;

  return (
    <div
      data-testid="global-nav-header"
      style={{
        position: 'sticky',
        insetBlockStart: 0,
        zIndex: 1001,
        padding: '8px 16px',
        background: '#0f1b2d',
        color: '#ffffff',
      }}
    >
      <SpaceBetween size="m" direction="horizontal" alignItems="center">
        <strong>Global Navigation (simulated header)</strong>
        {crumbs ? (
          <div style={{ flex: 1, minWidth: 0 }}>
            <BreadcrumbGroup {...sinkProps} />
          </div>
        ) : (
          <span data-testid="global-nav-header-empty">No breadcrumbs published</span>
        )}
      </SpaceBetween>
    </div>
  );
}

// A secondary App Layout standing in for one console page's layout. It passes its own trail to the
// `breadcrumbs` slot, so the slotted BreadcrumbGroup self-registers on the shared channel.
function SecondaryLayout({
  name,
  testId,
  mounted,
  onToggle,
}: {
  name: string;
  testId: string;
  mounted: boolean;
  onToggle: () => void;
}) {
  const [depth, setDepth] = useState(2);
  const items = [
    { text: 'Home', href: '#home' },
    { text: name, href: '#service' },
    ...Array.from({ length: depth - 2 }, (_unused, index) => ({
      text: `${name} level ${index + 2}`,
      href: '#',
    })),
  ];

  if (!mounted) {
    return (
      <Container header={<Header variant="h2">{name} (unmounted)</Header>}>
        <Button data-testid={`toggle-${testId}`} onClick={onToggle}>
          Mount {name}
        </Button>
      </Container>
    );
  }

  return (
    <AppLayout
      {...{ __disableRuntimeDrawers: true }}
      data-testid={testId}
      ariaLabels={labels}
      breadcrumbs={<BreadcrumbGroup items={items} ariaLabel={`${name} breadcrumbs`} />}
      navigationHide={true}
      toolsHide={true}
      content={
        <SpaceBetween size="s">
          <Header variant="h2">{name}</Header>
          <SpaceBetween size="xs" direction="horizontal">
            <Button data-testid={`append-${testId}`} onClick={() => setDepth(current => current + 1)}>
              Append to {name}
            </Button>
            <Button data-testid={`toggle-${testId}`} onClick={onToggle}>
              Unmount {name}
            </Button>
          </SpaceBetween>
        </SpaceBetween>
      }
    />
  );
}

export default function GlobalNavBreadcrumbsMultiLayoutPage() {
  const [navHeaderMounted, setNavHeaderMounted] = useState(true);
  const [alphaMounted, setAlphaMounted] = useState(true);
  const [betaMounted, setBetaMounted] = useState(true);

  return (
    <>
      {navHeaderMounted && <GlobalNavigationHeader />}
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <SpaceBetween size="m">
            <Container header={<Header variant="h1">Multiple App Layouts, one global consumer</Header>}>
              <SpaceBetween size="s">
                <p>
                  Open with <code>?visualRefresh=true&amp;appLayoutToolbar=true</code>. An outer App Layout hosts two
                  secondary App Layouts, each passing its own <code>&lt;BreadcrumbGroup&gt;</code> to its{' '}
                  <code>breadcrumbs</code> slot. All of them register on the same shared channel, and the single
                  simulated Global Navigation header receives the most recently registered trail.
                </p>
                <p>
                  Unmount the newest producer to test fallback to the previous layout. Unmount the header and App
                  Layout&apos;s existing coordination renders one trail in its toolbar.
                </p>
                <Button data-testid="toggle-nav-header" onClick={() => setNavHeaderMounted(mounted => !mounted)}>
                  {navHeaderMounted ? 'Unmount' : 'Mount'} global nav header
                </Button>
              </SpaceBetween>
            </Container>

            <SecondaryLayout
              name="Alpha service"
              testId="secondary-layout-alpha"
              mounted={alphaMounted}
              onToggle={() => setAlphaMounted(mounted => !mounted)}
            />
            <SecondaryLayout
              name="Beta service"
              testId="secondary-layout-beta"
              mounted={betaMounted}
              onToggle={() => setBetaMounted(mounted => !mounted)}
            />
          </SpaceBetween>
        }
      />
    </>
  );
}
