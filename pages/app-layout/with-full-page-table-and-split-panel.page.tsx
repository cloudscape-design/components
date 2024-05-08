// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import Header from '~components/header';
import labels from './utils/labels';
import Table from '~components/table';
import { splitPaneli18nStrings } from './utils/strings';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        contentType="table"
        navigationOpen={navigationOpen}
        toolsOpen={toolsOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        splitPanelOpen={true}
        splitPanel={
          <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
            I need to be on top! Even on mobile!
          </SplitPanel>
        }
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
