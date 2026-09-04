// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TableRoot, { TableRootProps } from '../../../lib/components/table-root';
import TableBody from '../../../lib/components/table-body';
import TableCell from '../../../lib/components/table-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableHeaderRow from '../../../lib/components/table-header-row';
import TableRow from '../../../lib/components/table-row';

// The accessible name is set through the top-level `ariaLabel` / `ariaLabelledby` props, which the
// component applies to the table's `aria-label` / `aria-labelledby`.

interface Item {
  id: string;
  name: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, name: `Resource ${i}`, status: i % 2 === 0 ? 'Up' : 'Down' }));

const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ minWidth: 120 }, {}];

function buildTree(labelProps: Pick<TableRootProps, 'ariaLabel' | 'ariaLabelledby'>) {
  const items = makeItems(10);
  return (
    <TableRoot columnLayout={{ type: 'grid', columns: COLUMNS }} {...labelProps}>
      <TableHead>
        <TableHeaderRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableHeaderRow>
      </TableHead>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}

const getTable = (container: HTMLElement) => container.querySelector('table')!;

describe('Table labelling', () => {
  test('ariaLabel passes through to the table aria-label', () => {
    const { container } = render(buildTree({ ariaLabel: 'Resources' }));
    expect(getTable(container).getAttribute('aria-label')).toBe('Resources');
  });

  test('ariaLabelledby passes through to the table aria-labelledby', () => {
    const { container } = render(buildTree({ ariaLabelledby: 'heading-id' }));
    expect(getTable(container).getAttribute('aria-labelledby')).toBe('heading-id');
  });
});
