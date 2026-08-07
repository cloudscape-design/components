// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { renderHook } from '../../../__tests__/render-hook';
import BasicTable, {
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableBody,
  BasicTableRow,
  BasicTableCell,
  BasicTableProps,
} from '../../../../lib/components/beta/basic-table-0.1';
import { useBasicTable } from '../basic-table/use-basic-table';

import styles from '../../../../lib/components/beta/basic-table-0.1/basic-table/styles.css.js';

// Proves the semantic styling props that close the dead-hook gaps reach their (otherwise
// unreachable, CSS-module-hashed) style hooks — without the deprecated `className` lever:
// RowProps.selected -> .row-selected + aria-selected; CellProps/HeaderCellProps wrapText -> .cell-wrap;
// variant="selection"|"disclosure" -> the shared control-column chrome; and the headless
// columnLayout="auto" branch consuming measured content widths.

const COLUMNS: ReadonlyArray<BasicTableProps.ColumnDefinition> = [{}, {}];

function Harness({ rowProps, cells }: { rowProps?: Partial<BasicTableProps.RowProps>; cells?: React.ReactNode }) {
  return (
    <BasicTable columns={COLUMNS} totalRowCount={1} i18nStrings={{ tableLabel: 'Resources' }}>
      <BasicTableHeader>
        <BasicTableHeaderCell>Name</BasicTableHeaderCell>
        <BasicTableHeaderCell>Status</BasicTableHeaderCell>
      </BasicTableHeader>
      <BasicTableBody>
        <BasicTableRow index={0} id="row-0" {...rowProps}>
          {cells ?? (
            <>
              <BasicTableCell>Resource 0</BasicTableCell>
              <BasicTableCell>Available</BasicTableCell>
            </>
          )}
        </BasicTableRow>
      </BasicTableBody>
    </BasicTable>
  );
}

describe('RowProps.selected', () => {
  test('applies the tokenized selected-row hook and aria-selected when selected', () => {
    const { container } = render(<Harness rowProps={{ selected: true }} />);
    const row = container.querySelector('[aria-rowindex="2"]')!;
    expect(row).toHaveAttribute('aria-selected', 'true');
    expect(row.classList.contains(styles['row-selected'])).toBe(true);
  });

  test('omits aria-selected and the selected hook when not provided', () => {
    const { container } = render(<Harness />);
    const row = container.querySelector('[aria-rowindex="2"]')!;
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row.classList.contains(styles['row-selected'])).toBe(false);
  });
});

describe('wrapText', () => {
  test('Cell wrapText applies the .cell-wrap hook', () => {
    const { container } = render(
      <Harness
        cells={
          <>
            <BasicTableCell wrapText={true}>Resource 0</BasicTableCell>
            <BasicTableCell>Available</BasicTableCell>
          </>
        }
      />
    );
    const cells = container.querySelectorAll('[role="gridcell"]');
    expect(cells[0].classList.contains(styles['cell-wrap'])).toBe(true);
    expect(cells[1].classList.contains(styles['cell-wrap'])).toBe(false);
  });

  test('HeaderCell wrapText applies the .cell-wrap hook', () => {
    const { container } = render(
      <BasicTable columns={COLUMNS} totalRowCount={0} i18nStrings={{ tableLabel: 'Resources' }}>
        <BasicTableHeader>
          <BasicTableHeaderCell wrapText={true}>A long header label</BasicTableHeaderCell>
          <BasicTableHeaderCell>Status</BasicTableHeaderCell>
        </BasicTableHeader>
        <BasicTableBody />
      </BasicTable>
    );
    const headers = container.querySelectorAll('[role="columnheader"]');
    expect(headers[0].classList.contains(styles['cell-wrap'])).toBe(true);
    expect(headers[1].classList.contains(styles['cell-wrap'])).toBe(false);
  });
});

describe('variant control columns', () => {
  test('Cell variant="selection" uses the selection-cell chrome (not the default cell)', () => {
    const { container } = render(
      <Harness
        cells={
          <>
            <BasicTableCell variant="selection">
              <input type="checkbox" aria-label="Select row" />
            </BasicTableCell>
            <BasicTableCell>Resource 0</BasicTableCell>
          </>
        }
      />
    );
    const cells = container.querySelectorAll('[role="gridcell"]');
    expect(cells[0].classList.contains(styles['selection-cell'])).toBe(true);
    expect(cells[0].classList.contains(styles.cell)).toBe(false);
  });

  test('Cell variant="disclosure" uses the disclosure-cell chrome', () => {
    const { container } = render(
      <Harness
        cells={
          <>
            <BasicTableCell variant="disclosure">
              <button id="row-0-toggle" type="button" aria-label="Expand" />
            </BasicTableCell>
            <BasicTableCell>Resource 0</BasicTableCell>
          </>
        }
      />
    );
    const cells = container.querySelectorAll('[role="gridcell"]');
    expect(cells[0].classList.contains(styles['disclosure-cell'])).toBe(true);
    expect(cells[0].classList.contains(styles.cell)).toBe(false);
  });

  test('HeaderCell variant control columns are never resizable', () => {
    const { container } = render(
      <BasicTable columns={COLUMNS} totalRowCount={0} resizableColumns={true} i18nStrings={{ tableLabel: 'Resources' }}>
        <BasicTableHeader>
          <BasicTableHeaderCell variant="selection">
            <input type="checkbox" aria-label="Select all" />
          </BasicTableHeaderCell>
          <BasicTableHeaderCell>Name</BasicTableHeaderCell>
        </BasicTableHeader>
        <BasicTableBody />
      </BasicTable>
    );
    const headers = container.querySelectorAll('[role="columnheader"]');
    expect(headers[0].classList.contains(styles['selection-header'])).toBe(true);
    // A resizable data header renders a resize-handle <button>; a control-column header must not.
    expect(headers[0].querySelector('button')).toBeNull();
  });
});

describe('columnLayout="auto" (headless track generation)', () => {
  test('auto layout turns a flexible column into a fixed content-measured track (floored at minWidth)', () => {
    const { result } = renderHook(() =>
      useBasicTable({
        columns: [{ width: 200 }, {}, { minWidth: 300 }],
        totalRowCount: 3,
        columnLayout: 'auto',
        autoColumnWidths: { 1: 250, 2: 120 },
      })
    );
    expect(result.current.gridTemplateColumns).toBe('200px 250px 300px');
  });

  test('fixed layout ignores measured widths (flexible columns stay 1fr)', () => {
    const { result } = renderHook(() =>
      useBasicTable({
        columns: [{ width: 200 }, {}],
        totalRowCount: 3,
        columnLayout: 'fixed',
        autoColumnWidths: { 1: 250 },
      })
    );
    expect(result.current.gridTemplateColumns).toBe('200px minmax(0px, 1fr)');
  });
});
