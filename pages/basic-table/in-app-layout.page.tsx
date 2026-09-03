// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Button from '~components/button';
import Header from '~components/header';

import { DATA_COLUMNS, makeItems } from './common';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Footer, Navigation, Notifications, Tools } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';

const items = makeItems(50);

// BasicTable in the primary console context (AppLayout content), mirroring Table's full-page
// variant. BasicTable uses the body-scroll model (no `height`/`maxHeight`): the AppLayout content
// area is the scroll runway, and the `stickyHeader` slot pins its title band + column-header row via
// the P4 sticky overlay. The overlay's top offset folds in AppLayout's chrome height through the
// `--awsui-sticky-vertical-top-offset` variable, so the pinned header seats directly below the app
// header / notifications rather than overlapping them.
export default function WithBasicTablePage() {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        contentType="table"
        tools={<Tools>{toolsContent.long}</Tools>}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
        content={
          <BasicTable
            columns={DATA_COLUMNS}
            totalRowCount={items.length}
            i18nStrings={{ tableLabel: 'Resources' }}
            stickyHeader={
              <Header counter={`(${items.length})`} actions={<Button variant="primary">Create resource</Button>}>
                Resources
              </Header>
            }
          >
            <BasicTableHeader>
              <BasicTableHeaderCell>Name</BasicTableHeaderCell>
              <BasicTableHeaderCell>Type</BasicTableHeaderCell>
              <BasicTableHeaderCell>Size</BasicTableHeaderCell>
              <BasicTableHeaderCell>Status</BasicTableHeaderCell>
            </BasicTableHeader>
            <BasicTableBody>
              {items.map((item, index) => (
                <BasicTableRow key={item.id} index={index} id={item.id}>
                  <BasicTableCell>{item.name}</BasicTableCell>
                  <BasicTableCell>{item.type}</BasicTableCell>
                  <BasicTableCell>{item.size}</BasicTableCell>
                  <BasicTableCell>{item.status}</BasicTableCell>
                </BasicTableRow>
              ))}
            </BasicTableBody>
          </BasicTable>
        }
      />
      <Footer legacyConsoleNav={false} />
    </ScreenshotArea>
  );
}
