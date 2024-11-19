// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Button from '~components/button';
import Header from '~components/header';
import Table from '~components/table';

import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Navigation } from './utils/content-blocks';
import { Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

const items = generateItems(100);

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        navigation={<Navigation />}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <AppLayout
            data-testid="secondary-layout"
            ariaLabels={labels}
            breadcrumbs={<Breadcrumbs />}
            navigationHide={true}
            content={
              <Table<Instance>
                header={
                  <Header
                    variant="awsui-h1-sticky"
                    description="Demo page with footer"
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
            tools={<Tools>{toolsContent.long}</Tools>}
          />
        }
      />
    </ScreenshotArea>
  );
}
