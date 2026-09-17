// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Table from '../../../lib/components/table';
import TableBody from '../../../lib/components/table-body';
import TableCell from '../../../lib/components/table-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableHeaderRow from '../../../lib/components/table-header-row';
import TableRoot, { TableRootProps } from '../../../lib/components/table-root';
import TableRow, { TableRowProps } from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';

import bodyCellStyles from '../../../lib/components/table/body-cell/styles.css.js';
import legacyHeaderCellStyles from '../../../lib/components/table/header-cell/styles.css.js';
import cellStyles from '../../../lib/components/table-cell/styles.css.js';
import headerCellStyles from '../../../lib/components/table-header-cell/styles.css.js';

// Proves the row `variant` is purely visual and reaches the cell paint through context, sets no
// `aria-selected` (selection is conveyed by the selection control), that the narrowed inline `positionStyle`
// props (for virtualization) reach the body and row roots, and that `disablePaddings` reaches the
// padding opt-out on the cell content and header-cell root.
//
// On this fork a selected row emits `data-awsui-variant-selected` on the <tr> (a shaded row emits
// `data-awsui-variant-shaded`) — the one sanctioned styling hook — and the cell stylesheet reads it to paint the
// background and draw the selection outline (a layout-neutral `::after` ring) and to merge consecutive
// selected rows via sibling adjacency. It is driven by `variant`, never a public prop. A shaded row still
// reuses the existing Table's `.body-cell-shaded` background class. Selection and shading are mutually
// exclusive by type.

function Harness({ variant }: { variant?: TableRowProps.Variant }) {
  return (
    <TableRoot ariaLabel="Resources">
      <TableHead>
        <TableHeaderRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableHeaderRow>
      </TableHead>
      <TableBody>
        <TableRow variant={variant}>
          <TableCell>Resource 0</TableCell>
          <TableCell>Available</TableCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

function renderHarness(variant?: TableRowProps.Variant) {
  const { container } = render(<Harness variant={variant} />);
  return { wrapper: createWrapper(container) };
}

function cellClassLists(wrapper: ReturnType<typeof createWrapper>) {
  return wrapper.findAllTableCells().map(cell => cell.getElement().classList);
}

describe('TableRow variant is visual-only and paints through the cell', () => {
  test("variant='selected' paints every cell selected, emits the data-awsui-variant-selected adjacency hook, and sets no aria-selected", () => {
    const { wrapper } = renderHarness('selected');
    const row = wrapper.findAllTableRows()[0].getElement();
    // Visual state must NOT leak into ARIA; selection is conveyed by the selection control.
    expect(row).not.toHaveAttribute('aria-selected');
    // The one sanctioned styling hook: data-awsui-variant-selected drives the consecutive-selected outline merge.
    expect(row).toHaveAttribute('data-awsui-variant-selected', 'true');
    expect(row).not.toHaveAttribute('data-awsui-variant-shaded');
    // Selection paints via the row's data-awsui-variant-selected hook (background + ::after ring), not by reusing
    // the existing Table's body-cell-selected — so no per-cell selection/has-selection class is emitted.
    for (const classList of cellClassLists(wrapper)) {
      expect(classList.contains(bodyCellStyles['body-cell-selected'])).toBe(false);
      expect(classList.contains(bodyCellStyles['has-selection'])).toBe(false);
      expect(classList.contains(bodyCellStyles['body-cell-shaded'])).toBe(false);
    }
  });

  test("variant='shaded' paints every cell shaded and never selected", () => {
    const { wrapper } = renderHarness('shaded');
    const row = wrapper.findAllTableRows()[0].getElement();
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).not.toHaveAttribute('data-awsui-variant-selected');
    // data-awsui-variant-shaded drives the striped-row divider darkening (sibling adjacency), mirroring data-awsui-variant-selected.
    expect(row).toHaveAttribute('data-awsui-variant-shaded', 'true');
    for (const classList of cellClassLists(wrapper)) {
      expect(classList.contains(bodyCellStyles['body-cell-shaded'])).toBe(true);
      expect(classList.contains(bodyCellStyles['body-cell-selected'])).toBe(false);
      expect(classList.contains(bodyCellStyles['has-selection'])).toBe(false);
    }
  });

  test('the default variant paints neither and sets no aria-selected or data-awsui-variant-selected', () => {
    const { wrapper } = renderHarness();
    const row = wrapper.findAllTableRows()[0].getElement();
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).not.toHaveAttribute('data-awsui-variant-selected');
    for (const classList of cellClassLists(wrapper)) {
      expect(classList.contains(bodyCellStyles['body-cell-selected'])).toBe(false);
      expect(classList.contains(bodyCellStyles['body-cell-shaded'])).toBe(false);
    }
  });

  test('a consumer-passed data-awsui-variant-* cannot spoof the selection/shading hooks; variant is authoritative', () => {
    const { container } = render(
      <TableRoot columnLayout={{ type: 'grid', columns: [{ size: 200 }] }} ariaLabel="Resources">
        <TableBody>
          <TableRow {...({ 'data-awsui-variant-selected': 'true', 'data-awsui-variant-shaded': 'true' } as object)}>
            <TableCell>Spoof</TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const row = createWrapper(container).findAllTableRows()[0].getElement();
    // variant defaults to 'default', so both reserved hooks must be absent despite the consumer values.
    expect(row).not.toHaveAttribute('data-awsui-variant-selected');
    expect(row).not.toHaveAttribute('data-awsui-variant-shaded');
  });

  test('a TableCell rendered outside any TableRow falls back to the default (unpainted) variant', () => {
    // Guards the RowVariantContext default so a stray cell never paints itself selected/shaded.
    const { container } = render(
      <TableRoot ariaLabel="Resources">
        <TableBody>
          <tr>
            <TableCell>Loose</TableCell>
          </tr>
        </TableBody>
      </TableRoot>
    );
    const classList = createWrapper(container).findAllTableCells()[0].getElement().classList;
    expect(classList.contains(bodyCellStyles['body-cell-selected'])).toBe(false);
    expect(classList.contains(bodyCellStyles['body-cell-shaded'])).toBe(false);
  });
});

describe('inline style props (virtualization)', () => {
  const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 100 }];

  test('TableBody and TableRow apply their narrowed inline style to their roots', () => {
    const { container } = render(
      <TableRoot columnLayout={{ type: 'grid', columns: COLUMNS }} ariaLabel="Log">
        <TableHead>
          <TableHeaderRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableHeaderRow>
        </TableHead>
        <TableBody positionStyle={{ position: 'relative', height: 400 }}>
          <TableRow positionStyle={{ position: 'absolute', transform: 'translateY(40px)', height: 40 }}>
            <TableCell>Row</TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const wrapper = createWrapper(container);
    const body = wrapper.findTableBody()!.getElement() as HTMLElement;
    expect(body.style.position).toBe('relative');
    expect(body.style.height).toBe('400px');

    const row = wrapper.findAllTableRows()[0].getElement() as HTMLElement;
    expect(row.style.position).toBe('absolute');
    expect(row.style.transform).toBe('translateY(40px)');
    // The row keeps its shared grid template alongside the consumer's positioning style.
    expect(row.style.gridTemplateColumns).toBe('100px');
  });
});

