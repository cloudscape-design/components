// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useEffect, useMemo } from 'react';
import {
  defaultIsSuppressed,
  findTableRowByAriaRowIndex,
  findTableRowCellByAriaColIndex,
  getClosestCell,
} from './utils';
import { FocusedCell, GridNavigationProps } from './interfaces';
import { KeyCode } from '../../internal/keycode';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { nodeBelongs } from '../../internal/utils/node-belongs';
import { getAllFocusables } from '../../internal/components/focus-lock/utils';
import {
  SingleTabStopNavigationContext,
  FocusableChangeHandler,
} from '../../internal/context/single-tab-stop-navigation-context';

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
    <SingleTabStopNavigationContext.Provider
      value={{
        navigationActive: keyboardNavigation,
        registerFocusable: gridNavigation.registerFocusable,
      }}
    >
      {children}
    </SingleTabStopNavigationContext.Provider>
  );
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
  private focusables = new Map<Element, boolean>();
  private focusHandlers = new Map<Element, FocusableChangeHandler>();
  private focusTarget: null | Element = null;

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
      [...this.focusables.keys()].forEach(this.unregisterFocusable);
    };
  }

  public cleanup() {
    // Do nothing before initialized.
  }

  public update({ pageSize }: { pageSize: number }) {
    this._pageSize = pageSize;
  }

  public refresh() {
    // Timeout ensures the newly rendered content elements are registered.
    setTimeout(() => {
      if (this._table) {
        // Update focused cell indices in case table rows, columns, or firstIndex change.
        this.updateFocusedCell(this.focusedCell?.element);
        this.updateFocusTarget();
      }
    }, 0);
  }

  public registerFocusable = (focusable: Element, changeHandler: FocusableChangeHandler) => {
    this.focusables.set(focusable, false);
    this.focusHandlers.set(focusable, changeHandler);
    const isFocusable = this.focusTarget === focusable || this.isSuppressed(focusable);
    if (isFocusable) {
      this.focusables.set(focusable, isFocusable);
      changeHandler(isFocusable);
    }
    return () => this.unregisterFocusable(focusable);
  };

  public unregisterFocusable = (focusable: Element) => {
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

  private onFocusin = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    this.updateFocusedCell(event.target);
    if (!this.focusedCell) {
      return;
    }

    this.updateFocusTarget();

    // Focusing on cell is not eligible when it contains focusable elements in the content.
    // If content focusables are available - move the focus to the first one.
    const cellElement = getClosestCell(this.focusedCell.element);
    if (this.focusedCell.element === cellElement) {
      this.getFocusablesFrom(cellElement)[0]?.focus();
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

    if (this.isSuppressed(document.activeElement) || !this.isRegistered(document.activeElement)) {
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
    this.focusTarget = this.getSingleFocusable();
    for (const [focusableElement, isFocusable] of this.focusables) {
      const newIsFocusable = this.focusTarget === focusableElement || this.isSuppressed(focusableElement);
      if (newIsFocusable !== isFocusable) {
        this.focusables.set(focusableElement, newIsFocusable);
        this.focusHandlers.get(focusableElement)!(newIsFocusable);
      }
    }
  }

  private isSuppressed(element: null | Element) {
    return !element || defaultIsSuppressed(element);
  }

  private isRegistered(element: null | Element) {
    return !element || this.focusables.has(element);
  }

  private updateFocusedCell(focusedElement?: HTMLElement): void {
    if (!focusedElement) {
      return;
    }

    const cellElement = getClosestCell(focusedElement);
    const rowElement = cellElement?.closest('tr');
    if (!cellElement || !rowElement) {
      return;
    }

    const colIndex = parseInt(cellElement.getAttribute('aria-colindex') ?? '');
    const rowIndex = parseInt(rowElement.getAttribute('aria-rowindex') ?? '');
    if (isNaN(colIndex) || isNaN(rowIndex)) {
      return;
    }

    const cellFocusables = this.getFocusablesFrom(cellElement);
    const elementIndex = cellFocusables.indexOf(focusedElement);
    this.focusedCell = { rowIndex, colIndex, element: focusedElement, elementIndex };
  }

  private getNextFocusable(from: FocusedCell, delta: { y: number; x: number }) {
    // Find next row to move focus into (can be null if the top/bottom is reached).
    const targetAriaRowIndex = from.rowIndex + delta.y;
    const targetRow = findTableRowByAriaRowIndex(this.table, targetAriaRowIndex, delta.y);
    if (!targetRow) {
      return null;
    }

    // Return next interactive cell content element if available.
    const cellElement = getClosestCell(from.element);
    const cellFocusables = cellElement ? this.getFocusablesFrom(cellElement) : [];
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
    if (targetCell === cellElement && delta.x !== 0) {
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
    return getAllFocusables(target).filter(el => this.focusables.has(el));
  }
}
