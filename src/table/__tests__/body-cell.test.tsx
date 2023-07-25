// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TableBodyCell } from '../../../lib/components/table/body-cell';
import { TableProps } from '../interfaces';
import { renderHook } from '../../__tests__/render-hook';
import { useStickyColumns } from '../../../lib/components/table/sticky-columns';
import styles from '../../../lib/components/table/body-cell/styles.selectors.js';
import { TableRole } from '../../../lib/components/table/table-role/table-role-helper';

const tableRole = new TableRole('table');

const testItem = {
  test: 'testData',
};

const column: TableProps.ColumnDefinition<typeof testItem> = {
  id: 'test',
  header: 'Test',
  editConfig: {
    ariaLabel: 'test input',
    editIconAriaLabel: 'error',
    editingCell: (item, { setValue, currentValue }: TableProps.CellContext<any>) => {
      return <input type="text" value={currentValue ?? item.test} onChange={e => setValue(e.target.value)} />;
    },
  },
  cell: item => item.test,
};

const onEditEnd = jest.fn();
const onEditStart = jest.fn();

const { result } = renderHook(() =>
  useStickyColumns({ visibleColumns: ['id'], stickyColumnsFirst: 0, stickyColumnsLast: 0 })
);

const TestComponent = ({ isEditing = false, successfulEdit = false }) => {
  return (
    <table>
      <tbody>
        <tr>
          <TableBodyCell<typeof testItem>
            column={column}
            item={testItem}
            isEditing={isEditing}
            onEditStart={onEditStart}
            onEditEnd={onEditEnd}
            ariaLabels={{
              activateEditLabel: (column, item) => `Edit ${item.test} ${column.id}`,
              cancelEditLabel: () => 'cancel edit',
              submitEditLabel: () => 'submit edit',
              successfulEditLabel: () => 'edit successful',
            }}
            isEditable={true}
            isPrevSelected={false}
            isNextSelected={false}
            isFirstRow={true}
            isLastRow={true}
            isSelected={false}
            wrapLines={false}
            stickyState={result.current}
            successfulEdit={successfulEdit}
            columnId="id"
            tableRole={tableRole}
          />
        </tr>
      </tbody>
    </table>
  );
};

const TestComponent2 = ({ column }: any) => {
  return (
    <table>
      <tbody>
        <tr>
          <TableBodyCell<typeof testItem>
            column={column}
            item={testItem}
            isEditing={true}
            onEditStart={onEditStart}
            onEditEnd={onEditEnd}
            ariaLabels={{
              activateEditLabel: () => 'activate edit',
              cancelEditLabel: () => 'cancel edit',
              submitEditLabel: () => 'submit edit',
            }}
            isEditable={true}
            isPrevSelected={false}
            isNextSelected={false}
            isFirstRow={true}
            isLastRow={true}
            isSelected={false}
            wrapLines={false}
            stickyState={result.current}
            columnId="id"
            tableRole={tableRole}
          />
        </tr>
      </tbody>
    </table>
  );
};

