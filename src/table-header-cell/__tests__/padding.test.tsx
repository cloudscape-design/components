// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TableHead from '../../../lib/components/table-head';
import TableHeaderCell, { TableHeaderCellProps } from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';

import tableHeaderCellStyles from '../../../lib/components/table/header-cell/styles.css.js';
import styles from '../../../lib/components/table-header-cell/styles.css.js';

describe('TableHeaderCell disablePaddings', () => {
  test.each<[TableHeaderCellProps['disablePaddings'], string]>([
    [undefined, 'padded-content'],
    [false, 'padded-content'],
    [true, 'disable-paddings'],
    ['headerButton', 'header-button'],
  ])('disablePaddings=%p applies the %s padding mode', (disablePaddings, mode) => {
    const cell = renderHeaderCell(disablePaddings);
    const modes = ['padded-content', 'disable-paddings', 'header-button'];
    modes.forEach(other => expect(cell.classList.contains(styles[other])).toBe(other === mode));
  });

  test.each<TableHeaderCellProps['disablePaddings']>([undefined, true, 'headerButton'])(
    "disablePaddings=%p doesn't apply the existing Table's cell padding",
    disablePaddings => {
      expect(renderHeaderCell(disablePaddings)).not.toHaveClass(tableHeaderCellStyles['with-paddings']);
    }
  );

  test('keeps the content wrapper for a header button, which inherits its padding', () => {
    const cell = renderHeaderCell('headerButton', <button type="button">Name</button>);
    expect(cell.firstElementChild).toHaveClass(styles['header-cell-content']);
    expect(cell.firstElementChild!.firstElementChild!.tagName).toBe('BUTTON');
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
