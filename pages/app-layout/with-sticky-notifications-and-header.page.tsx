// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Header from '~components/header';
import Table from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs } from './utils/content-blocks';
import labels from './utils/labels';

export default function () {
  const [flashItems, setFlashItems] = useState<FlashbarProps['items']>([
    {
      id: 'item-1',
      type: 'success',
      header: 'Success message',
      statusIconAriaLabel: 'success',
      dismissible: true,
      dismissLabel: 'Dismiss item-1',
      onDismiss: () => dismissFlashItem('item-1'),
    },
    {
      id: 'item-2',
      type: 'info',
      header: 'Info message',
      statusIconAriaLabel: 'info',
      dismissible: true,
      dismissLabel: 'Dismiss item-2',
      onDismiss: () => dismissFlashItem('item-2'),
    },
  ]);

  const dismissFlashItem = (itemId: string) => {
    setFlashItems(items => items.filter(item => item.id !== itemId));
  };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        stickyNotifications={true}
        breadcrumbs={<Breadcrumbs />}
        notifications={<Flashbar items={flashItems} />}
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
