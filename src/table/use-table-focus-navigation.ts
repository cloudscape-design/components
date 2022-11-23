// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { TableProps } from './interfaces';

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
 */
function useTableFocusNavigation<T extends { editConfig?: TableProps.EditConfig<any, any> }>(
  enable: boolean,
  tableRoot: MutableRefObject<any> | null,
  columnDefinitions: Readonly<T[]>,
  numRows: number
) {
  const currentFocusCell = useRef<[number, number] | null>(null);

  const focusableColumns = useMemo(() => columnDefinitions.map(column => !!column.editConfig), [columnDefinitions]);

  const focusCell = useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (tableRoot?.current) {
        iterateTableCells(tableRoot.current, (cell, rIndex, cIndex) => {
          if (rIndex === rowIndex && cIndex === columnIndex) {
            currentFocusCell.current = [rowIndex, columnIndex];
            cell.querySelector('button')?.focus();
          }
        });
      }
    },
    [tableRoot]
  );

  const shiftFocus = useCallback(
    (vertical: -1 | 0 | 1 = 0, horizontal: -1 | 0 | 1 = 0) => {
      if (!currentFocusCell.current) {
        return;
      }
      const [rowIndex, columnIndex] = currentFocusCell.current.slice();
      let newRowIndex = rowIndex;
      let newColumnIndex = columnIndex;

      if (vertical !== 0) {
        newRowIndex = Math.min(numRows, Math.max(rowIndex + vertical, 0));
      }

      if (horizontal !== 0) {
        newColumnIndex = columnIndex;
        while (newColumnIndex >= 0 && newColumnIndex < columnDefinitions.length) {
          newColumnIndex += horizontal;
          if (focusableColumns[newColumnIndex]) {
            break;
          }
        }
      }

      if (
        (rowIndex !== newRowIndex || columnIndex !== newColumnIndex) &&
        currentFocusCell.current &&
        tableRoot?.current
      ) {
        focusCell(newRowIndex, newColumnIndex);
      }
    },
    [columnDefinitions.length, focusCell, focusableColumns, numRows, tableRoot]
  );

  const handleArrowKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      const abort =
        !!tableRoot?.current?.querySelector('[data-inline-editing-active = "true"]') ||
        !document.activeElement?.closest('[data-inline-editing-active]');

      if (abort) {
        return;
      }
      switch (event.key) {
        case 'ArrowUp':
          shiftFocus(-1, 0);
          break;
        case 'ArrowDown':
          shiftFocus(1, 0);
          break;
        case 'ArrowLeft':
          shiftFocus(0, -1);
          break;
        case 'ArrowRight':
          shiftFocus(0, 1);
          break;
        default:
          return;
      }
    },
    [shiftFocus, tableRoot]
  );

  useEffect(() => {
    const eventListeners = new Map<[number, number], { focusin(evt: any): void }>();
    if (tableRoot?.current) {
      if (enable) {
        iterateTableCells(tableRoot!.current, (cell, rowIndex, cellIndex) => {
          if (!focusableColumns[cellIndex]) {
            return;
          }
          const listenerFns = {
            focusin: () => {
              currentFocusCell.current = [rowIndex, cellIndex];
            },
          };
          eventListeners.set([rowIndex, cellIndex], listenerFns);
          cell.addEventListener('focusin', listenerFns.focusin, { passive: true });
        });
        tableRoot.current.addEventListener('keydown', handleArrowKeyEvents, { passive: true });
      } else {
        iterateTableCells(tableRoot.current, (cell, rowIndex, columnIndex) => {
          const listeners = eventListeners.get([rowIndex, columnIndex]);
          if (listeners?.focusin) {
            cell.removeEventListener('focusin', listeners.focusin);
          }
        });
        tableRoot.current.removeEventListener('keydown', handleArrowKeyEvents);
      }
    }
  }, [enable, focusableColumns, handleArrowKeyEvents, tableRoot]);
}

export default useTableFocusNavigation;
