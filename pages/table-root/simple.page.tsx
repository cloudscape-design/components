// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';
import Toggle from '~components/toggle';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { DataHeader, makeItems } from './common';

// A minimal read-only table in auto layout (`columnLayout` omitted, so it defaults to `{ type: 'auto' }`).
// Striping is composed by the consumer via the row `variant`: with the toggle on, alternating rows are
// marked `shaded` — the atomic table owns no row-parity computation.
export default function TableSimplePage() {
  const items = makeItems(10);
  const { urlParams, setUrlParams } = useAppContext<'stripedRows'>();
  const striped = urlParams.stripedRows === true || urlParams.stripedRows === 'true';

  return (
    <SimplePage
      title="Table atomics — simple (auto layout)"
      settings={
        <Toggle checked={striped} onChange={({ detail }) => setUrlParams({ stripedRows: detail.checked })}>
          Striped rows
        </Toggle>
      }
      screenshotArea={{}}
    >
      <SpaceBetween size="s">
        <Header counter={`(${items.length})`}>Resources</Header>
        <TableRoot ariaLabel="Resources">
          <DataHeader />
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} variant={striped && index % 2 === 1 ? 'shaded' : 'default'}>
                <TableBodyCell isRowHeader={true}>{item.name}</TableBodyCell>
                <TableBodyCell>{item.type}</TableBodyCell>
                <TableBodyCell>{item.size}</TableBodyCell>
                <TableBodyCell>{item.status}</TableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </SpaceBetween>
    </SimplePage>
  );
}
