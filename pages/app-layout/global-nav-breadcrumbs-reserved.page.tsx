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

const externalOwnedBreadcrumbsKey = Symbol.for('awsui-widget-api-external-owned-breadcrumbs');

function setBreadcrumbsOwnedExternally(value: boolean | undefined) {
  const flagHolder = window as unknown as Record<symbol, boolean | undefined>;
  if (value === undefined) {
    delete flagHolder[externalOwnedBreadcrumbsKey];
  } else {
    flagHolder[externalOwnedBreadcrumbsKey] = value;
  }
}

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
        <strong>Global Navigation (loaded late)</strong>
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

export default function GlobalNavBreadcrumbsReservedPage() {
  // Simulates a bootstrap script that runs before the AppLayout child renders.
  setBreadcrumbsOwnedExternally(true);

  const [navHeaderMounted, setNavHeaderMounted] = useState(false);
  const [items, setItems] = useState<BreadcrumbGroupProps['items']>([
    { text: 'Home', href: '#home' },
    { text: 'Service', href: '#service' },
    { text: 'Resource', href: '#resource' },
  ]);

  useEffect(() => () => setBreadcrumbsOwnedExternally(undefined), []);

  return (
    <>
      {navHeaderMounted && <GlobalNavigationHeader />}
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<BreadcrumbGroup items={items} ariaLabel="Breadcrumbs" />}
        content={
          <SpaceBetween size="m">
            <Header variant="h1">Reserved external breadcrumbs ownership</Header>
            <Container header={<Header variant="h2">Widget-only startup reservation</Header>}>
              <SpaceBetween size="s">
                <p>
                  This page sets{' '}
                  <code>window[Symbol.for(&apos;awsui-widget-api-external-owned-breadcrumbs&apos;)] = true</code> before
                  AppLayout renders. The simulated Global Navigation consumer starts unmounted.
                </p>
                <p>
                  While ownership is reserved, the widget state hides the AppLayout toolbar copy with{' '}
                  <code>display: none</code>. The DOM and funnel markers remain available to console analytics. Mount
                  the header to register the consumer and render the visible trail there. Unmounting it leaves the
                  toolbar copy hidden because the global reservation remains active.
                </p>
                <p>
                  This is intentionally widget-only. If the AppLayout widget itself is loaded asynchronously, its
                  pre-widget skeleton is controlled by the console bundle and can still render breadcrumbs until the
                  widget becomes active.
                </p>
                <SpaceBetween size="xs" direction="horizontal">
                  <Button data-testid="toggle-nav-header" onClick={() => setNavHeaderMounted(mounted => !mounted)}>
                    {navHeaderMounted ? 'Unmount' : 'Mount'} global nav header
                  </Button>
                  <Button
                    data-testid="append-breadcrumb"
                    onClick={() => setItems(current => [...current, { text: `Level ${current.length}`, href: '#' }])}
                  >
                    Append a breadcrumb
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            </Container>
          </SpaceBetween>
        }
      />
    </>
  );
}
