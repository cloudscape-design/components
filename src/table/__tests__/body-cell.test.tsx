// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TableBodyCell, TableBodyCellProps } from '../../../lib/components/table/body-cell';
import { TableProps } from '../interfaces';
import { renderHook } from '../../__tests__/render-hook';
import { useStickyColumns } from '../../../lib/components/table/sticky-columns';
import wrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/table/body-cell/styles.selectors.js';

const tableRole = 'table';

const testItem = {
  test: 'testData',
};

const stickyCellRef = jest.fn();

jest.mock('../../../lib/components/table/sticky-columns', () => ({
  ...jest.requireActual('../../../lib/components/table/sticky-columns'),
  useStickyCellStyles: () => ({ ref: stickyCellRef }),
}));

afterEach(() => {
  stickyCellRef.mockReset();
});

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

type TestBodyCellProps = TableBodyCellProps<typeof testItem> & {
  isEditable: boolean;
};

const commonProps: TestBodyCellProps = {
  column: column,
  item: testItem,
  isEditing: false,
  successfulEdit: false,
  onEditStart: onEditStart,
  onEditEnd: onEditEnd,
  isEditable: true,
  isPrevSelected: false,
  isNextSelected: false,
  isFirstRow: true,
  isLastRow: true,
  isSelected: false,
  wrapLines: false,
  stickyState: result.current,
  columnId: 'id',
  colIndex: 0,
  tableRole: tableRole,
  ariaLabels: {
    activateEditLabel: (column, item) => `Edit ${item.test} ${column.id}`,
    cancelEditLabel: () => 'cancel edit',
    submitEditLabel: () => 'submit edit',
    successfulEditLabel: () => 'edit successful',
  },
};

const TestComponent = ({ isEditing = false, successfulEdit = false, ...rest }: Partial<TestBodyCellProps>) => {
  return (
    <table>
      <tbody>
        <tr>
          <TableBodyCell<typeof testItem>
            {...commonProps}
            {...rest}
            isEditing={isEditing}
            successfulEdit={successfulEdit}
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
          <TableBodyCell<typeof testItem> {...commonProps} column={column} isEditing={true} isEditable={true} />
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

  it('should call sticky columns ref on mount and unmount', () => {
    const { unmount } = render(<TestComponent />);

    expect(stickyCellRef).toHaveBeenCalledWith(expect.any(HTMLTableCellElement));

    unmount();

    expect(stickyCellRef).toHaveBeenCalledWith(null);
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

  describe('disable inline edit', () => {
    const disableInlineEditColumn = {
      ...column,
      editConfig: {
        ...column.editConfig,
        disabledReason: (item: typeof testItem) => (item.test === 'testData' ? 'Cannot edit' : undefined),
        editingCell: () => <input />,
      },
    };

    test('can show disabled reason for disabled edit cells', () => {
      render(<TestComponent {...commonProps} column={disableInlineEditColumn} />);

      const disabledButton = screen.getByRole('button', { name: 'Edit testData test' });
      expect(disabledButton).toHaveAccessibleDescription('Cannot edit');
      expect(disabledButton).toHaveAttribute('aria-disabled');
    });

    test('activates live region when disabled cell is activated', () => {
      const { container } = render(
        <TestComponent {...commonProps} column={disableInlineEditColumn} isEditing={true} />
      );

      const disabledButton = screen.getByRole('button', { name: 'Edit testData test' });
      expect(disabledButton).toHaveAccessibleDescription('Cannot edit');
      expect(disabledButton).toHaveAttribute('aria-disabled');

      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toHaveTextContent('Cannot edit');
    });

    test('dynamically disables inline edit based on disabledReason callback', () => {
      const { rerender } = render(<TestComponent {...commonProps} column={disableInlineEditColumn} />);

      // Show disabled reason when the callback returns a string
      expect(screen.getByRole('button', { description: 'Cannot edit' })).toBeInTheDocument();

      // Don't show a disabled reason when the callback returns undefined
      rerender(
        <TestComponent
          {...commonProps}
          column={{
            ...disableInlineEditColumn,
            editConfig: {
              ...disableInlineEditColumn.editConfig,
              disabledReason: item => (item.test === 'nomatch' ? 'Cannot edit' : undefined),
            },
          }}
        />
      );
      expect(screen.queryByRole('button', { description: 'Cannot edit' })).toBeNull();
    });

    test('click activates the popover state', () => {
      const onEditStartMock = jest.fn();
      const { container } = render(
        <TestComponent {...commonProps} onEditStart={onEditStartMock} column={disableInlineEditColumn} />
      );

      // Click on the TD itself
      fireEvent.click(container.querySelector('[data-inline-editing-active]')!);
      expect(onEditStartMock).toBeCalled();
    });

    test('popover can be dismissed by clicking away', () => {
      const onEditEndMock = jest.fn();
      render(
        <div>
          <button data-testid="outside">Click away</button>
          <TestComponent {...commonProps} onEditEnd={onEditEndMock} column={disableInlineEditColumn} isEditing={true} />
        </div>
      );

      // Click away
      fireEvent.click(screen.getByTestId('outside'));
      expect(onEditEndMock).toBeCalledWith(true);
    });

    test('popover can be dismissed by pressing Escape', () => {
      const onEditEndMock = jest.fn();
      render(
        <TestComponent {...commonProps} onEditEnd={onEditEndMock} column={disableInlineEditColumn} isEditing={true} />
      );

      const disabledButton = screen.getByRole('button');
      fireEvent.focus(disabledButton);
      fireEvent.keyDown(disabledButton, { key: 'Escape' });
      expect(onEditEndMock).toBeCalledWith(true);
    });

    test('show and hide lock icon based on hover when popover is not visible', () => {
      const { container } = render(<TestComponent {...commonProps} column={disableInlineEditColumn} />);

      // No icon by default
      expect(wrapper(container).findIcon()).toBeNull();

      // Hover over TD element
      fireEvent.mouseEnter(container.querySelector('[data-inline-editing-active]')!);
      expect(wrapper(container).findIcon()).not.toBeNull();

      // Remove mouse
      fireEvent.mouseLeave(container.querySelector('[data-inline-editing-active]')!);
      expect(wrapper(container).findIcon()).toBeNull();
    });
  });
});
