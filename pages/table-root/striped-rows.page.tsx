// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableCell from '~components/table-cell';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';

import { DataHeader, makeItems } from './common';

// Striped rows are composed via the row `variant`: the consumer renders the rows and knows each
// index, so it marks alternating rows `shaded`. The atomic table owns no row-parity computation.
export default function TableStripedRowsPage() {
  const items = makeItems(12);
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">Table atomics — striped rows (variant=&apos;shaded&apos;)</Box>

        <SpaceBetween size="s">
          <Header counter={`(${items.length})`}>Resources</Header>
          <TableRoot ariaLabel="Resources">
            <DataHeader />
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id} variant={index % 2 === 1 ? 'shaded' : 'default'}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
