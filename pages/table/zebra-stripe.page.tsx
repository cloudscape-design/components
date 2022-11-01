// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Header from '~components/header';
import Toggle from '~components/toggle';
import Table from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const items = generateItems(20);

export default function () {
  const [checked, setChecked] = useState<boolean>(true);

  return (
    <ScreenshotArea style={{ padding: '10px 50px' }}>
      <div style={{ paddingBottom: '10px', display: 'inline-flex', gap: '10px' }}>
        <Toggle onChange={({ detail }) => setChecked(detail.checked)} checked={checked}>
          Zebra stripes
        </Toggle>
      </div>
      <Table
        header={<Header headingTagOverride="h1">Testing table</Header>}
        columnDefinitions={columnsConfig}
        items={items}
        hasZebraStripes={checked}
      />
    </ScreenshotArea>
  );
}
