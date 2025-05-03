// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import { AppLayout, Button, Header, HelpPanel, Link, SideNavigation, SplitPanel, Table } from '~components';
import { AppLayoutProps } from '~components/app-layout';

import './utils/external-widget-demo';
import AppContext, { AppContextType } from '../app/app-context';
import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import { Breadcrumbs } from './utils/content-blocks';
import { drawerLabels } from './utils/drawers';
import appLayoutLabels from './utils/labels';

type DemoContext = React.Context<
  AppContextType<{
    hasTools: boolean | undefined;
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

export default function WithDrawers() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const hasTools = urlParams.hasTools ?? false;
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  const [activeHref, setActiveHref] = useState('#/');
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);

  const items = generateItems(20);

  function openHelp() {
    setToolsOpen(true);
  }

  return (
    <AppLayout
      ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
      breadcrumbs={<Breadcrumbs />}
      ref={appLayoutRef}
      navigation={
        <SideNavigation
          activeHref={activeHref}
          header={{ text: 'Navigation', href: '#/' }}
          onFollow={e => {
            e.preventDefault();
            setActiveHref(e.detail.href);
          }}
          items={[
            { type: 'link', text: 'Side nav menu A', href: '#/menu-a' },
            { type: 'link', text: 'Side nav menu B', href: '#/menu-b' },
            { type: 'link', text: 'Side nav menu C', href: '#/menu-c' },
          ]}
        />
      }
      navigationOpen={navigationOpen}
      onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
      content={
        <Table<Instance>
          header={
            <Header
              variant="awsui-h1-sticky"
              description="Demo page with footer"
              info={
                <Link variant="info" onFollow={() => openHelp()}>
                  Info
                </Link>
              }
              actions={<Button variant="primary">Create</Button>}
            >
              Sticky Scrollbar Example
            </Header>
          }
          stickyHeader={true}
          variant="full-page"
          columnDefinitions={columnsConfig}
          items={items}
        />
      }
      splitPanel={
        <SplitPanel
          header="Split panel header"
          i18nStrings={{
            preferencesTitle: 'Preferences',
            preferencesPositionLabel: 'Split panel position',
            preferencesPositionDescription: 'Choose the default split panel position for the service.',
            preferencesPositionSide: 'Side',
            preferencesPositionBottom: 'Bottom',
            preferencesConfirm: 'Confirm',
            preferencesCancel: 'Cancel',
            closeButtonAriaLabel: 'Close panel',
            openButtonAriaLabel: 'Open panel',
            resizeHandleAriaLabel: 'Slider',
          }}
        >
          This is the Split Panel!
        </SplitPanel>
      }
      splitPanelPreferences={{
        position: urlParams.splitPanelPosition,
      }}
      onSplitPanelPreferencesChange={event => {
        const { position } = event.detail;
        setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
      }}
      toolsOpen={toolsOpen}
      toolsHide={!hasTools}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      tools={
        <HelpPanel header={<h2>Help</h2>}>
          <p>This is a demo page showcasing the AppLayout component with a sticky header and scrollable content.</p>
          <h3>Features:</h3>
          <ul>
            <li>Responsive navigation sidebar</li>
            <li>Sticky header with actions</li>
            <li>Full-page table with sticky header</li>
            <li>Split panel support</li>
          </ul>
        </HelpPanel>
      }
    />
  );
}
