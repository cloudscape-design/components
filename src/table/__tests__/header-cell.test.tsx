// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { TableHeaderCell, TableHeaderCellProps } from '../../../lib/components/table/header-cell';
import { TableProps } from '../interfaces';
import { renderHook } from '../../__tests__/render-hook';

import styles from '../../../lib/components/table/header-cell/styles.css.js';
import resizerStyles from '../../../lib/components/table/resizer/styles.css.js';
import { useStickyColumns } from '../../../lib/components/table/sticky-columns';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { renderWithSingleTabStopNavigation } from '../../internal/context/__tests__/utils';

const tableRole = 'table';

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

function TestComponent(props: Partial<TableHeaderCellProps<typeof testItem>>) {
  return (
    <TableHeaderCell<typeof testItem>
      column={column}
      colIndex={0}
      tabIndex={0}
      updateColumn={() => {}}
      onClick={() => {}}
      onResizeFinish={() => {}}
      stickyState={result.current}
      columnId="id"
      cellRef={() => {}}
      tableRole={tableRole}
      {...props}
    />
  );
}

it('renders a fake focus outline on the sort control', () => {
  const { container } = render(
    <TableWrapper>
      <TestComponent focusedComponent="sorting-control-id" />
    </TableWrapper>
  );
  // Activate focus-visible
  fireEvent.keyDown(document.body, { key: 'Tab', keyCode: 65 });
  expect(container.querySelector(`.${styles['header-cell-fake-focus']}`)).toBeInTheDocument();
});

it('renders a fake focus outline on the resize control', () => {
  const { container } = render(
    <TableWrapper>
      <TestComponent focusedComponent="resize-control-id" resizableColumns={true} />
    </TableWrapper>
  );
  // Activate focus-visible
  fireEvent.keyDown(document.body, { key: 'Tab', keyCode: 65 });
  expect(container.querySelector(`.${resizerStyles['has-focus']}`)).toBeInTheDocument();
});

describe('i18n', () => {
  it('supports using editIconAriaLabel from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider messages={{ table: { 'columnDefinitions.editConfig.editIconAriaLabel': 'Custom editable' } }}>
        <TableWrapper>
          <TestComponent column={{ ...column, editConfig: undefined }} resizableColumns={true} isEditable={true} />
        </TableWrapper>
      </TestI18nProvider>
    );
    expect(container.querySelector(`.${styles['edit-icon']}`)).toHaveAttribute('aria-label', 'Custom editable');
  });

  test('does not set tab index when negative', () => {
    const { setCurrentTarget } = renderWithSingleTabStopNavigation(<TestComponent />, {
      navigationActive: true,
    });
    const headerCell = document.querySelector('th')!;

    expect(headerCell).not.toHaveAttribute('tabIndex');
    setCurrentTarget(headerCell);
    expect(headerCell).toHaveAttribute('tabIndex', '0');
    setCurrentTarget(null);
    expect(headerCell).not.toHaveAttribute('tabIndex');
  });
});
