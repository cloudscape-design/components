// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TableBody from '../../../lib/components/table-body';
import TableCell from '../../../lib/components/table-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableHeaderRow from '../../../lib/components/table-header-row';
import TableRoot, { TableRootProps } from '../../../lib/components/table-root';
import TableRow, { TableRowProps } from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';

import cellStyles from '../../../lib/components/table-cell/styles.css.js';
import headerCellStyles from '../../../lib/components/table-header-cell/styles.css.js';

// Proves the row `variant` reaches its data-* style hooks and accessibility state, and that the
// narrowed inline `style` props (for virtualization) reach the body and row elements:
//   variant='selected' -> data-selected; variant='shaded' -> data-shaded; default -> neither.
// aria-selected is set only via the separate ariaSelected prop. Selection and shading are mutually
// exclusive by type, so a row is never both. The data-* attributes gate the shared cell-layer
// selection/shaded paint (see table-cell/styles.scss).

function Harness({ variant, ariaSelected }: { variant?: TableRowProps.Variant; ariaSelected?: boolean }) {
  return (
    <TableRoot ariaLabel="Resources">
      <TableHead>
        <TableHeaderRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableHeaderRow>
      </TableHead>
      <TableBody>
        <TableRow variant={variant} ariaSelected={ariaSelected}>
          <TableCell>Resource 0</TableCell>
          <TableCell>Available</TableCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

function renderHarness(variant?: TableRowProps.Variant, ariaSelected?: boolean) {
  const { container } = render(<Harness variant={variant} ariaSelected={ariaSelected} />);
  return { wrapper: createWrapper(container) };
}

describe('TableRow variant (visual only) and ariaSelected', () => {
  test("variant='selected' sets data-selected but does NOT set aria-selected on its own", () => {
    const { wrapper } = renderHarness('selected');
    const row = wrapper.findAllTableRows()[0].getElement();
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).toHaveAttribute('data-selected', 'true');
    expect(row).not.toHaveAttribute('data-shaded');
  });

  test("variant='shaded' sets data-shaded and no aria-selected", () => {
    const { wrapper } = renderHarness('shaded');
    const row = wrapper.findAllTableRows()[0].getElement();
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).toHaveAttribute('data-shaded', 'true');
    expect(row).not.toHaveAttribute('data-selected');
  });

  test('the default variant sets neither hook and no aria-selected', () => {
    const { wrapper } = renderHarness();
    const row = wrapper.findAllTableRows()[0].getElement();
    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).not.toHaveAttribute('data-selected');
    expect(row).not.toHaveAttribute('data-shaded');
  });

  test('ariaSelected drives aria-selected independently of variant', () => {
    const selected = renderHarness('selected', true).wrapper.findAllTableRows()[0].getElement();
    expect(selected).toHaveAttribute('aria-selected', 'true');
    expect(selected).toHaveAttribute('data-selected', 'true');

    const notSelected = renderHarness('default', false).wrapper.findAllTableRows()[0].getElement();
    expect(notSelected).toHaveAttribute('aria-selected', 'false');
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
        <TableBody style={{ position: 'relative', height: 400 }}>
          <TableRow style={{ position: 'absolute', transform: 'translateY(40px)', height: 40 }}>
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
  test('TableCell applies the no-padding hook only when disablePaddings is set', () => {
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
    expect(cells[0].getElement().classList.contains(cellStyles['disable-paddings'])).toBe(true);
    expect(cells[1].getElement().classList.contains(cellStyles['disable-paddings'])).toBe(false);
  });

  test('TableHeaderCell applies the no-padding hook only when disablePaddings is set', () => {
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
    expect(headerCells[0].getElement().classList.contains(headerCellStyles['disable-paddings'])).toBe(true);
    expect(headerCells[1].getElement().classList.contains(headerCellStyles['disable-paddings'])).toBe(false);
  });
});
