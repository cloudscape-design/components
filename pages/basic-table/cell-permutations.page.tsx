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
import SpaceBetween from '~components/space-between';

// Cell content permutations. `wrapText` is a CELL-scoped prop (per cell / per header cell), so wrap
// vs. truncate is chosen where the long content lives — not a table-global `wrapLines`. The
// `verticalAlign` axis from Table's cell-permutations is NOT built in BasicTable (Bucket A), so it
// is omitted here.
const LONG =
  'A deliberately long cell value that exceeds the column width so truncation vs wrapping is visible';

const columns = [{ width: 160 }, { width: 200 }];

export default function BasicTableCellPermutationsPage() {
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — cell permutations (wrapText)</Box>

        <SpaceBetween size="s">
          <Box variant="h2">Default (truncate)</Box>
          <BasicTable columns={columns} totalRowCount={2} i18nStrings={{ tableLabel: 'Truncate' }}>
            <BasicTableHeader>
              <BasicTableHeaderCell>Name</BasicTableHeaderCell>
              <BasicTableHeaderCell>Description</BasicTableHeaderCell>
            </BasicTableHeader>
            <BasicTableBody>
              {[0, 1].map(index => (
                <BasicTableRow key={index} index={index} id={`t-${index}`}>
                  <BasicTableCell>Resource {index}</BasicTableCell>
                  <BasicTableCell>{LONG}</BasicTableCell>
                </BasicTableRow>
              ))}
            </BasicTableBody>
          </BasicTable>
        </SpaceBetween>

        <SpaceBetween size="s">
          <Box variant="h2">wrapText on the description cells + header</Box>
          <BasicTable columns={columns} totalRowCount={2} i18nStrings={{ tableLabel: 'Wrap' }}>
            <BasicTableHeader>
              <BasicTableHeaderCell>Name</BasicTableHeaderCell>
              <BasicTableHeaderCell wrapText={true}>Description that itself wraps onto lines</BasicTableHeaderCell>
            </BasicTableHeader>
            <BasicTableBody>
              {[0, 1].map(index => (
                <BasicTableRow key={index} index={index} id={`w-${index}`}>
                  <BasicTableCell>Resource {index}</BasicTableCell>
                  <BasicTableCell wrapText={true}>{LONG}</BasicTableCell>
                </BasicTableRow>
              ))}
            </BasicTableBody>
          </BasicTable>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
