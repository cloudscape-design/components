// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { findTableRowByAriaRowIndex, findTableRowCellByAriaColIndex, getFocusableElement } from './utils';
import { FocusableChangeHandler, FocusableDefinition, FocusedCell, GridNavigationProps } from './interfaces';
import { KeyCode } from '../../internal/keycode';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import React, { createContext } from 'react';
import { nodeBelongs } from '../../internal/utils/node-belongs';
import { getAllFocusables } from '../../internal/components/focus-lock/utils';

const GridNavigationContext = createContext<{
  keyboardNavigation: boolean;
  registerFocusable(focusable: FocusableDefinition, handler: FocusableChangeHandler): () => void;
  unregisterFocusable(focusable: FocusableDefinition): void;
}>({
  keyboardNavigation: false,
  registerFocusable: () => () => {},
  unregisterFocusable: () => {},
});

/**
 * Makes table navigable with keyboard commands.
 * See grid-navigation.md
 */
export function GridNavigationProvider({ keyboardNavigation, pageSize, getTable, children }: GridNavigationProps) {
  const gridNavigation = useMemo(() => new GridNavigationProcessor(), []);

  const getTableStable = useStableCallback(getTable);

  // Initialize the processor with the table container assuming it is mounted synchronously and only once.
  useEffect(() => {
    if (keyboardNavigation) {
      const table = getTableStable();
      table && gridNavigation.init(table);
    }
    return () => gridNavigation.cleanup();
  }, [keyboardNavigation, gridNavigation, getTableStable]);

  // Notify the processor of the props change.
  useEffect(() => {
    gridNavigation.update({ pageSize });
  }, [gridNavigation, pageSize]);

  // Notify the processor of the new render.
  useEffect(() => {
    if (keyboardNavigation) {
      gridNavigation.refresh();
    }
  });

  return (
    <GridNavigationContext.Provider
      value={{
        keyboardNavigation,
        registerFocusable: gridNavigation.registerFocusable,
        unregisterFocusable: gridNavigation.unregisterFocusable,
      }}
    >
      {children}
    </GridNavigationContext.Provider>
  );
}

