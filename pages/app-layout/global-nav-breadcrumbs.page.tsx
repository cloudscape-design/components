// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import AppLayout from '~components/app-layout';
import BreadcrumbGroup, { BreadcrumbGroupProps } from '~components/breadcrumb-group';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import { breadcrumbs as breadcrumbsPlugin } from '~components/plugins';
import SpaceBetween from '~components/space-between';

import labels from './utils/labels';

// Simulates the console Global Navigation module hosting App Layout breadcrumbs in its own
// header. It consumes the public `breadcrumbs.registerConsumer` widget API and renders its own
// BreadcrumbGroup in sink mode (__disableGlobalization) so this render never re-registers.

function GlobalNavigationHeader() {
  const [crumbs, setCrumbs] = useState<BreadcrumbGroupProps | null>(null);

  // Fires immediately with the current value, then on every change. `registered` is false if another
  // consumer already owns rendering.
  useEffect(() => breadcrumbsPlugin.registerConsumer({ onBreadcrumbsChange: setCrumbs }).unregister, []);

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
          // flex:1 + min-width:0 gives BreadcrumbGroup the full remaining width to measure,
          // so it renders the whole trail instead of collapsing to a dropdown.
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

export default function GlobalNavBreadcrumbsPage() {
  const [navHeaderMounted, setNavHeaderMounted] = useState(true);
  const [items, setItems] = useState<BreadcrumbGroupProps['items']>([
    { text: 'Home', href: '#home' },
    { text: 'Service', href: '#service' },
    { text: 'Resource', href: '#resource' },
  ]);

  return (
    <>
      {navHeaderMounted && <GlobalNavigationHeader />}
      <AppLayout
        ariaLabels={labels}
        // Producer: a console page passes its breadcrumbs to App Layout's slot (standard usage).
        breadcrumbs={<BreadcrumbGroup items={items} ariaLabel="Breadcrumbs" />}
        content={
          <SpaceBetween size="m">
            <Header variant="h1">Global nav breadcrumbs demo</Header>

            <Container header={<Header variant="h2">How to view</Header>}>
              <SpaceBetween size="s">
                <p>
                  Open this page with <code>?visualRefresh=true&amp;appLayoutToolbar=true</code> so global breadcrumbs
                  are active. The page passes its <code>&lt;BreadcrumbGroup&gt;</code> to App Layout&apos;s
                  <code>breadcrumbs</code> slot.
                </p>
                <p>
                  While the simulated Global Navigation header is mounted it registers as an external consumer, so App
                  Layout <strong>auto-yields</strong> (stops rendering breadcrumbs in its toolbar) and the header
                  renders them instead. Unmount the header and App Layout resumes.
                </p>
                <p>
                  &ldquo;Load global nav late&rdquo; reproduces the real console ordering, where App Layout is up before
                  Global Navigation loads: App Layout draws the trail in its toolbar and then gives it up, which
                  flashes. Add <code>&amp;breadcrumbsOwnedExternally=true</code> to declare external ownership before
                  either bundle renders, and the toolbar stays empty for the whole gap instead.
                </p>
                <SpaceBetween size="xs" direction="horizontal">
                  <Button data-testid="toggle-nav-header" onClick={() => setNavHeaderMounted(mounted => !mounted)}>
                    {navHeaderMounted ? 'Unmount' : 'Mount'} global nav header
                  </Button>
                  <Button
                    data-testid="delay-nav-header"
                    onClick={() => {
                      setNavHeaderMounted(false);
                      setTimeout(() => setNavHeaderMounted(true), 1500);
                    }}
                  >
                    Load global nav late
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
