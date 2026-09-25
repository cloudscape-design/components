// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Table from '../../../lib/components/table';
import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot, { TableRootProps } from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';
import { findBodyRow, makeItems, renderResourcesTable } from './table-fixtures';

import bodyCellStyles from '../../../lib/components/table/body-cell/styles.css.js';
import legacyHeaderCellStyles from '../../../lib/components/table/header-cell/styles.css.js';
import cellStyles from '../../../lib/components/table-body-cell/styles.css.js';
import headerCellStyles from '../../../lib/components/table-header-cell/styles.css.js';

// The row `selected`/`shaded` props are visual-only: each emits an independent `data-awsui-*` hook on the
// <tr> and never sets `aria-selected`. Selection wins over shading by omitting the shaded hook.

describe('TableRow selection/shading is visual-only and paints through the cell', () => {
  test('selected emits the data-awsui-selected hook and sets no aria-selected', () => {
    const row = findBodyRow(renderResourcesTable({ items: makeItems(1), rowProps: { selected: true } }).wrapper);
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).toHaveAttribute('data-awsui-selected', 'true');
  });

  test('shaded emits the data-awsui-shaded hook', () => {
    const row = findBodyRow(renderResourcesTable({ items: makeItems(1), rowProps: { shaded: true } }).wrapper);
    expect(row).toHaveAttribute('data-awsui-shaded', 'true');
  });

  test('selection wins over shading — a selected+shaded row emits only the selected hook', () => {
    const row = findBodyRow(
      renderResourcesTable({ items: makeItems(1), rowProps: { selected: true, shaded: true } }).wrapper
    );
    expect(row).toHaveAttribute('data-awsui-selected', 'true');
    expect(row).not.toHaveAttribute('data-awsui-shaded');
  });

  test('an unstyled row emits neither hook and no aria-selected', () => {
    const row = findBodyRow(renderResourcesTable({ items: makeItems(1) }).wrapper);
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).not.toHaveAttribute('data-awsui-selected');
    expect(row).not.toHaveAttribute('data-awsui-shaded');
  });
});

describe('inline style props (virtualization)', () => {
  const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 100 }];

  test('TableBody and TableRow apply their narrowed inline style to their roots', () => {
    const { container } = render(
      <TableRoot columnLayout={{ type: 'grid', columns: COLUMNS }} ariaLabel="Log">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody positionStyle={{ position: 'relative', height: 400 }}>
          <TableRow positionStyle={{ position: 'absolute', transform: 'translateY(40px)', height: 40 }}>
            <TableBodyCell>Row</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const wrapper = createWrapper(container);
    const body = wrapper.findTableBody()!.getElement() as HTMLElement;
    expect(body.style.position).toBe('relative');
    expect(body.style.height).toBe('400px');

    const row = findBodyRow(wrapper);
    expect(row.style.position).toBe('absolute');
    expect(row.style.transform).toBe('translateY(40px)');
    expect(row.style.gridTemplateColumns).toBe('100px');
  });
});

