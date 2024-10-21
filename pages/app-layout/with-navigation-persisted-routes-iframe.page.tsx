// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Link } from '~components';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

const SecondaryLayout: React.FC = ({ children }) => {
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

          {children}
        </SpaceBetween>
      }
      tools={<Tools>{toolsContent.long}</Tools>}
    />
  );
};

export default function () {
  const NAV_ITEMS: Array<SideNavigationProps.Link> = [
    { type: 'link', text: 'Page 1', href: 'page1' },
    { type: 'link', text: 'Page 2', href: 'page2' },
    { type: 'link', text: 'Page 3', href: 'page3' },
  ];
  const [activeHref, setActiveHref] = useState('page1');
  const openPagesHistory = useRef<Set<string>>(new Set());

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        navigation={
          <SideNavigation
            activeHref={activeHref}
            header={{ href: '#/', text: 'Service name' }}
            onFollow={event => {
              if (!event.detail.external) {
                event.preventDefault();
                setActiveHref(event.detail.href);
              }
            }}
            items={NAV_ITEMS}
          />
        }
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <div>
            {NAV_ITEMS.filter(item => item.href === activeHref || openPagesHistory.current.has(item.href)).map(item => {
              openPagesHistory.current.add(item.href);
              return (
                <div key={item.href} style={{ display: item.href !== activeHref ? 'none' : '' }}>
                  <IframeWrapper id="inner-iframe" AppComponent={SecondaryLayout} props={{ children: item.href }} />
                </div>
              );
            })}
          </div>
        }
      />
    </ScreenshotArea>
  );
}
