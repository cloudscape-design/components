// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useEffect, useMemo } from 'react';
import {
  defaultIsSuppressed,
  findTableRowByAriaRowIndex,
  findTableRowCellByAriaColIndex,
  focusNextElement,
  getClosestCell,
  isElementDisabled,
  isTableCell,
} from './utils';
import { FocusedCell, GridNavigationProps } from './interfaces';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { nodeBelongs } from '../../internal/utils/node-belongs';
import { getAllFocusables } from '../../internal/components/focus-lock/utils';
import {
  SingleTabStopNavigationContext,
  FocusableChangeHandler,
} from '../../internal/context/single-tab-stop-navigation-context';
import handleKey, { isEventLike } from '../../internal/utils/handle-key';
import { KeyCode } from '../../internal/keycode';

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
  private keepUserIndex = false;
  private focusables = new Set<Element>();
  private focusHandlers = new Map<Element, FocusableChangeHandler>();
  private focusablesState = new WeakMap<Element, boolean>();
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
    // Timeout ensures the newly rendered content elements are registered.
    setTimeout(() => {
      if (this._table) {
        // Update focused cell indices in case table rows, columns, or firstIndex change.
        this.updateFocusedCell(this.focusedCell?.element);
        this.updateFocusTarget();
      }
    }, 0);
  }

  public registerFocusable = (focusableElement: HTMLElement, changeHandler: FocusableChangeHandler) => {
    this.focusables.add(focusableElement);
    this.focusHandlers.set(focusableElement, changeHandler);
    const isFocusable = this.focusablesState.get(focusableElement) ?? false;
    const newIsFocusable = this.focusTarget === focusableElement || this.isSuppressed(focusableElement);
    if (newIsFocusable !== isFocusable) {
      this.focusablesState.set(focusableElement, newIsFocusable);
      changeHandler(newIsFocusable);
    }
    // When newly registered element belongs to the focused cell the focus must transition to it.
    const focusedElement = this.focusedCell?.element;
    if (focusedElement && isTableCell(focusedElement) && focusedElement.contains(focusableElement)) {
      // Scroll is unnecessary when moving focus from a cell to element within the cell.
      focusableElement.focus({ preventScroll: true });
    }
    return () => this.unregisterFocusable(focusableElement);
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
    const focusedElement = this.focusedCell.element;
    const nextTarget = isTableCell(focusedElement) ? this.getFocusablesFrom(focusedElement)[0] : null;
    if (nextTarget) {
      // Scroll is unnecessary when moving focus from a cell to element within the cell.
      nextTarget.focus({ preventScroll: true });
    } else {
      this.keepUserIndex = false;
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

    const keys = [
      KeyCode.up,
      KeyCode.down,
      KeyCode.left,
      KeyCode.right,
      KeyCode.pageUp,
      KeyCode.pageDown,
      KeyCode.home,
      KeyCode.end,
    ];
    const ctrlKey = event.ctrlKey ? 1 : 0;
    const altKey = event.altKey ? 1 : 0;
    const shiftKey = event.shiftKey ? 1 : 0;
    const metaKey = event.metaKey ? 1 : 0;
    const numModifiersPressed = ctrlKey + altKey + shiftKey + metaKey;

    if (
      (numModifiersPressed && !(numModifiersPressed === 1 && event.ctrlKey)) ||
      this.isSuppressed(document.activeElement) ||
      !this.isRegistered(document.activeElement) ||
      keys.indexOf(event.keyCode) === -1
    ) {
      return;
    }

    const from = this.focusedCell;
    event.preventDefault();

    isEventLike(event) &&
      handleKey(event, {
        onBlockStart: () => this.moveFocusBy(from, { y: -1, x: 0 }),
        onBlockEnd: () => this.moveFocusBy(from, { y: 1, x: 0 }),
        onInlineStart: () => this.moveFocusBy(from, { y: 0, x: -1 }),
        onInlineEnd: () => this.moveFocusBy(from, { y: 0, x: 1 }),
        onPageUp: () => this.moveFocusBy(from, { y: -this.pageSize, x: 0 }),
        onPageDown: () => this.moveFocusBy(from, { y: this.pageSize, x: 0 }),
        onHome: () => {
          if (numModifiersPressed === 1 && event.ctrlKey) {
            this.moveFocusBy(from, { y: -Infinity, x: -Infinity });
          } else {
            this.moveFocusBy(from, { y: 0, x: -Infinity });
          }
        },
        onEnd: () => {
          if (numModifiersPressed === 1 && event.ctrlKey) {
            this.moveFocusBy(from, { y: Infinity, x: Infinity });
          } else {
            this.moveFocusBy(from, { y: 0, x: Infinity });
          }
        },
      });
  };

  private moveFocusBy(cell: FocusedCell, delta: { x: number; y: number }) {
    // For vertical moves preserve column- and element indices set by user.
    // It allows keeping indices while moving over disabled actions or cells with colspan > 1.
    if (delta.y !== 0 && delta.x === 0) {
      this.keepUserIndex = true;
    }
    focusNextElement(this.getNextFocusable(cell, delta));
  }

  private updateFocusTarget() {
    this.focusTarget = this.getSingleFocusable();
    for (const focusableElement of this.focusables) {
      const isFocusable = this.focusablesState.get(focusableElement) ?? false;
      const newIsFocusable = this.focusTarget === focusableElement || this.isSuppressed(focusableElement);
      if (newIsFocusable !== isFocusable) {
        this.focusablesState.set(focusableElement, newIsFocusable);
        this.focusHandlers.get(focusableElement)!(newIsFocusable);
      }
    }
  }

  private isSuppressed(element: null | Element) {
    // Omit calculation as irrelevant until the table receives focus.
    if (!this.focusedCell) {
      return false;
    }
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

    const prevColIndex = this.focusedCell?.colIndex ?? -1;
    const prevElementIndex = this.focusedCell?.elementIndex ?? -1;
    this.focusedCell = {
      rowIndex,
      colIndex: this.keepUserIndex && prevColIndex !== -1 ? prevColIndex : colIndex,
      elementIndex: this.keepUserIndex && prevElementIndex !== -1 ? prevElementIndex : elementIndex,
      element: focusedElement,
    };
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
    const isValidDirection = !!delta.x;
    const isValidIndex = from.elementIndex !== -1 && 0 <= nextElementIndex && nextElementIndex < cellFocusables.length;
    const isTargetDifferent = from.element !== cellFocusables[nextElementIndex];
    if (isValidDirection && isValidIndex && isTargetDifferent) {
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

    const targetCellFocusables = this.getFocusablesFrom(targetCell);

    // When delta.x = 0 keep element index if possible.
    let focusIndex = from.elementIndex;
    // Use first element index when moving to the right or to extreme left.
    if ((isFinite(delta.x) && delta.x > 0) || delta.x === -Infinity) {
      focusIndex = 0;
    }
    // Use last element index when moving to the left or to extreme right.
    if ((isFinite(delta.x) && delta.x < 0) || delta.x === Infinity) {
      focusIndex = targetCellFocusables.length - 1;
    }

    return targetCellFocusables[focusIndex] ?? targetCell;
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
    return getAllFocusables(target).filter(el => this.focusables.has(el) && !isElementDisabled(el));
  }
}
