// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { TableHeaderCell } from '../../../lib/components/table/header-cell';
import { TableProps } from '../interfaces';
import { renderHook } from '../../__tests__/render-hook';

import styles from '../../../lib/components/table/header-cell/styles.css.js';
import resizerStyles from '../../../lib/components/table/resizer/styles.css.js';
import { useStickyColumns } from '../../../lib/components/table/use-sticky-columns';

const testItem = {
  test: 'test',
};

const column: TableProps.ColumnDefinition<typeof testItem> = {
  id: 'test',
  header: 'Test',
  sortingField: 'test',
  editConfig: {
    ariaLabel: 'test input',
    editIconAriaLabel: 'error',
    editingCell: (item, { setValue, currentValue }: TableProps.CellContext<any>) => {
      return <input type="text" value={currentValue ?? item.test} onChange={e => setValue(e.target.value)} />;
    },
  },
  cell: item => item.test,
};

const { result } = renderHook(() =>
  useStickyColumns({ visibleColumns: ['id'], stickyColumnsFirst: 0, stickyColumnsLast: 0 })
);

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <table>
      <thead>
        <tr>{children}</tr>
      </thead>
    </table>
  );
}

it('renders a fake focus outline on the sort control', () => {
  const { container } = render(
    <TableWrapper>
      <TableHeaderCell<typeof testItem>
        focusedComponent={{ type: 'column', col: 0 }}
        column={column}
        colIndex={0}
        tabIndex={0}
        onFocusedComponentChange={() => {}}
        updateColumn={() => {}}
        onClick={() => {}}
        onResizeFinish={() => {}}
        stickyState={result.current}
        columnId="id"
      />
    </TableWrapper>
  );
  // Activate focus-visible
  fireEvent.keyDown(document.body, { key: 'Tab', keyCode: 65 });
  expect(container.querySelector(`.${styles['header-cell-fake-focus']}`)).toBeInTheDocument();
});

it('renders a fake focus outline on the resize control', () => {
  const { container } = render(
    <TableWrapper>
      <TableHeaderCell<typeof testItem>
        focusedComponent={{ type: 'resizer', col: 0 }}
        column={column}
        colIndex={0}
        tabIndex={0}
        resizableColumns={true}
        onFocusedComponentChange={() => {}}
        updateColumn={() => {}}
        onClick={() => {}}
        onResizeFinish={() => {}}
        stickyState={result.current}
        columnId="id"
      />
    </TableWrapper>
  );
  // Activate focus-visible
  fireEvent.keyDown(document.body, { key: 'Tab', keyCode: 65 });
  expect(container.querySelector(`.${resizerStyles['has-focus']}`)).toBeInTheDocument();
});