export function GridNavigationSuppressed({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  const parentContext = useContext(GridNavigationContext);
  return (
    <GridNavigationContext.Provider value={active ? { ...parentContext, keyboardNavigation: false } : parentContext}>
      {children}
    </GridNavigationContext.Provider>
  );
}

export function useGridNavigationContext() {
  const { keyboardNavigation, registerFocusable, unregisterFocusable } = useContext(GridNavigationContext);
  const registerFocusableDecorated = useCallback(
    (focusable: FocusableDefinition, changeHandler: FocusableChangeHandler) =>
      keyboardNavigation ? registerFocusable(focusable, changeHandler) : () => {},
    [keyboardNavigation, registerFocusable]
  );
  return { keyboardNavigation, registerFocusable: registerFocusableDecorated, unregisterFocusable };
}

export function useGridNavigationFocusable(
  focusable: FocusableDefinition,
  { navigationSuppressed = false }: { navigationSuppressed?: boolean } = {}
) {
  const { keyboardNavigation, registerFocusable } = useGridNavigationContext();
  const [focusTargetActive, setFocusTargetActive] = useState(false);

  useEffect(() => {
    if (!navigationSuppressed) {
      const changeHandler = (focusTarget: null | HTMLElement) =>
        setFocusTargetActive(getFocusableElement(focusable) === focusTarget);
      return registerFocusable(focusable, changeHandler);
    }
  }, [navigationSuppressed, focusable, registerFocusable]);

  const shouldMuteUserFocus = keyboardNavigation && !focusTargetActive;

  return { keyboardNavigation, shouldMuteUserFocus };
}

/**
 * This helper encapsulates the grid navigation behaviors which are:
 * 1. Responding to keyboard commands and moving the focus accordingly;
 * 2. Muting table interactive elements for only one to be user-focusable at a time;
 * 3. Suppressing the above behaviors when focusing an element inside a dialog or when instructed explicitly.
 */
class GridNavigationProcessor {
  // Props
  private _pageSize = 0;
  private _table: null | HTMLTableElement = null;

  // State
  private focusedCell: null | FocusedCell = null;
  private focusables = new Set<FocusableDefinition>();
  private focusHandlers = new Map<FocusableDefinition, FocusableChangeHandler>();

  public init(table: HTMLTableElement) {
    this._table = table;

    this.table.addEventListener('focusin', this.onFocusin);
    this.table.addEventListener('focusout', this.onFocusout);
    this.table.addEventListener('keydown', this.onKeydown);

    this.updateFocusTarget();

    this.cleanup = () => {
      this.table.removeEventListener('focusin', this.onFocusin);
      this.table.removeEventListener('focusout', this.onFocusout);
      this.table.removeEventListener('keydown', this.onKeydown);
      this.focusables.forEach(this.unregisterFocusable);
    };
  }

  public cleanup() {
    // Do nothing before initialized.
  }

  public update({ pageSize }: { pageSize: number }) {
    this._pageSize = pageSize;
  }

  public refresh() {
    if (this._table) {
      // Update focused cell indices in case table rows, columns, or firstIndex change.
      if (this.focusedCell) {
        this.focusedCell = this.findFocusedCell(this.focusedCell.element);
      }

      this.updateFocusTarget();
    }
  }

  public registerFocusable = (focusable: FocusableDefinition, changeHandler: FocusableChangeHandler) => {
    this.focusables.add(focusable);
    this.focusHandlers.set(focusable, changeHandler);
    return () => this.unregisterFocusable(focusable);
  };

  public unregisterFocusable = (focusable: FocusableDefinition) => {
    this.focusables.delete(focusable);
    this.focusHandlers.delete(focusable);
  };

  private get pageSize() {
    return this._pageSize;
  }

  private get table(): HTMLTableElement {
    if (!this._table) {
      throw new Error('Invariant violation: GridNavigationProcessor is used before initialization.');
    }
    return this._table;
  }

  private isSuppressed(focusedElement: HTMLElement): boolean {
    if (focusedElement instanceof HTMLTableCellElement) {
      return false;
    }
    return !this.getRegisteredElements().has(focusedElement);
  }

  private onFocusin = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const cell = this.findFocusedCell(event.target);
    if (!cell) {
      return;
    }

    this.focusedCell = cell;

    this.updateFocusTarget();

    // Focusing on cell is not eligible when it contains focusable elements in the content.
    // If content focusables are available - move the focus to the first one.
    if (cell.element === cell.cellElement) {
      this.getFocusablesFrom(cell.cellElement)[0]?.focus();
    }
  };

  private onFocusout = () => {
    // When focus leaves the cell and the cell no longer belong to the table it indicates the focused element has been unmounted.
    // In that case the focus needs to be restored on the same coordinates.
    setTimeout(() => {
      if (this.focusedCell && !nodeBelongs(this.table, this.focusedCell.element)) {
        this.moveFocusBy(this.focusedCell, { x: 0, y: 0 });
      }
    }, 0);
  };

  private onKeydown = (event: KeyboardEvent) => {
    if (!this.focusedCell) {
      return;
    }

    const ctrlKey = event.ctrlKey ? 1 : 0;
    const altKey = event.altKey ? 1 : 0;
    const shiftKey = event.shiftKey ? 1 : 0;
    const metaKey = event.metaKey ? 1 : 0;
    const numModifiersPressed = ctrlKey + altKey + shiftKey + metaKey;

    let key = event.keyCode;
    if (numModifiersPressed === 1 && event.ctrlKey) {
      key = -key;
    } else if (numModifiersPressed) {
      return;
    }

    const from = this.focusedCell;
    const minExtreme = Number.NEGATIVE_INFINITY;
    const maxExtreme = Number.POSITIVE_INFINITY;

    // Do not intercept any keys when the navigation is suppressed.
    if (this.isSuppressed(from.element)) {
      return;
    }

    switch (key) {
      case KeyCode.up:
        event.preventDefault();
        return this.moveFocusBy(from, { y: -1, x: 0 });

      case KeyCode.down:
        event.preventDefault();
        return this.moveFocusBy(from, { y: 1, x: 0 });

      case KeyCode.left:
        event.preventDefault();
        return this.moveFocusBy(from, { y: 0, x: -1 });

      case KeyCode.right:
        event.preventDefault();
        return this.moveFocusBy(from, { y: 0, x: 1 });

      case KeyCode.pageUp:
        event.preventDefault();
        return this.moveFocusBy(from, { y: -this.pageSize, x: 0 });

      case KeyCode.pageDown:
        event.preventDefault();
        return this.moveFocusBy(from, { y: this.pageSize, x: 0 });

      case KeyCode.home:
        event.preventDefault();
        return this.moveFocusBy(from, { y: 0, x: minExtreme });

      case KeyCode.end:
        event.preventDefault();
        return this.moveFocusBy(from, { y: 0, x: maxExtreme });

      case -KeyCode.home:
        event.preventDefault();
        return this.moveFocusBy(from, { y: minExtreme, x: minExtreme });

      case -KeyCode.end:
        event.preventDefault();
        return this.moveFocusBy(from, { y: maxExtreme, x: maxExtreme });

      default:
        return;
    }
  };

  private moveFocusBy(cell: FocusedCell, delta: { x: number; y: number }) {
    this.getNextFocusable(cell, delta)?.focus();
  }

  private updateFocusTarget() {
    const focusTarget = this.getSingleFocusable();
    focusTarget && this.notifyFocusHandlers(focusTarget);
  }

  private getRegisteredElements = (): Set<HTMLElement> => {
    const registeredElements = new Set<HTMLElement>();
    for (const focusable of this.focusables) {
      const element = getFocusableElement(focusable);
      if (element) {
        registeredElements.add(element);
      }
    }
    return registeredElements;
  };

  private notifyFocusHandlers(focusTarget: HTMLElement) {
    const focusable = [...this.focusables].find(f => getFocusableElement(f) === focusTarget);
    if (focusable) {
      this.focusHandlers.forEach(handler => handler(focusTarget));
    }
  }

  private findFocusedCell(focusedElement: HTMLElement): null | FocusedCell {
    const cellElement = focusedElement.closest('td,th') as null | HTMLTableCellElement;
    const rowElement = cellElement?.closest('tr');

    if (!cellElement || !rowElement) {
      return null;
    }

    const colIndex = parseInt(cellElement.getAttribute('aria-colindex') ?? '');
    const rowIndex = parseInt(rowElement.getAttribute('aria-rowindex') ?? '');
    if (isNaN(colIndex) || isNaN(rowIndex)) {
      return null;
    }

    const cellFocusables = this.getFocusablesFrom(cellElement);
    const elementIndex = cellFocusables.indexOf(focusedElement);

    return { rowIndex, colIndex, rowElement, cellElement, element: focusedElement, elementIndex };
  }

  private getNextFocusable(from: FocusedCell, delta: { y: number; x: number }) {
    // Find next row to move focus into (can be null if the top/bottom is reached).
    const targetAriaRowIndex = from.rowIndex + delta.y;
    const targetRow = findTableRowByAriaRowIndex(this.table, targetAriaRowIndex, delta.y);
    if (!targetRow) {
      return null;
    }

    // Return next interactive cell content element if available.
    const cellFocusables = this.getFocusablesFrom(from.cellElement);
    const nextElementIndex = from.elementIndex + delta.x;
    if (delta.x && from.elementIndex !== -1 && 0 <= nextElementIndex && nextElementIndex < cellFocusables.length) {
      return cellFocusables[nextElementIndex];
    }

    // Find next cell to focus or move focus into (can be null if the left/right edge is reached).
    const targetAriaColIndex = from.colIndex + delta.x;
    const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.x);
    if (!targetCell) {
      return null;
    }

    // When target cell matches the current cell it means we reached the left or right boundary.
    if (targetCell === from.cellElement && delta.x !== 0) {
      return null;
    }

    // Return cell interactive content or the cell itself.
    const targetCellFocusables = this.getFocusablesFrom(targetCell);
    const focusIndex = delta.x < 0 ? targetCellFocusables.length - 1 : delta.x > 0 ? 0 : from.elementIndex;
    const focusTarget = targetCellFocusables[focusIndex] ?? targetCell;
    return focusTarget;
  }

  private getSingleFocusable() {
    const cell = this.focusedCell;
    const firstTableCell = this.table.querySelector('td,th') as null | HTMLTableCellElement;

    // A single element of the table is made user-focusable.
    // It defaults to the first interactive element of the first cell or the first cell itself otherwise.
    let focusTarget: null | HTMLElement =
      (firstTableCell && this.getFocusablesFrom(firstTableCell)[0]) ?? firstTableCell;

    // When a navigation-focused element is present in the table it is used for user-navigation instead.
    if (cell) {
      focusTarget = this.getNextFocusable(cell, { x: 0, y: 0 });
    }

    return focusTarget;
  }

  private getFocusablesFrom(target: HTMLElement) {
    const registeredElements = this.getRegisteredElements();
    return getAllFocusables(target).filter(el => registeredElements.has(el));
  }
}
