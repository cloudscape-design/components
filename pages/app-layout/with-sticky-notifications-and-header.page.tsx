// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Flashbar from '~components/flashbar';
import Table from '~components/table';
import Header from '~components/header';
import labels from './utils/labels';
import { Breadcrumbs } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        stickyNotifications={true}
        breadcrumbs={<Breadcrumbs />}
        notifications={
          <Flashbar
            items={[
              {
                type: 'success',
                header: 'Success message',
                statusIconAriaLabel: 'success',
              },
              {
                type: 'info',
                header: 'Info message',
                statusIconAriaLabel: 'info',
              },
            ]}
          />
        }
        content={
          <>
            <h1>Sticky Notifications + Table Header</h1>
            <Table
              header={<Header>Sticky Table Header 1</Header>}
              footer={<div style={{ blockSize: '100vh' }}></div>}
              items={[]}
              columnDefinitions={[]}
              stickyHeader={true}
            />
            <h1>2 - Sticky Notifications + Table Header</h1>
            <Table
              header={<Header>Sticky Table Header 2</Header>}
              footer={<div style={{ blockSize: '100vh' }}></div>}
              items={[]}
              columnDefinitions={[]}
              stickyHeader={true}
            />
          </>
        }
      />
    </ScreenshotArea>
  );
}
