// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';

// Sub-pixel width rounding: 5 flexible columns split a container width that is not evenly divisible,
// then a button shrinks the container so the `1fr` tracks must re-round. Guards against cumulative
// rounding drift / overflow when fractional track widths are recomputed.
const columns = [{ minWidth: 80 }, { minWidth: 80 }, { minWidth: 80 }, { minWidth: 80 }, { minWidth: 80 }];
const rows = [0, 1, 2, 3, 4, 5];

export default function BasicTableResizableRoundingPage() {
  const [width, setWidth] = useState(649);
  return (
    <Box padding="s">
      <Box variant="h1">Resizable columns — rounding</Box>
      <button id="shrink-container" onClick={() => setWidth(635)}>
        Resize container
      </button>
      <div style={{ inlineSize: width }}>
        <BasicTable columns={columns} resizableColumns={true} totalRowCount={rows.length} i18nStrings={{ tableLabel: 'Rounding' }}>
          <BasicTableHeader>
            {columns.map((_, index) => (
              <BasicTableHeaderCell key={index}>Column</BasicTableHeaderCell>
            ))}
          </BasicTableHeader>
          <BasicTableBody>
            {rows.map(index => (
              <BasicTableRow key={index} index={index} id={`r-${index}`}>
                {columns.map((_, col) => (
                  <BasicTableCell key={col}>aaaaaaaaaa</BasicTableCell>
                ))}
              </BasicTableRow>
            ))}
          </BasicTableBody>
        </BasicTable>
      </div>
    </Box>
  );
}
