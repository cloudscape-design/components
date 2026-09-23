// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';
import { findBodyRow, findBodyRows, findTable, makeItems, renderResourcesTable } from './table-fixtures';

// Role semantics, labelling and selection/shading have dedicated suites (basic-table-roles /
// -aria-label / -styling-props); this covers part composition plus the per-part ARIA and data-* props.

describe('Table atomic parts', () => {
  test('renders the declarative header cells, discoverable via the generated finder', () => {
    const { wrapper } = renderResourcesTable({ items: makeItems(5) });
    expect(wrapper.findTableRoot()).not.toBeNull();
    const headerCells = wrapper.findAllTableHeaderCells();
    expect(headerCells).toHaveLength(2);
    expect(headerCells[0].getElement().textContent).toContain('Name');
    expect(headerCells[1].getElement().textContent).toContain('Status');
    expect(headerCells[0].getElement().tagName).toBe('TH');
    expect(headerCells[0].getElement().getAttribute('scope')).toBe('col');
  });

  test('renders the mapped rows and cells, discoverable via the generated finders', () => {
    const { wrapper } = renderResourcesTable({ items: makeItems(5) });
    const rows = findBodyRows(wrapper);
    expect(rows).toHaveLength(5);

    const firstRowCells = createWrapper(rows[0].getElement()).findAllTableBodyCells();
    expect(firstRowCells).toHaveLength(2);
    expect(firstRowCells[0].getElement().textContent).toBe('Resource 0');
    expect(firstRowCells[1].getElement().textContent).toBe('Available');

    expect(wrapper.findTableBody()).not.toBeNull();
    expect(wrapper.findTableHead()).not.toBeNull();
    expect(wrapper.findAllTableBodyCells()).toHaveLength(10);
  });

  test('ariaRowcount is applied to aria-rowcount as-is', () => {
    const { wrapper } = renderResourcesTable({ items: makeItems(5), ariaRowcount: 40 });
    expect(findTable(wrapper).getAttribute('aria-rowcount')).toBe('40');
  });

  test('omits aria-rowcount when ariaRowcount is not provided (count derives from the DOM)', () => {
    const { wrapper } = renderResourcesTable({ items: makeItems(5) });
    expect(findTable(wrapper).hasAttribute('aria-rowcount')).toBe(false);
  });

  describe('auto column layout (default)', () => {
    test('does not emit an inline grid-template-columns on rows', () => {
      const { wrapper } = renderResourcesTable({ items: makeItems(5) });
      expect(findBodyRow(wrapper).style.gridTemplateColumns).toBe('');
    });
  });

  describe('grid column layout', () => {
    test('the header row shares the column template with the data rows', () => {
      const { wrapper } = renderResourcesTable({ items: makeItems(5), grid: true });
      const template = '200px minmax(0px, 1fr)';
      const headerRow = wrapper.findTableHead()!.find('[role="row"]')!.getElement() as HTMLElement;
      expect(headerRow.style.gridTemplateColumns).toBe(template);
      expect(findBodyRow(wrapper).style.gridTemplateColumns).toBe(template);
    });

    test('the header row emits aria-rowindex only when set explicitly (consumer-managed numbering)', () => {
      const withIndex = render(
        <TableRoot ariaLabel="Resources" ariaRowcount={500} columnLayout={{ type: 'grid', columns: [{ size: 200 }] }}>
          <TableHead>
            <TableRow ariaRowindex={1}>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
          </TableHead>
        </TableRoot>
      );
      const withIndexHeaderRow = createWrapper(withIndex.container).findTableHead()!.find('[role="row"]')!.getElement();
      expect(withIndexHeaderRow.getAttribute('aria-rowindex')).toBe('1');

      const { wrapper } = renderResourcesTable({ items: makeItems(5), grid: true });
      const plainHeaderRow = wrapper.findTableHead()!.find('[role="row"]')!.getElement();
      expect(plainHeaderRow.hasAttribute('aria-rowindex')).toBe(false);
    });
  });

  describe('declared per-part ARIA props', () => {
    test('HeaderCell ariaSort sets aria-sort on the column header', () => {
      const { container } = render(
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableRow>
              <TableHeaderCell ariaSort="ascending">Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableBodyCell>Resource 0</TableBodyCell>
              <TableBodyCell>Available</TableBodyCell>
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
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow ariaRowindex={202}>
              <TableBodyCell>Resource 200</TableBodyCell>
            </TableRow>
          </TableBody>
        </TableRoot>
      );
      const row = createWrapper(createWrapper(container).findTableBody()!.getElement())
        .findAllTableRows()[0]
        .getElement();
      expect(row.getAttribute('aria-rowindex')).toBe('202');
    });
  });

  describe('native data-* passthrough on parts (virtualization interop)', () => {
    test('a row and cell forward data-* to their roots', () => {
      const { container } = render(
        <TableRoot ariaLabel="Resources">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow data-index={7}>
              <TableBodyCell data-column="name">Resource 7</TableBodyCell>
            </TableRow>
          </TableBody>
        </TableRoot>
      );
      const wrapper = createWrapper(container);
      expect(findBodyRow(wrapper).getAttribute('data-index')).toBe('7');
      expect(wrapper.findAllTableBodyCells()[0].getElement().getAttribute('data-column')).toBe('name');
    });
  });
});
