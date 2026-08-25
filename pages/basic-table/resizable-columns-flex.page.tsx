// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';

// Resizable columns inside a constrained flex container (maxWidth 400): the table must lay out and
// resize correctly when its parent, not the viewport, bounds its width.
const columns = [{ minWidth: 100 }, { minWidth: 100 }];

export default function BasicTableResizableFlexPage() {
  return (
    <Box padding="s">
      <Box variant="h1">Resizable columns — flex</Box>
      <div style={{ display: 'flex', maxWidth: 400 }}>
        <BasicTable columns={columns} resizableColumns={true} totalRowCount={3} i18nStrings={{ tableLabel: 'Flex' }}>
          <BasicTableHeader>
            <BasicTableHeaderCell>A</BasicTableHeaderCell>
            <BasicTableHeaderCell>B</BasicTableHeaderCell>
          </BasicTableHeader>
          <BasicTableBody>
            {[0, 1, 2].map(index => (
              <BasicTableRow key={index} index={index} id={`r-${index}`}>
                <BasicTableCell>a</BasicTableCell>
                <BasicTableCell>b</BasicTableCell>
              </BasicTableRow>
            ))}
          </BasicTableBody>
        </BasicTable>
      </div>
    </Box>
  );
}
