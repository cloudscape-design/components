// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Header from '~components/header';
import Table from '~components/table';

import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';

import styles from './styles.scss';

const items = generateItems(20);

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        disableContentPaddings={true}
        notifications={
          <div className={styles.highlightBorder}>
            <Box variant="h2">Notifications</Box>
          </div>
        }
        stickyNotifications={true}
        content={
          <Table<Instance>
            header={<Header variant="awsui-h1-sticky">Full-page table</Header>}
            stickyHeader={true}
            variant="full-page"
            columnDefinitions={columnsConfig}
            items={items}
          />
        }
        navigation={<Box variant="h2">Navigation</Box>}
        tools={<Box variant="h2">Tools</Box>}
      />
    </ScreenshotArea>
  );
}