describe('TableBodyCell', () => {
  it('should render', () => {
    const { container } = render(<TestComponent />);
    expect(container.querySelector('td')).toBeInTheDocument();
  });

  it('should call onEditStart', () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit testData test' }));
    expect(onEditStart).toHaveBeenCalled();
  });

  it('should call onEditEnd', () => {
    render(<TestComponent isEditing={true} />);
    fireEvent.click(screen.getByRole('button', { name: 'submit edit' }));
    expect(onEditEnd).toHaveBeenCalled();
  });

  it('should call onEditEnd with value when submitting', () => {
    const { container } = render(<TestComponent isEditing={true} />);
    fireEvent.change(container.querySelector('input')!, { target: { value: 'test2' } });
    fireEvent.click(screen.getByRole('button', { name: 'submit edit' }));
    expect(onEditEnd).toHaveBeenCalled();
  });

  it('should call onEditEnd with value when cancelling', () => {
    const { container } = render(<TestComponent isEditing={true} />);
    fireEvent.change(container.querySelector('input')!, { target: { value: 'test2' } });
    fireEvent.click(screen.getByRole('button', { name: 'cancel edit' }));
    expect(onEditEnd).toHaveBeenCalled();
  });

  it('should render with default state at edit start', () => {
    const col: typeof column = {
      ...column,
      editConfig: {
        ...column.editConfig,
        editingCell: (item, { setValue, currentValue }) => {
          // testing default values
          expect(setValue).toBeInstanceOf(Function);
          expect(currentValue).toBeUndefined();
          return <input type="text" value={currentValue ?? item.test} onChange={e => setValue(e.target.value)} />;
        },
      },
    };
    render(<TestComponent2 column={col} />);
  });

  describe('success icon behaviour', () => {
    const bodyCellSuccessIcon$ = `.${styles['body-cell-success']}`;

    test('should not render success icon in default state when edit button is focused', () => {
      const { container } = render(<TestComponent />);
      screen.getByRole('button', { name: 'Edit testData test' }).focus();
      expect(container.querySelector(bodyCellSuccessIcon$)!).not.toBeInTheDocument();
    });

    test('should not render success icon in edit mode', () => {
      const { container } = render(<TestComponent isEditing={true} />);
      expect(container.querySelector(bodyCellSuccessIcon$)!).not.toBeInTheDocument();
    });

    test('should render success icon and live region after a successful edit', () => {
      const { container } = render(<TestComponent successfulEdit={true} />);
      // Success icon is shown when cell is focused.
      screen.getByRole('button', { name: 'Edit testData test' }).focus();

      expect(container.querySelector(bodyCellSuccessIcon$)!).toBeInTheDocument();
      expect(screen.getByText('edit successful')).toBeInTheDocument();
    });

    test('should not render success icon when cell lost focus and get focused again', () => {
      const { container } = render(
        <>
          <TestComponent successfulEdit={true} />
          <a href="#">dummy button</a>
        </>
      );
      // Success icon is shown when cell is focused.
      screen.getByRole('button', { name: 'Edit testData test' }).focus();
      expect(container.querySelector(bodyCellSuccessIcon$)!).toBeInTheDocument();

      // Success icon is hidden when cell lost focus.
      screen.getByText('dummy button').focus();
      expect(container.querySelector(bodyCellSuccessIcon$)!).not.toBeInTheDocument();

      // Cell is focused again.
      screen.getByRole('button', { name: 'Edit testData test' }).focus();
      expect(container.querySelector(bodyCellSuccessIcon$)!).not.toBeInTheDocument();
    });

    test('should not render success icon when edit is cancelled after a successfully edit has been performed', () => {
      // Successful edit has been performed.
      const { container, rerender } = render(<TestComponent successfulEdit={true} />);
      screen.getByRole('button', { name: 'Edit testData test' }).focus();
      expect(container.querySelector(bodyCellSuccessIcon$)!).toBeInTheDocument();

      // Switch into edit mode and click edit button (triggers onEditEnd which hides the success icon).
      rerender(<TestComponent successfulEdit={true} isEditing={true} />);
      fireEvent.click(screen.getByRole('button', { name: 'cancel edit' }));
      expect(onEditEnd).toHaveBeenCalled();
      rerender(<TestComponent successfulEdit={true} />);

      expect(container.querySelector(bodyCellSuccessIcon$)!).not.toBeInTheDocument();
    });

    test('should call onEditStart when success icon is clicked', () => {
      const { container } = render(<TestComponent successfulEdit={true} />);
      // Success icon is shown when cell is focused.
      screen.getByRole('button', { name: 'Edit testData test' }).focus();
      const successIcon = container.querySelector(bodyCellSuccessIcon$)!;
      fireEvent.mouseDown(successIcon);
      expect(onEditStart).toHaveBeenCalled();
    });
  });
});
