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
import createWrapper from '../../../lib/components/test-utils/dom';

// Tests for the atomic table parts (TableRoot/TableHead/TableHeaderCell/TableBody/TableRow/TableCell)
// over the headless useTableRoot hook, accessed through the generated per-part test-utils finders.
// The consumer declares the head as a TableRow of TableHeaderCells and maps the body Rows/Cells;
// TableRoot auto-renders neither. `{ type: 'auto' }` (default) renders a native <table> with no
// explicit ARIA roles; `{ type: 'grid' }` renders a display:grid table that restores the table roles
// and applies the shared column template. Sorting/selection are composed by the consumer.

interface Item {
  id: string;
  name: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, index) => ({
    id: `row-${index}`,
    name: `Resource ${index}`,
    status: index % 2 === 0 ? 'Available' : 'Pending',
  }));

// Grid layout needs one column entry per column (Name fixed 200px, Status flexible).
const GRID_COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 200 }, {}];

interface RenderOptions {
  grid?: boolean;
  count?: number;
  items?: Item[];
  ariaRowcount?: number;
}

function TableHarness({ options }: { options: RenderOptions }) {
  const items = options.items ?? makeItems(options.count ?? 5);
  const columnLayout: TableRootProps.ColumnLayout = options.grid
    ? { type: 'grid', columns: GRID_COLUMNS }
    : { type: 'auto' };
  return (
    <TableRoot columnLayout={columnLayout} ariaLabel="Resources" ariaRowcount={options.ariaRowcount}>
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

function renderTable(options: RenderOptions = {}) {
  const utils = render(<TableHarness options={options} />);
  const wrapper = createWrapper(utils.container);
  const table = () => wrapper.find('table')!.getElement();
  return { wrapper, table, ...utils };
}

describe('Table atomic parts', () => {
  test('renders the declarative header cells, discoverable via the generated finder', () => {
    const { wrapper } = renderTable();
    expect(wrapper.findTableRoot()).not.toBeNull();
    const headerCells = wrapper.findAllTableHeaderCells();
    expect(headerCells).toHaveLength(2);
    expect(headerCells[0].getElement().textContent).toContain('Name');
    expect(headerCells[1].getElement().textContent).toContain('Status');
  });

  test('renders the mapped rows and cells, discoverable via the generated finders', () => {
    const { wrapper } = renderTable({ count: 5 });
    const rows = wrapper.findAllTableRows();
    expect(rows).toHaveLength(5); // body rows only; the header row uses a different root class

    const firstRowCells = createWrapper(rows[0].getElement()).findAllTableCells();
    expect(firstRowCells).toHaveLength(2);
    expect(firstRowCells[0].getElement().textContent).toBe('Resource 0');
    expect(firstRowCells[1].getElement().textContent).toBe('Available');

    expect(wrapper.findTableBody()).not.toBeNull();
    expect(wrapper.findTableHead()).not.toBeNull();
    expect(wrapper.findAllTableCells()).toHaveLength(10);
  });

  test('ariaLabel is applied to the table element', () => {
    const { table } = renderTable();
    expect(table().getAttribute('aria-label')).toBe('Resources');
  });

  test('ariaRowcount is applied to aria-rowcount as-is', () => {
    const { table } = renderTable({ count: 5, ariaRowcount: 40 });
    expect(table().getAttribute('aria-rowcount')).toBe('40');
  });

  test('omits aria-rowcount when ariaRowcount is not provided (count derives from the DOM)', () => {
    const { table } = renderTable({ count: 5 });
    expect(table().hasAttribute('aria-rowcount')).toBe(false);
  });

  describe('auto column layout (default)', () => {
    test('renders a native <table> with no explicit table/row/cell ARIA roles', () => {
      const { table, wrapper } = renderTable();
      expect(table().tagName).toBe('TABLE');
      expect(table().hasAttribute('role')).toBe(false);
      expect(table().querySelectorAll('[role="row"]')).toHaveLength(0);
      expect(table().querySelectorAll('[role="columnheader"]')).toHaveLength(0);
      expect(table().querySelectorAll('[role="cell"], [role="gridcell"]')).toHaveLength(0);
      const th = wrapper.findAllTableHeaderCells()[0].getElement();
      expect(th.tagName).toBe('TH');
      expect(th.getAttribute('scope')).toBe('col');
    });

    test('does not emit an inline grid-template-columns on rows', () => {
      const { wrapper } = renderTable();
      const row = wrapper.findAllTableRows()[0].getElement() as HTMLElement;
      expect(row.style.gridTemplateColumns).toBe('');
    });
  });

  describe('grid column layout', () => {
    test('restores the table ARIA roles that display:grid strips', () => {
      const { table, wrapper } = renderTable({ grid: true });
      expect(table().getAttribute('role')).toBe('table');
      expect(table().querySelectorAll('[role="rowgroup"]').length).toBeGreaterThanOrEqual(2);

      const headerCell = wrapper.findAllTableHeaderCells()[0].getElement();
      expect(headerCell.getAttribute('role')).toBe('columnheader');
      expect(headerCell.getAttribute('scope')).toBe('col');

      const dataRow = wrapper.findAllTableRows()[0].getElement();
      expect(dataRow.getAttribute('role')).toBe('row');
      expect(dataRow.querySelectorAll('[role="cell"]')).toHaveLength(2);
    });

    test('the header row is aria-rowindex 1 and shares the column template with the data rows', () => {
      const { wrapper } = renderTable({ grid: true });
      const headerRow = wrapper.findTableHead()!.find('[role="row"]')!.getElement() as HTMLElement;
      expect(headerRow.getAttribute('aria-rowindex')).toBe('1');
      const template = '200px minmax(0px, 1fr)';
      expect(headerRow.style.gridTemplateColumns).toBe(template);

      const dataRow = wrapper.findAllTableRows()[0].getElement() as HTMLElement;
      expect(dataRow.style.gridTemplateColumns).toBe(template);
    });
  });

  describe('row aria-selected is driven by ariaSelected, not variant', () => {
    test('variant is visual-only; ariaSelected sets aria-selected independently', () => {
      const { container } = render(
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            <TableRow variant="selected" ariaSelected={true}>
              <TableCell>Selected + announced</TableCell>
            </TableRow>
            <TableRow variant="selected">
              <TableCell>Selected visual only</TableCell>
            </TableRow>
            <TableRow ariaSelected={false}>
              <TableCell>Explicitly not selected</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Default</TableCell>
            </TableRow>
          </TableBody>
        </TableRoot>
      );
      const rows = createWrapper(container).findAllTableRows();
      // variant='selected' + ariaSelected -> aria-selected="true"
      expect(rows[0].getElement().getAttribute('aria-selected')).toBe('true');
      // variant='selected' WITHOUT ariaSelected -> no aria-selected (variant is visual only)
      expect(rows[1].getElement().hasAttribute('aria-selected')).toBe(false);
      // ariaSelected={false} -> aria-selected="false"
      expect(rows[2].getElement().getAttribute('aria-selected')).toBe('false');
      // default -> no aria-selected
      expect(rows[3].getElement().hasAttribute('aria-selected')).toBe(false);
    });
  });

  describe('declared per-part ARIA props', () => {
    test('HeaderCell ariaSort sets aria-sort on the column header', () => {
      const { container } = render(
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell ariaSort="ascending">Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Resource 0</TableCell>
              <TableCell>Available</TableCell>
            </TableRow>
          </TableBody>
        </TableRoot>
      );
      const headerCells = createWrapper(container).findAllTableHeaderCells();
      expect(headerCells[0].getElement().getAttribute('aria-sort')).toBe('ascending');
      expect(headerCells[1].getElement().hasAttribute('aria-sort')).toBe(false);
    });

    test('Row ariaRowindex sets aria-rowindex for virtualization', () => {
      const { container } = render(
        <TableRoot ariaLabel="Resources" ariaRowcount={500}>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            <TableRow ariaRowindex={202}>
              <TableCell>Resource 200</TableCell>
            </TableRow>
          </TableBody>
        </TableRoot>
      );
      const row = createWrapper(container).findAllTableRows()[0].getElement();
      expect(row.getAttribute('aria-rowindex')).toBe('202');
    });
  });

  describe('native data-* passthrough on parts (virtualization interop)', () => {
    test('a row and cell forward data-* to their roots', () => {
      const { container } = render(
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            <TableRow data-index={7}>
              <TableCell data-column="name">Resource 7</TableCell>
            </TableRow>
          </TableBody>
        </TableRoot>
      );
      const wrapper = createWrapper(container);
      expect(wrapper.findAllTableRows()[0].getElement().getAttribute('data-index')).toBe('7');
      expect(wrapper.findAllTableCells()[0].getElement().getAttribute('data-column')).toBe('name');
    });
  });
});
