// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Header from '~components/header';
import Table from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { generateItems, Instance } from './generate-data';
import { columnsConfig, selectionLabels } from './shared-configs';

const items = generateItems(20);

export default function () {
  const [selectedItems, setSelectedItems] = useState<Instance[]>([]);

  return (
    <>
      <button id="focus-target">Focus target</button>
      <ScreenshotArea style={{ padding: '10px 50px' }}>
        <Table
          header={<Header headingTagOverride="h1">Testing table</Header>}
          columnDefinitions={columnsConfig}
          ariaLabels={selectionLabels}
          items={items}
          resizableColumns={true}
          stickyHeader={true}
          selectedItems={selectedItems}
          selectionType="multi"
          onSelectionChange={e => setSelectedItems(e.detail.selectedItems)}
        />
        <div style={{ blockSize: '90vh', padding: 10 }}>Placeholder to allow page scroll beyond table</div>
      </ScreenshotArea>
    </>
  );
}
