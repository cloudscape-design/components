// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Table from '~components/table';
import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import { Breadcrumbs } from './utils/content-blocks';
import labels from './utils/labels';
import ContentLayout from '~components/content-layout';
import ScreenshotArea from '../utils/screenshot-area';

const items = generateItems(20);

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigationHide={true}
        toolsHide={true}
        content={
          <ContentLayout header={<Header variant="h1">Table with Sticky Header inside Content Layout</Header>}>
            <Table<Instance>
              header={<Header>Table with Sticky Header</Header>}
              stickyHeader={true}
              columnDefinitions={columnsConfig}
              items={items}
            />
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