describe('disablePaddings', () => {
  test('TableBodyCell content opts into padding unless disablePaddings is set (mutually exclusive)', () => {
    const { container } = render(
      <TableRoot ariaLabel="Resources">
        <TableBody>
          <TableRow>
            <TableBodyCell disablePaddings={true}>Control</TableBodyCell>
            <TableBodyCell>Resource 0</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const cells = createWrapper(container).findAllTableBodyCells();
    const contentOf = (index: number) =>
      cells[index].getElement().getElementsByClassName(bodyCellStyles['body-cell-content'])[0];
    expect(contentOf(0).classList.contains(bodyCellStyles['disable-paddings'])).toBe(true);
    expect(contentOf(0).classList.contains(bodyCellStyles['with-paddings'])).toBe(false);
    expect(contentOf(1).classList.contains(bodyCellStyles['disable-paddings'])).toBe(false);
    expect(contentOf(1).classList.contains(bodyCellStyles['with-paddings'])).toBe(true);
  });

  test('TableHeaderCell opts into padding unless disablePaddings is set (mutually exclusive)', () => {
    const { container } = render(
      <TableRoot ariaLabel="Resources">
        <TableHead>
          <TableRow>
            <TableHeaderCell disablePaddings={true} />
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </TableRoot>
    );
    const headerCells = createWrapper(container).findAllTableHeaderCells();
    const rootOf = (index: number) => headerCells[index].getElement();
    expect(rootOf(0).classList.contains(headerCellStyles['disable-paddings'])).toBe(true);
    expect(rootOf(0).classList.contains(legacyHeaderCellStyles['with-paddings'])).toBe(false);
    expect(rootOf(1).classList.contains(headerCellStyles['disable-paddings'])).toBe(false);
    expect(rootOf(1).classList.contains(legacyHeaderCellStyles['with-paddings'])).toBe(true);
  });
});

describe('isRowHeader', () => {
  test('renders a row header as <th scope="row"> with role="rowheader" in grid mode', () => {
    const { container } = render(
      <TableRoot columnLayout={{ type: 'grid', columns: [{ size: 120 }, {}] }} ariaLabel="Resources">
        <TableBody>
          <TableRow>
            <TableBodyCell isRowHeader={true}>Name</TableBodyCell>
            <TableBodyCell>Value</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const cell = createWrapper(container).findAllTableBodyCells()[0].getElement();
    expect(cell.tagName).toBe('TH');
    expect(cell).toHaveAttribute('scope', 'row');
    expect(cell).toHaveAttribute('role', 'rowheader');
  });

  test('renders a row header as a native <th scope="row"> without an explicit role in auto mode', () => {
    const { container } = render(
      <TableRoot ariaLabel="Resources">
        <TableBody>
          <TableRow>
            <TableBodyCell isRowHeader={true}>Name</TableBodyCell>
            <TableBodyCell>Value</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const cell = createWrapper(container).findAllTableBodyCells()[0].getElement();
    expect(cell.tagName).toBe('TH');
    expect(cell).toHaveAttribute('scope', 'row');
    expect(cell).not.toHaveAttribute('role');
  });
});

describe('colSpan', () => {
  test('auto layout sets the native colspan attribute only', () => {
    const { container } = render(
      <TableRoot ariaLabel="Resources">
        <TableBody>
          <TableRow>
            <TableBodyCell colSpan={3}>Full width</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const cell = createWrapper(container).findAllTableBodyCells()[0].getElement() as HTMLElement;
    expect(cell.getAttribute('colspan')).toBe('3');
    expect(cell.style.gridColumn).toBe('');
    expect(cell).not.toHaveAttribute('aria-colspan');
  });

  test('grid layout spans tracks via grid-column and marks the span with aria-colspan', () => {
    const { container } = render(
      <TableRoot columnLayout={{ type: 'grid', columns: [{}, {}, {}] }} ariaLabel="Resources">
        <TableBody>
          <TableRow>
            <TableBodyCell colSpan={3}>Full width</TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const cell = createWrapper(container).findAllTableBodyCells()[0].getElement() as HTMLElement;
    expect(cell.style.gridColumn).toBe('span 3');
    expect(cell).toHaveAttribute('aria-colspan', '3');
    expect(cell).toHaveAttribute('role', 'cell');
    expect(cell).not.toHaveAttribute('colspan');
  });
});

describe('nested content is insulated from the table/row context', () => {
  test('a classic Table nested in a selected grid cell inherits neither the outer grid layout nor the selected styling', () => {
    const { container } = render(
      <TableRoot columnLayout={{ type: 'grid', columns: [{ size: 400 }] }} ariaLabel="Outer">
        <TableBody>
          <TableRow selected={true}>
            <TableBodyCell>
              <Table columnDefinitions={[{ id: 'v', header: 'V', cell: item => item.v }]} items={[{ v: 'nested' }]} />
            </TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    // The existing Table resets both atomic contexts at its root, so its own cells read auto layout and
    // no selection paint — the outer grid class and selected paint do not leak into the nested table.
    const nestedCell = createWrapper(container).findTable()!.findBodyCell(1, 1)!.getElement();
    expect(nestedCell.classList.contains(cellStyles['cell-grid'])).toBe(false);
    expect(nestedCell.classList.contains(bodyCellStyles['body-cell-selected'])).toBe(false);
  });

  test('a nested atomic TableRoot in a selected grid cell resets to its own auto layout and no selection', () => {
    const { container } = render(
      <TableRoot columnLayout={{ type: 'grid', columns: [{ size: 400 }] }} ariaLabel="Outer">
        <TableBody>
          <TableRow selected={true}>
            <TableBodyCell>
              <TableRoot ariaLabel="Inner">
                <TableBody>
                  <TableRow>
                    <TableBodyCell>Nested</TableBodyCell>
                  </TableRow>
                </TableBody>
              </TableRoot>
            </TableBodyCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const innerRoot = createWrapper(createWrapper(container).findAllTableRoots()[1].getElement());
    const innerRow = findBodyRow(innerRoot);
    // The inner TableRoot supplies its own auto-layout context, so the outer grid layout and the
    // outer row's selection do not leak into the nested table.
    expect(innerRow).not.toHaveAttribute('data-awsui-selected');
    expect(createWrapper(innerRow).findTableBodyCell()!.getElement().classList.contains(cellStyles['cell-grid'])).toBe(
      false
    );
  });
});