describe('disablePaddings', () => {
  test('TableCell content opts into padding unless disablePaddings is set (mutually exclusive)', () => {
    const { container } = render(
      <TableRoot ariaLabel="Resources">
        <TableBody>
          <TableRow>
            <TableCell disablePaddings={true}>Control</TableCell>
            <TableCell>Resource 0</TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const cells = createWrapper(container).findAllTableCells();
    // Padding is opt-in on the inner `.body-cell-content` wrapper: `with-paddings` normally, the
    // `disable-paddings` overflow opt-out when disablePaddings is set — never both.
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
          <TableHeaderRow>
            <TableHeaderCell disablePaddings={true} />
            <TableHeaderCell>Name</TableHeaderCell>
          </TableHeaderRow>
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
            <TableCell isRowHeader={true}>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const cell = createWrapper(container).findAllTableCells()[0].getElement();
    expect(cell.tagName).toBe('TH');
    expect(cell).toHaveAttribute('scope', 'row');
    expect(cell).toHaveAttribute('role', 'rowheader');
  });

  test('renders a row header as a native <th scope="row"> without an explicit role in auto mode', () => {
    const { container } = render(
      <TableRoot ariaLabel="Resources">
        <TableBody>
          <TableRow>
            <TableCell isRowHeader={true}>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const cell = createWrapper(container).findAllTableCells()[0].getElement();
    expect(cell.tagName).toBe('TH');
    expect(cell).toHaveAttribute('scope', 'row');
    expect(cell).not.toHaveAttribute('role');
  });
});

describe('nested content is insulated from the table/row context', () => {
  test('a classic Table nested in a selected grid cell inherits neither the outer grid layout nor the selected variant', () => {
    const { container } = render(
      <TableRoot columnLayout={{ type: 'grid', columns: [{ size: 400 }] }} ariaLabel="Outer">
        <TableBody>
          <TableRow variant="selected">
            <TableCell>
              <Table columnDefinitions={[{ id: 'v', header: 'V', cell: item => item.v }]} items={[{ v: 'nested' }]} />
            </TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    // The existing Table resets both atomic contexts at its root, so its own cells read auto layout and
    // default variant — the outer grid class and selected paint do not leak into the nested table.
    const nestedCell = createWrapper(container).findTable()!.findBodyCell(1, 1)!.getElement();
    expect(nestedCell.classList.contains(cellStyles['cell-grid'])).toBe(false);
    expect(nestedCell.classList.contains(bodyCellStyles['body-cell-selected'])).toBe(false);
  });
});
