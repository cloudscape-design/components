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
import labels from './utils/labels';

const items = generateItems(100);

function App() {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <AppLayout
            ariaLabels={labels}
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
          />
        }
      />
    </ScreenshotArea>
  );
}

export default App;
