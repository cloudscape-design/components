// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Button from '~components/button';
import Header from '~components/header';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Footer, Navigation, Notifications } from './utils/content-blocks';
import labels from './utils/labels';

interface Item {
  id: string;
  name: string;
  owner: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  {
    id: 'id',
    header: 'Resource identifier used to locate the item in the inventory',
    cell: item => item.id,
  },
  {
    id: 'name',
    header: 'Resource name shown to customers in the management console',
    cell: item => item.name,
  },
  {
    id: 'owner',
    header: 'Owning team responsible for operating this resource',
    cell: item => item.owner,
  },
];

interface AutoSkeletonTableProps {
  wrapLines: boolean;
}

export default function AutoSkeletonTable({ wrapLines }: AutoSkeletonTableProps) {
  const scenarioId = `auto-skeleton-app-layout-${wrapLines ? 'wrap' : 'nowrap'}`;

  return (
    <ScreenshotArea gutters={false}>
      <div id={scenarioId}>
        <AppLayout
          ariaLabels={labels}
          breadcrumbs={<Breadcrumbs />}
          contentType="table"
          footerSelector="#f"
          headerSelector="#h"
          navigation={<Navigation />}
          notifications={<Notifications />}
          content={
            <Table<Item>
              columnDefinitions={columnDefinitions}
              footer={<div id={`${scenarioId}-table-footer`}>Table footer</div>}
              header={
                <Header
                  actions={<Button variant="primary">Create resource</Button>}
                  description="Automatic skeleton rows fill the AppLayout content viewport."
                  variant="awsui-h1-sticky"
                >
                  Resources
                </Header>
              }
              items={[]}
              loading={true}
              loadingText="Loading resources"
              skeleton={{ totalRows: 'auto' }}
              stickyHeader={true}
              variant="full-page"
              wrapLines={wrapLines}
            />
          }
        />
        <Footer legacyConsoleNav={false} />
      </div>
    </ScreenshotArea>
  );
}
