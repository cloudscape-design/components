// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, ColumnLayout } from '~components';
import DescriptionList from '~components/key-value-pairs/composition';

import { KeyValueProps } from './interfaces';
import { validateArrayType } from './utils';

export { KeyValueProps };

const Pair = ({ label, values }: KeyValueProps.Pair) => (
  <DescriptionList.ListItem>
    {label && <DescriptionList.Term>{label}</DescriptionList.Term>}
    {values &&
      validateArrayType(values).map((value: any, index: number) => (
        <DescriptionList.Details key={index}>{value || '–'}</DescriptionList.Details>
      ))}
  </DescriptionList.ListItem>
);

const Group = ({ title, pairs }: KeyValueProps.Group) => {
  return (
    <>
      {title && (
        <Box variant="h3" padding={{ top: 'n', bottom: 'l' }}>
          {title}
        </Box>
      )}
      <DescriptionList.List direction="vertical">
        {pairs.map((pair: KeyValueProps.Pair, index: number) => (
          <Pair key={index} label={pair.label} values={pair.values} />
        ))}
      </DescriptionList.List>
    </>
  );
};

const ListAutoLayout = ({ pairsList }: KeyValueProps.List) => {
  let columnCount: 1 | 2 | 3 | 4;
  const nItems = pairsList ? pairsList.length : 0;
  // Determine the most efficient column layout based on number of pairs provided
  const columnsLookup: Record<number, 1 | 2 | 3 | 4> = {
    0: 1,
    5: 3,
    6: 3,
    9: 3,
  };

  // Only 1 row: Use number of items | For 1, 2, 3, 4 items
  if (!!nItems && nItems <= 4) {
    columnCount = nItems as 1 | 2 | 3 | 4;
    // Rows 2-3: Avoid having rows with just 1 item | For 5, 6, 9 items
    // Rows 4+: Maximize available space
  } else {
    columnCount = columnsLookup[nItems] || 4;
  }

  const columnsConfig: Array<KeyValueProps.Pair[]> = [];
  let columnIndex = 0;
  let rowIndex = 0;

  // If there isn't an even number of pairs to fill each column equally,
  // distribute the remainder evenly across the remaining rows.
  const remainder = nItems % columnCount;
  const minRowsInColumn = Math.floor(nItems / columnCount);
  const rowsInColumn = columnIndex < remainder ? minRowsInColumn + 1 : minRowsInColumn;

  // Build columns
  pairsList.forEach(pair => {
    if (!columnsConfig[columnIndex]) {
      columnsConfig[columnIndex] = [{ ...pair }];
    } else {
      columnsConfig[columnIndex].push({ ...pair });
    }
    if (rowIndex === rowsInColumn - 1) {
      rowIndex = 0;
      columnIndex++;
    } else {
      rowIndex++;
    }
  });

  return (
    <ColumnLayout columns={columnCount} variant="text-grid">
      {columnsConfig.map((column, colIndex) => (
        <Group key={colIndex} pairs={column} />
      ))}
    </ColumnLayout>
  );
};

export default { Pair, Group, ListAutoLayout };
