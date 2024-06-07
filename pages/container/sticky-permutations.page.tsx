// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Alert from '~components/alert';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import { Breadcrumbs, Notifications } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import AppContext, { AppContextType } from '../app/app-context';

const items = generateItems(100);

type DemoContext = React.Context<
  AppContextType<{
    tableVariant?: TableProps['variant'];
    highContrast?: boolean;
    hasAlert?: boolean;
    hasNotifications?: boolean;
    hasBreadcrumbs?: boolean;
  }>
>;

const TableComponent = () => {
  const { urlParams } = useContext(AppContext as DemoContext);

  return (
    <Table<Instance>
      header={<Header variant="awsui-h1-sticky">Sticky Scrollbar Example</Header>}
      stickyHeader={true}
      variant={urlParams.tableVariant || 'full-page'}
      columnDefinitions={columnsConfig}
      items={items}
    />
  );
};

export default function () {
  const { urlParams } = useContext(AppContext as DemoContext);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={urlParams.hasBreadcrumbs && <Breadcrumbs />}
        navigationHide={true}
        toolsHide={true}
        contentType="table"
        headerVariant={urlParams.highContrast ? 'high-contrast' : undefined}
        notifications={urlParams.hasNotifications && <Notifications />}
        stickyNotifications={urlParams.hasNotifications}
        content={
          urlParams.hasAlert ? (
            <SpaceBetween size="l">
              <Alert>Alert</Alert>
              <TableComponent />
            </SpaceBetween>
          ) : (
            <TableComponent />
          )
        }
      />
    </ScreenshotArea>
  );
}
