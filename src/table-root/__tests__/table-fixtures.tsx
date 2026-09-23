// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot, { TableRootProps } from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';

export interface Item {
  id: string;
  name: string;
  status: string;
}

export const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, index) => ({
    id: `row-${index}`,
    name: `Resource ${index}`,
    status: index % 2 === 0 ? 'Available' : 'Pending',
  }));

export const GRID_COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 200 }, {}];

const HEADERS = ['Name', 'Status'];

export interface ResourcesTableProps {
  grid?: boolean;
  items?: Item[];
  columns?: ReadonlyArray<TableRootProps.ColumnDefinition>;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRowcount?: number;
  rowProps?: { selected?: boolean; shaded?: boolean };
}

export function ResourcesTable({
  grid,
  items = [],
  columns = GRID_COLUMNS,
  ariaLabel = 'Resources',
  ariaLabelledby,
  ariaRowcount,
  rowProps,
}: ResourcesTableProps) {
  const columnLayout: TableRootProps.ColumnLayout = grid ? { type: 'grid', columns } : { type: 'auto' };
  return (
    <TableRoot
      columnLayout={columnLayout}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaRowcount={ariaRowcount}
    >
      <TableHead>
        <TableRow>
          {columns.map((_, index) => (
            <TableHeaderCell key={index}>{HEADERS[index] ?? `Column ${index + 1}`}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id} {...rowProps}>
            {columns.map((_, index) => (
              <TableBodyCell key={index}>{index === 0 ? item.name : item.status}</TableBodyCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}

export function renderResourcesTable(props: ResourcesTableProps = {}) {
  const { container, rerender } = render(<ResourcesTable {...props} />);
  return { container, rerender, wrapper: createWrapper(container) };
}

export function findTable(wrapper: ReturnType<typeof createWrapper>): HTMLElement {
  return wrapper.findTableRoot()!.find('table')!.getElement();
}

// Body rows only — the header row is also a `.row`, but lives in TableHead.
export function findBodyRows(wrapper: ReturnType<typeof createWrapper>) {
  return createWrapper(wrapper.findTableBody()!.getElement()).findAllTableRows();
}

export function findBodyRow(wrapper: ReturnType<typeof createWrapper>, index = 0): HTMLElement {
  return findBodyRows(wrapper)[index].getElement() as HTMLElement;
}
