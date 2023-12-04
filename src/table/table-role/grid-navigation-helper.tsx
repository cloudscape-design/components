// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  findFocusedCell,
  getNextFocusable,
  getSingleFocusable,
  getAllowedFocusables,
  defaultIsSuppressed,
} from './utils';
import { FocusedCell } from './interfaces';
import { KeyCode } from '../../internal/keycode';
import { nodeBelongs } from '../../internal/utils/node-belongs';
import { GridNavigationFocusStore } from './grid-navigation-focus-store';

export class GridNavigationHelper {
  // Props
  private _pageSize = 0;
  private _table: null | HTMLTableElement = null;

  // State
  private focusedCell: null | FocusedCell = null;

  // Reactive state
  private focusStore = new GridNavigationFocusStore();

  public init(table: HTMLTableElement) {
    this._table = table;

    this.table.addEventListener('focusin', this.onFocusin);
    this.table.addEventListener('focusout', this.onFocusout);
    this.table.addEventListener('keydown', this.onKeydown);

    const focusTarget = getSingleFocusable(this.table, null, this.focusStore.getNavigableElements());
    focusTarget && this.focusStore.setFocusTarget(focusTarget);

    this.cleanup = () => {
      this.table.removeEventListener('focusin', this.onFocusin);
      this.table.removeEventListener('focusout', this.onFocusout);
      this.table.removeEventListener('keydown', this.onKeydown);
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
      const focusableElements = this.focusStore.getNavigableElements();

      // Update focused cell indices in case table rows, columns, or firstIndex change.
      if (this.focusedCell) {
        this.focusedCell = findFocusedCell(this.focusedCell.element, focusableElements);
      }

      const focusTarget = getSingleFocusable(this.table, this.focusedCell, focusableElements);
      focusTarget && this.focusStore.setFocusTarget(focusTarget);
    }
  }

  public registerFocusable = this.focusStore.registerFocusable;

  public unregisterFocusable = this.focusStore.unregisterFocusable;

  private get pageSize() {
    return this._pageSize;
  }

  private get table(): HTMLTableElement {
    if (!this._table) {
      throw new Error('Invariant violation: GridNavigationHelper is used before initialization.');
    }
    return this._table;
  }

  private onFocusin = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const cell = findFocusedCell(event.target, this.focusStore.getNavigableElements());
    if (!cell) {
      return;
    }

    this.focusedCell = cell;
    const focusableElements = this.focusStore.getNavigableElements();

    const focusTarget = getSingleFocusable(this.table, cell, focusableElements);
    focusTarget && this.focusStore.setFocusTarget(focusTarget);

    // Focusing on cell is not eligible when it contains focusable elements in the content.
    // If content focusables are available - move the focus to the first one.
    if (cell.element === cell.cellElement) {
      getAllowedFocusables(cell.cellElement, focusableElements)[0]?.focus();
    }
  };

  private onFocusout = () => {
    // When focus leaves the cell and the cell becomes no longer belong to the table it indicates the focused element has been unmounted.
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
    if (this.focusStore.isSuppressed(from.element) || defaultIsSuppressed(from.element)) {
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
    getNextFocusable(this.table, cell, delta, this.focusStore.getNavigableElements())?.focus();
  }
}
