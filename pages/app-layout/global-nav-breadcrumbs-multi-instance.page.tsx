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

import { IframeWrapper } from '../utils/iframe-wrapper';
import labels from './utils/labels';

// Closest simulation of the real console topology: the Global Navigation header and each App Layout
// live in SEPARATE React roots (separate `mount()` calls, separate documents). They still share one
// BreadcrumbsController because `loadApi()` walks `window.parent` (findUpApi) and reuses the
// top-most `Symbol.for('awsui-plugin-api')` instance, so the channel crosses the iframe boundary.

function GlobalNavigationHeader() {
  const [crumbs, setCrumbs] = useState<BreadcrumbGroupProps | null>(null);

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
        <strong>Global Navigation (React root #1)</strong>
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

// Producer app mounted into an iframe by IframeWrapper -- its own React root, its own document.
function makeProducerApp(name: string, testId: string) {
  return function ProducerApp() {
    const [depth, setDepth] = useState(2);
    const items = [
      { text: 'Home', href: '#home' },
      { text: name, href: '#service' },
      ...Array.from({ length: depth - 2 }, (_unused, index) => ({
        text: `${name} level ${index + 2}`,
        href: '#',
      })),
    ];

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
            <Header variant="h2" description="Separate React root inside an iframe">
              {name}
            </Header>
            <Button data-testid={`append-${testId}`} onClick={() => setDepth(current => current + 1)}>
              Append to {name}
            </Button>
          </SpaceBetween>
        }
      />
    );
  };
}

const AlphaApp = makeProducerApp('Alpha service', 'iframe-layout-alpha');
const BetaApp = makeProducerApp('Beta service', 'iframe-layout-beta');

// Visible boundary so it is obvious where one React instance ends and the next begins.
function IframeInstance({ id, label, AppComponent }: { id: string; label: string; AppComponent: React.ComponentType }) {
  return (
    <div style={{ border: '2px dashed #7d8998', borderRadius: 8, padding: 8 }}>
      <div style={{ marginBlockEnd: 8, fontSize: 12, fontWeight: 700, color: '#5f6b7a' }}>
        {label} &mdash; <code>&lt;iframe id=&quot;{id}&quot;&gt;</code>
      </div>
      <div style={{ blockSize: 260 }}>
        <IframeWrapper id={id} AppComponent={AppComponent} />
      </div>
    </div>
  );
}

export default function GlobalNavBreadcrumbsMultiInstancePage() {
  const [navHeaderMounted, setNavHeaderMounted] = useState(true);
  const [alphaMounted, setAlphaMounted] = useState(true);
  const [betaMounted, setBetaMounted] = useState(false);

  return (
    <>
      {navHeaderMounted && <GlobalNavigationHeader />}
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        toolsHide={true}
        content={
          <SpaceBetween size="m">
            <Container header={<Header variant="h1">Multiple React instances, one global consumer</Header>}>
              <SpaceBetween size="s">
                <p>
                  Open with <code>?visualRefresh=true&amp;appLayoutToolbar=true</code>. Each producer App Layout is
                  mounted into its own iframe with its own <code>mount()</code> React root &mdash; independent React
                  instances, independent documents, exactly like the console&apos;s Global Navigation and App Layout
                  bundles.
                </p>
                <p>
                  They still share one controller: <code>loadApi()</code> walks <code>window.parent</code> and reuses
                  the top-most <code>Symbol.for(&apos;awsui-plugin-api&apos;)</code> instance, so a breadcrumb
                  registered inside an iframe reaches the header in the parent root. The last producer to mount wins;
                  unmount it and the header falls back to the other.
                </p>
                <SpaceBetween size="xs" direction="horizontal">
                  <Button data-testid="toggle-nav-header" onClick={() => setNavHeaderMounted(mounted => !mounted)}>
                    {navHeaderMounted ? 'Unmount' : 'Mount'} global nav header
                  </Button>
                  <Button data-testid="toggle-iframe-alpha" onClick={() => setAlphaMounted(mounted => !mounted)}>
                    {alphaMounted ? 'Unmount' : 'Mount'} Alpha iframe
                  </Button>
                  <Button data-testid="toggle-iframe-beta" onClick={() => setBetaMounted(mounted => !mounted)}>
                    {betaMounted ? 'Unmount' : 'Mount'} Beta iframe
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            </Container>

            {alphaMounted && <IframeInstance id="iframe-alpha" label="React root #2" AppComponent={AlphaApp} />}
            {betaMounted && <IframeInstance id="iframe-beta" label="React root #3" AppComponent={BetaApp} />}
          </SpaceBetween>
        }
      />
    </>
  );
}
