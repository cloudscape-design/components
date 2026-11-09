// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import TableRoot from '~components/table-root';

import appLayoutLabels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';
import { DataBody, DataHeader, makeItems } from './common';

export default function TableAppLayoutPage() {
  const items = makeItems(10);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={appLayoutLabels}
        contentType="table"
        navigationHide={true}
        toolsHide={true}
        content={
          <SpaceBetween size="s">
            <Header variant="h1" counter={`(${items.length})`}>
              Table atomics — in app layout
            </Header>
            <TableRoot ariaLabel="Resources">
              <DataHeader />
              <DataBody items={items} />
            </TableRoot>
          </SpaceBetween>
        }
      />
    </ScreenshotArea>
  );
}
