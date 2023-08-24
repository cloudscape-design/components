// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { RefObject, useCallback, useEffect, useMemo } from 'react';
import { scrollElementIntoView } from '../internal/utils/scrollable-containers';
import { TableProps } from './interfaces';
import { TableRole } from './table-role';

function iterateTableCells<T extends HTMLElement>(
  table: T,
  func: (cell: HTMLTableCellElement, rowIndex: number, columnIndex: number) => void
) {
  table.querySelectorAll('tr').forEach((row: HTMLTableRowElement, rowIndex: number) => {
    row.querySelectorAll('td').forEach((cell, cellIndex) => {
      func(cell, rowIndex, cellIndex);
    });
  });
}

/**
 * This hook is used to navigate between table cells using the keyboard arrow keys.
 * All the functionality is implemented in the hook, so the table component does not
 * need to implement any keyboard event handlers.
 * @param enable - Toggle functionality of the hook
 * @param tableRoot - A ref to a table container. Ideally the root element of the table (<table>); tbody is also acceptable.
 * @param columnDefinitions - The column definitions for the table.
 * @param numRows - The number of rows in the table.
 * @param tableRole - Table role to disable the util when "grid" is used.
 */
function useTableFocusNavigation<T extends { editConfig?: TableProps.EditConfig<any> }>(
  selectionType: TableProps['selectionType'],
  tableRoot: RefObject<HTMLTableElement>,
  columnDefinitions: Readonly<T[]>,
  numRows: number,
  tableRole: TableRole
) {
  const focusableColumns = useMemo(() => {
    const cols = columnDefinitions.map(column => !!column.editConfig);
    if (selectionType) {
      cols.unshift(false);
    }
    return cols;
  }, [columnDefinitions, selectionType]);

  const maxColumnIndex = focusableColumns.length - 1;
  const minColumnIndex = selectionType ? 1 : 0;

  const focusCell = useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (tableRoot?.current) {
        iterateTableCells(tableRoot.current, (cell, rIndex, cIndex) => {
          if (rIndex === rowIndex && cIndex === columnIndex) {
            const editButton = cell.querySelector('button:last-child') as HTMLButtonElement | null;

            if (editButton) {
              editButton.focus?.();
              scrollElementIntoView(editButton);
            }
          }
        });
      }
    },
    [tableRoot]
  );

  const shiftFocus = useCallback(
    (vertical: -1 | 0 | 1, horizontal: -1 | 0 | 1) => {
      const focusedCell = tableRoot.current?.querySelector<HTMLTableCellElement>('td:focus-within');
      if (!focusedCell) {
        return;
      }

      const columnIndex = focusedCell.cellIndex;
      const rowIndex = (focusedCell.parentElement as HTMLTableRowElement).rowIndex;

      let newRowIndex = rowIndex;
      let newColumnIndex = columnIndex;

      if (vertical !== 0) {
        newRowIndex = Math.min(numRows, Math.max(rowIndex + vertical, 0));
      }

      if (horizontal !== 0) {
        while (newColumnIndex <= maxColumnIndex && newColumnIndex >= minColumnIndex) {
          newColumnIndex += horizontal;
          if (focusableColumns[newColumnIndex]) {
            break;
          }
        }
      }

      if ((rowIndex !== newRowIndex || columnIndex !== newColumnIndex) && tableRoot.current) {
        focusCell(newRowIndex, newColumnIndex);
      }
    },
    [focusCell, focusableColumns, maxColumnIndex, minColumnIndex, numRows, tableRoot]
  );

  const handleArrowKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      const abort =
        !!tableRoot.current?.querySelector('[data-inline-editing-active = "true"]') ||
        !document.activeElement?.closest('[data-inline-editing-active]');

      if (abort) {
        return;
      }
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          shiftFocus(-1, 0);
          break;
        case 'ArrowDown':
          event.preventDefault();
          shiftFocus(1, 0);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          shiftFocus(0, -1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          shiftFocus(0, 1);
          break;
        // istanbul ignore next (default case = do nothing, not testable)
        default:
          return;
      }
    },
    [shiftFocus, tableRoot]
  );

  useEffect(() => {
    if (!tableRoot.current) {
      return;
    }
    if (tableRole === 'grid') {
      return;
    }
    const tableElement = tableRoot.current;
    tableRoot.current.addEventListener('keydown', handleArrowKeyEvents);

    return () => tableElement && tableElement.removeEventListener('keydown', handleArrowKeyEvents);
  }, [focusableColumns, handleArrowKeyEvents, tableRoot, tableRole]);
}

export default useTableFocusNavigation;
