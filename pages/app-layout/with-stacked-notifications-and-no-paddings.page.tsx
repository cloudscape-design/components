// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';
import Flashbar from '~components/flashbar';
import Table from '~components/table';
import Header from '~components/header';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        notifications={
          <Flashbar
            items={[
              {
                type: 'success',
                header: 'Success message',
                statusIconAriaLabel: 'success',
                dismissLabel: 'Dismiss notification',
                dismissible: true,
                onDismiss: () => void 0,
              },
              {
                type: 'warning',
                header: 'Warning message',
                statusIconAriaLabel: 'warning',
                dismissLabel: 'Dismiss notification',
                dismissible: true,
                onDismiss: () => void 0,
              },
            ]}
            stackItems={true}
          />
        }
        disableContentPaddings={true}
        content={
          <Table header={<Header>Sticky Table Header</Header>} items={[]} columnDefinitions={[]} stickyHeader={true} />
        }
      />
    </ScreenshotArea>
  );
}
