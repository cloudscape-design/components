// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Table from '../../../lib/components/table';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell, { TableHeaderCellProps } from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';

import tableHeaderCellStyles from '../../../lib/components/table/header-cell/styles.css.js';
import styles from '../../../lib/components/table-header-cell/styles.css.js';

describe('TableHeaderCell disablePaddings', () => {
  test.each<[TableHeaderCellProps['disablePaddings'], boolean]>([
    [undefined, false],
    [false, false],
    [true, true],
  ])('disablePaddings=%p removes the cell paddings: %p', (disablePaddings, removed) => {
    const cell = renderHeaderCell(disablePaddings);
    expect(cell.classList.contains(styles['disable-paddings'])).toBe(removed);
    expect(cell.classList.contains(tableHeaderCellStyles['with-paddings'])).toBe(!removed);
  });

  test('keeps the content wrapper around a header button', () => {
    const cell = renderHeaderCell(true, <button type="button">Name</button>);
    expect(cell.firstElementChild).toHaveClass(styles['header-cell-content']);
    expect(cell.firstElementChild!.firstElementChild!.tagName).toBe('BUTTON');
  });
});

// The existing Table renders its headers through the same cell, without the content wrapper, and keeps its padding.
describe('existing Table header cell', () => {
  test('keeps the cell padding and does not remove it', () => {
    const { container } = render(
      <Table
        items={[{ id: 1 }]}
        columnDefinitions={[
          { id: 'id', header: 'Id', cell: item => item.id, sortingField: 'id' },
          { id: 'other', header: 'Other', cell: item => item.id },
        ]}
        ariaLabels={{ tableLabel: 'Items' }}
      />
    );
    const headers = createWrapper(container).findTable()!.findColumnHeaders();
    expect(headers).toHaveLength(2);
    headers.forEach(header => {
      const element = header.getElement();
      expect(element).toHaveClass(tableHeaderCellStyles['with-paddings']);
      expect(element).not.toHaveClass(styles['disable-paddings']);
      expect(element.querySelector(`.${styles['header-cell-content']}`)).toBeNull();
    });
  });
});

function renderHeaderCell(
  disablePaddings: TableHeaderCellProps['disablePaddings'],
  children: React.ReactNode = 'Name'
) {
  const { container } = render(
    <TableRoot ariaLabel="Resources">
      <TableHead>
        <TableRow>
          <TableHeaderCell disablePaddings={disablePaddings}>{children}</TableHeaderCell>
        </TableRow>
      </TableHead>
    </TableRoot>
  );
  return createWrapper(container).findTableHeaderCell()!.getElement();
}
