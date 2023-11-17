// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { columnsConfig } from '../table/shared-configs';
import { generateItems } from '../table/generate-data';
import { splitPaneli18nStrings } from './utils/strings';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import Header from '~components/header';
import labels from './utils/labels';
import SplitPanel from '~components/split-panel';
import Table from '~components/table';

export default function () {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [splitPanelEnabled, setSplitPanelEnabled] = useState(false);
  const items = generateItems(20);

  return (
    <AppLayout
      {...{ __embeddedViewMode: true }}
      ariaLabels={labels}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '#' },
            { text: 'Service', href: '#' },
          ]}
        />
      }
      contentType="table"
      navigationOpen={navigationOpen}
      onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
      onSplitPanelToggle={() => setSplitPanelEnabled(!splitPanelEnabled)}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      splitPanel={
        <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
          I need to be on top! Even on mobile!
        </SplitPanel>
      }
      splitPanelOpen={splitPanelEnabled}
      toolsOpen={toolsOpen}
      content={
        <Table
          resizableColumns={true}
          variant="full-page"
          stickyHeader={true}
          footer={
            <Box textAlign="center">
              <Button onClick={() => setToolsOpen(!toolsOpen)}>Click me to open the tools panel</Button>
            </Box>
          }
          stickyColumns={{ first: 1, last: 1 }}
          header={<Header variant="awsui-h1-sticky">Embedded view mode</Header>}
          columnDefinitions={columnsConfig}
          items={items}
        />
      }
    />
  );
}
