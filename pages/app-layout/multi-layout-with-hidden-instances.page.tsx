// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Link from '~components/link';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Tools } from './utils/content-blocks';
import labels from './utils/labels';

const SecondaryLayout: React.FC<{ name: string }> = ({ name }) => {
  return (
    <AppLayout
      {...{ __disableRuntimeDrawers: true }}
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

const NAV_ITEMS: Array<SideNavigationProps.Link> = [
  { type: 'link', text: 'Page 1', href: 'page1' },
  { type: 'link', text: 'Page 2', href: 'page2' },
  { type: 'link', text: 'Page 3', href: 'page3' },
];

export default function () {
  const [activeHref, setActiveHref] = useState('page1');
  const openPagesHistory = useRef<Set<string>>(new Set([activeHref]));

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
                openPagesHistory.current.add(event.detail.href);
                setActiveHref(event.detail.href);
              }
            }}
            items={NAV_ITEMS}
          />
        }
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <>
            {NAV_ITEMS.filter(item => item.href === activeHref || openPagesHistory.current.has(item.href)).map(item => (
              <div key={item.href} id={item.href} style={{ display: item.href !== activeHref ? 'none' : '' }}>
                <SecondaryLayout name={item.href} />
              </div>
            ))}
          </>
        }
      />
    </ScreenshotArea>
  );
}
