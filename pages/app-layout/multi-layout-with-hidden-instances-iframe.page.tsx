// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import Link from '~components/link';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

import './utils/external-widget';
import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Tools } from './utils/content-blocks';
import labels from './utils/labels';

function createView(name: string) {
  return function View() {
    return (
      <AppLayout
        data-testid="secondary-layout"
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigationHide={true}
        content={
          <SpaceBetween size="s">
            <Header variant="h1" description="This page contains nested app layout instances">
              Multiple app layouts
            </Header>

            <Link external={true} href="#">
              External link
            </Link>

            <div>Page content: {name}</div>
          </SpaceBetween>
        }
        tools={<Tools>Tools content: {name}</Tools>}
      />
    );
  };
}

const ROUTES: Array<{ navLink: SideNavigationProps.Link; View: React.ComponentType }> = [
  { navLink: { type: 'link', text: 'Page 1', href: 'page1' }, View: createView('page1') },
  { navLink: { type: 'link', text: 'Page 2', href: 'page2' }, View: createView('page2') },
  { navLink: { type: 'link', text: 'Page 3', href: 'page3' }, View: createView('page3') },
];

export default function () {
  const [activeHref, setActiveHref] = useState('page1');
  const openPagesHistory = useRef<Set<string>>(new Set([activeHref]));

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        {...{ __disableRuntimeDrawers: true }}
        data-testid="main-layout"
        ariaLabels={labels}
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
              <h1>Multiple app layouts with iframe</h1>
            </ScreenreaderOnly>
            {ROUTES.filter(
              item => item.navLink.href === activeHref || openPagesHistory.current.has(item.navLink.href)
            ).map(item => (
              <div key={item.navLink.href} style={{ display: item.navLink.href !== activeHref ? 'none' : '' }}>
                <IframeWrapper id={item.navLink.href} AppComponent={item.View} />
              </div>
            ))}
          </>
        }
      />
    </ScreenshotArea>
  );
}
