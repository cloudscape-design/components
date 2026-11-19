// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Table from '~components/table';

import { ariaLabels, createSimpleItems, simpleColumns } from './shared-configs';

const columnsWithMinWidth = simpleColumns.map(column => ({
  ...column,
  minWidth: 200,
}));

export default function () {
  const [selectedItems, setSelectedItems] = useState([{ number: 2, text: 'Two' }]);
  return (
    <>
      <h1>Keyboard Scroll</h1>
      <Box padding="l">
        <Table
          columnDefinitions={columnsWithMinWidth}
          items={createSimpleItems(4)}
          selectionType={'single'}
          selectedItems={selectedItems}
          trackBy={'text'}
          onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
          ariaLabels={ariaLabels}
          data-testid="items-table"
        />
      </Box>
    </>
  );
}
