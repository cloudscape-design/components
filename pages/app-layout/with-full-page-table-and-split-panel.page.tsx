// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import AppLayout, { AppLayoutProps } from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import Header from '~components/header';
import labels from './utils/labels';
import Table from '~components/table';
import { splitPaneli18nStrings } from './utils/strings';
import ScreenshotArea from '../utils/screenshot-area';
import Popover from '~components/popover';
import AppContext, { AppContextType } from '../app/app-context';
import Button from '~components/button';
import { Drawer } from '~components';

type DemoPageContext = React.Context<
  AppContextType<{
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

export default function () {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  const { urlParams, setUrlParams } = useContext(AppContext as DemoPageContext);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        contentType="table"
        navigationOpen={navigationOpen}
        toolsOpen={toolsOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        tools={
          <Drawer header="Help panel">
            <p>I need to be on top! Even on mobile!</p>
            <TestingPopover id="help-panel" />
          </Drawer>
        }
        splitPanelOpen={splitPanelOpen}
        splitPanelPreferences={{ position: urlParams.splitPanelPosition }}
        splitPanel={
          <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
            <p>I need to be on top! Even on mobile!</p>
            <TestingPopover id="split-panel" />
          </SplitPanel>
        }
        onSplitPanelPreferencesChange={event => setUrlParams({ splitPanelPosition: event.detail.position })}
        onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
        content={
          <Table
            variant="full-page"
            stickyHeader={true}
            header={
              <Header variant="awsui-h1-sticky" actions={<div style={{ blockSize: '50vh' }} />}>
                Sticky Full-Page Header
              </Header>
            }
            columnDefinitions={[]}
            items={[]}
          />
        }
      />
    </ScreenshotArea>
  );
}

function TestingPopover({ id }: { id: string }) {
  return (
    <Popover
      position="left"
      content={
        <>
          <p>This button should be clickable</p>
          <Button onClick={() => alert('It worked')}>Click me</Button>
        </>
      }
      dismissButton={true}
      dismissAriaLabel="Close popover"
      data-testid={id}
    >
      Testing popover
    </Popover>
  );
}
