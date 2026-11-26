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
  test.each<[TableHeaderCellProps['disablePaddings'], string | null]>([
    [undefined, null],
    [false, null],
    [true, 'disable-paddings'],
    ['headerButton', 'header-button'],
  ])('disablePaddings=%p applies the %s padding mode', (disablePaddings, mode) => {
    const cell = renderHeaderCell(disablePaddings);
    ['disable-paddings', 'header-button'].forEach(other =>
      expect(cell.classList.contains(styles[other])).toBe(other === mode)
    );
  });

  test.each<[TableHeaderCellProps['disablePaddings'], boolean]>([
    [undefined, true],
    [false, true],
    [true, false],
    ['headerButton', false],
  ])("disablePaddings=%p gives the cell the existing Table's cell padding: %p", (disablePaddings, hasPadding) => {
    const cell = renderHeaderCell(disablePaddings);
    expect(cell.classList.contains(tableHeaderCellStyles['with-paddings'])).toBe(hasPadding);
  });

  test('keeps the content wrapper for a header button, which inherits its padding', () => {
    const cell = renderHeaderCell('headerButton', <button type="button">Name</button>);
    expect(cell.firstElementChild).toHaveClass(styles['header-cell-content']);
    expect(cell.firstElementChild!.firstElementChild!.tagName).toBe('BUTTON');
  });
});

// The existing Table renders its headers through the same cell, without the content wrapper. Its header classes are
// what they were before header buttons existed: the cell padding and none of the new padding modes.
describe('existing Table header cell', () => {
  test('keeps the cell padding and has none of the padding modes of the public header cell', () => {
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
      ['disable-paddings', 'header-button'].forEach(mode => expect(element).not.toHaveClass(styles[mode]));
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
