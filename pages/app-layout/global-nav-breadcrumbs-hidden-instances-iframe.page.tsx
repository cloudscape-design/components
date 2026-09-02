// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import AppLayout from '~components/app-layout';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Header from '~components/header';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import { breadcrumbs as breadcrumbsPlugin, GlobalBreadcrumbs } from '~components/plugins';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from './utils/labels';

// Router simulation, following multi-layout-with-hidden-instances-iframe: navigating away does not
// unmount an App Layout, it hides it with `display: none`. So several producer instances stay mounted
// at once, each in its own iframe (its own React root and document), and only one is visible.
//
// What to watch: the global consumer must show the VISIBLE instance's trail only. A hidden instance
// stops publishing because AppLayoutVisibilityContext (driven by intersection) turns its breadcrumbs
// registration off, so page 2 -- which passes no breadcrumbs -- must leave the header empty rather
// than showing a stale trail from the hidden page 1. Unmount the header and App Layout resumes
// drawing the visible instance's trail itself.

const CONSUMER_ID = 'demo-global-nav-hidden-instances';

function GlobalNavigationHeader() {
  const [crumbs, setCrumbs] = useState<GlobalBreadcrumbs | null>(null);

  useEffect(() => breadcrumbsPlugin.registerConsumer({ id: CONSUMER_ID, onBreadcrumbsChange: setCrumbs }), []);

  // Sink mode: without this the consumer's own group would self-register and collapse to a skeleton.
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

function createView(name: string) {
  return function View() {
    return (
      <AppLayout
        {...{ __disableRuntimeDrawers: true }}
        data-testid={`secondary-layout-${name}`}
        ariaLabels={appLayoutLabels}
        // page2 deliberately passes no breadcrumbs, so the header must go empty when it is active.
        breadcrumbs={
          name !== 'page2' && (
            <BreadcrumbGroup
              onFollow={event => event.preventDefault()}
              items={[
                { text: 'Home', href: '#' },
                { text: name, href: `#${name}` },
              ]}
            />
          )
        }
        navigationHide={true}
        toolsHide={true}
        content={
          <SpaceBetween size="s">
            <Header variant="h1" description="Separate React root inside an iframe">
              {name}
            </Header>
            <div>
              {name === 'page2'
                ? 'This instance passes no breadcrumbs. The header above must be empty even though the other instances are still mounted (hidden).'
                : 'This instance owns the trail while it is visible. Navigate away and it stays mounted but stops publishing.'}
            </div>
          </SpaceBetween>
        }
      />
    );
  };
}

const ROUTES: Array<{ navLink: SideNavigationProps.Link; View: React.ComponentType }> = [
  { navLink: { type: 'link', text: 'Page 1', href: 'page1' }, View: createView('page1') },
  { navLink: { type: 'link', text: 'Page 2 (no breadcrumbs)', href: 'page2' }, View: createView('page2') },
  { navLink: { type: 'link', text: 'Page 3', href: 'page3' }, View: createView('page3') },
];

export default function GlobalNavBreadcrumbsHiddenInstancesPage() {
  const [activeHref, setActiveHref] = useState('page1');
  const [navHeaderMounted, setNavHeaderMounted] = useState(true);
  const openPagesHistory = useRef<Set<string>>(new Set([activeHref]));

  return (
    <ScreenshotArea gutters={false}>
      {/* Kept outside the header so the consumer can be unmounted and remounted. */}
      <div style={{ padding: '8px 16px' }}>
        <Button data-testid="toggle-nav-header" onClick={() => setNavHeaderMounted(mounted => !mounted)}>
          {navHeaderMounted ? 'Unmount' : 'Mount'} global nav header
        </Button>
      </div>
      {navHeaderMounted && <GlobalNavigationHeader />}
      <AppLayout
        {...{ __disableRuntimeDrawers: true }}
        data-testid="main-layout"
        ariaLabels={appLayoutLabels}
        navigation={
          <SideNavigation
            activeHref={activeHref}
            header={{ href: '#/', text: 'Service name' }}
            onFollow={event => {
              if (!event.detail.external) {
                event.preventDefault();
                openPagesHistory.current.add(event.detail.href);
                setActiveHref(event.detail.href);
              }
            }}
            items={ROUTES.map(route => route.navLink)}
          />
        }
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <>
            <ScreenreaderOnly>
              <h1>Global breadcrumbs with hidden app layout instances in iframes</h1>
            </ScreenreaderOnly>
            {ROUTES.filter(
              item => item.navLink.href === activeHref || openPagesHistory.current.has(item.navLink.href)
            ).map(item => (
              <div
                key={item.navLink.href}
                data-testid={`instance-${item.navLink.href}`}
                style={{ display: item.navLink.href !== activeHref ? 'none' : '' }}
              >
                <IframeWrapper id={item.navLink.href} AppComponent={item.View} />
              </div>
            ))}
          </>
        }
      />
    </ScreenshotArea>
  );
}
