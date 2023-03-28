// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import Header from '~components/header';
import labels from './utils/labels';
import Table from '~components/table';
import { splitPaneli18nStrings } from './utils/strings';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import { columnsConfig } from '../table/shared-configs';
import { generateItems } from '../table/generate-data';
import Box from '~components/box';
import Link from '~components/link';

export default function () {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [preferences, setPreferences] = React.useState<CollectionPreferencesProps.Preferences>({
    stickyColumns: { start: 1, end: 1 },
  });
  const items = generateItems(20);

  return (
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
          resizableColumns={true}
          variant="full-page"
          stickyHeader={true}
          footer={
            <Box textAlign="center">
              <Link href="#">View all</Link>
            </Box>
          }
          stickyColumns={preferences.stickyColumns}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              onConfirm={({ detail }) => setPreferences(detail)}
              preferences={preferences}
              stickyColumnsPreference={{
                startColumns: {
                  title: 'Stick first visible column(s)',
                  description: 'Keep the first column(s) visible while horizontally scrolling table content.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'First visible column', value: 1 },
                    { label: 'First two visible columns', value: 2 },
                  ],
                },
                endColumns: {
                  title: 'Stick last visible column',
                  description: 'Keep the last column visible when tables are wider than the viewport.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'Last visible column', value: 1 },
                  ],
                },
              }}
            />
          }
          header={
            <Header variant="awsui-h1-sticky" actions={<div style={{ height: '10vh' }} />}>
              Sticky Full-Page Header
            </Header>
          }
          columnDefinitions={columnsConfig}
          items={items}
        />
      }
    />
  );
}
