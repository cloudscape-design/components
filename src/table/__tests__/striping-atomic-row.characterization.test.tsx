// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Characterization test for the striping ownership under Inc A (plain/selection cells reuse the
// atomic Cell). The row-level `data-shaded` marker is retained on the <tr> (it still gates the
// un-migrated th/editable/expandable cells and the sticky-only per-cell fill), while the migrated
// plain data cells SELF-PAINT their shaded fill via their own module class (`cell-shaded`) and do
// NOT carry a per-cell `data-shaded` attribute. This locks in:
//   1. odd (non-even) data rows carry the row-level data-shaded marker; even rows and non-striped
//      tables do not, and
//   2. migrated cells in shaded rows expose the self-painted `cell-shaded` class, not a per-cell
//      data-shaded attribute.
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id },
  { header: 'name', cell: item => item.name },
];

const items: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
  { id: 4, name: 'Pears' },
];

function renderTable(tableProps: Partial<TableProps>) {
  const props: TableProps = { items, totalItemsCount: items.length, columnDefinitions, ...tableProps };
  const { container } = render(<Table {...props} />);
  return createWrapper(container).findTable()!;
}

// The row-level marker lives on the <tr> itself; a migrated cell self-paints via its own cell-shaded
// class. querySelector on the row targets descendants, so cell-level data-shaded (the pre-migration
// per-cell marker) would show up here — it must NOT.
function rowIsShaded(row: ReturnType<ReturnType<typeof renderTable>['findRows']>[number]) {
  return row.getElement().getAttribute('data-shaded') === 'true';
}
function rowHasPerCellDataShaded(row: ReturnType<ReturnType<typeof renderTable>['findRows']>[number]) {
  return !!row.getElement().querySelector('[data-shaded="true"]');
}
function rowHasSelfPaintedShadedCell(row: ReturnType<ReturnType<typeof renderTable>['findRows']>[number]) {
  return !!row.getElement().querySelector('[class*="cell-shaded"]');
}

test('striped rows carry the row-level data-shaded marker on odd rows; cells self-paint cell-shaded', () => {
  const wrapper = renderTable({ stripedRows: true });
  const rows = wrapper.findRows();
  expect(rows).toHaveLength(4);

  // Even rows (index 0, 2) are not shaded; odd rows (index 1, 3) are.
  expect(rowIsShaded(rows[0])).toBe(false);
  expect(rowIsShaded(rows[1])).toBe(true);
  expect(rowIsShaded(rows[2])).toBe(false);
  expect(rowIsShaded(rows[3])).toBe(true);

  // Migrated cells self-paint the shaded fill via their own class, without a per-cell data-shaded attr.
  expect(rowHasSelfPaintedShadedCell(rows[1])).toBe(true);
  expect(rowHasPerCellDataShaded(rows[1])).toBe(false);
  expect(rowHasSelfPaintedShadedCell(rows[0])).toBe(false);
});

test('without stripedRows no row is marked shaded and no cell self-paints shaded', () => {
  const wrapper = renderTable({});
  wrapper.findRows().forEach(row => {
    expect(rowIsShaded(row)).toBe(false);
    expect(rowHasSelfPaintedShadedCell(row)).toBe(false);
  });
});
