// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import { defaultIsSuppressed, findFocusinCell, getFocusableBefore, getFocusableAfter, moveFocusBy } from './utils';
import { FocusedCell, GridNavigationProps } from './interfaces';
import { KeyCode } from '../../internal/keycode';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { getFirstFocusable } from '../../internal/components/focus-lock/utils';
import { nodeBelongs } from '../../internal/utils/node-belongs';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';

/**
 * Makes table navigable with keyboard commands.
 * See https://www.w3.org/WAI/ARIA/apg/patterns/grid
 *
 * The hook attaches the GridNavigationHelper helper when active=true.
 * See GridNavigationHelper for more details.
 */
export function useGridNavigation({ keyboardNavigation, pageSize, getTable }: GridNavigationProps) {
  const gridNavigation = useMemo(() => new GridNavigationHelper(), []);

  const getTableStable = useStableCallback(getTable);

  // Initialize the model with the table container assuming it is mounted synchronously and only once.
  useEffect(() => {
    if (keyboardNavigation) {
      const table = getTableStable();
      table && gridNavigation.init(table);
    }
    return () => gridNavigation.cleanup();
  }, [keyboardNavigation, gridNavigation, getTableStable]);

  // Notify the model of the props change.
  useEffect(() => {
    gridNavigation.update({ pageSize });
  }, [gridNavigation, pageSize]);

  // Notify the model of table's re-render to update internal focused cell state if necessary.
  useEffect(() => {
    gridNavigation.refresh();
  });
}

/**
 * This helper encapsulates the grid navigation behaviors which are:
 * 1. Responding to keyboard commands and moving the focus accordingly;
 * 2. Muting table interactive elements for only one to be user-focusable at a time;
 * 3. Suppressing the above behaviors when focusing an element inside a dialog.
 *
 * When the navigation is suppressed the keyboard commands are no longer intercepted and all table interactive elements are made
 * user-focusable to unblock the Tab navigation. The suppression should only be used for interactive elements inside the table that would
 * otherwise conflict with the navigation. Once the interactive element is deactivated or lose focus the table navigation becomes active again.
 */
class GridNavigationHelper {
  /* Properties */
  private _pageSize = 0;
  private _table: null | HTMLTableElement = null;

  /** A reference to the currently focused table cell/element */
  private focusedCell: null | FocusedCell = null;
  /** A reference to the previously focused table cell/element cleared when the focus leaves the table */
  private prevFocusedCell: null | FocusedCell = null;
  /** A reference to the previously focused table cell/element retained when the focus leaves the table */
  private lastFocusedCell: null | FocusedCell = null;
  /** A flag indicating the Tab/Shift+Tab command has been just received */
  private _tabbed: null | 'forward' | 'backward' = null;

  public init(table: HTMLTableElement) {
    this._table = table;

    this.table.addEventListener('focusin', this.onFocusin);
    this.table.addEventListener('focusout', this.onFocusout);
    this.table.addEventListener('keydown', this.onKeydown);

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
    // When focused cell is un-mounted the focusout event handler removes this.focusedCell,
    // while this.prevFocusedCell is retained until the next focusin event.
    const cell = this.focusedCell ?? this.prevFocusedCell;
    const cellSuppressed = cell ? this.isSuppressed(cell.element) : false;

    // Re-focus table's cell if the previously focused one is no longer present in the DOM.
    if (cell && !cellSuppressed) {
      if (!nodeContains(this.table, cell.element)) {
        return moveFocusBy(this.table, cell, { y: 0, x: 0 });
      }
    }

    // Update current cell indices in case rows or columns before the focused one got removed.
    if (this.focusedCell) {
      const cell = findFocusinCell(this.focusedCell.element);
      this.focusedCell = cell;
      this.prevFocusedCell = cell;
      this.lastFocusedCell = cell;
    }
  }

  private get pageSize() {
    return this._pageSize;
  }

  private get table(): HTMLTableElement {
    if (!this._table) {
      throw new Error('Invariant violation: GridNavigationHelper is used before initialization.');
    }
    return this._table;
  }

  private isSuppressed(focusedElement: HTMLElement): boolean {
    return defaultIsSuppressed(focusedElement);
  }

  private onFocusin = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    const cell = findFocusinCell(event.target);

    // If Tab/Shift+Tab command was used the focus is dispatched to the element before/after the table.
    if (this._tabbed && cell && !this.isSuppressed(cell.element)) {
      const target = this._tabbed === 'backward' ? getFocusableBefore(this.table) : getFocusableAfter(this.table);
      this._tabbed = null;
      return target.focus();
    }

    // Focusing the last focused cell/element if available when the focus enters the table from outside.
    const focusedFromOutside = event.relatedTarget instanceof Element && !this.table.contains(event.relatedTarget);
    if (focusedFromOutside && this.lastFocusedCell && this.table.contains(this.lastFocusedCell.element)) {
      return moveFocusBy(this.table, this.lastFocusedCell, { x: 0, y: 0 });
    }

    if (cell) {
      this.focusedCell = cell;
      this.prevFocusedCell = cell;
      this.lastFocusedCell = cell;

      // Focusing on cell is not eligible when it contains focusable elements in the content.
      // If content focusables are available - move the focus to the first one.
      if (cell.element === cell.cellElement) {
        getFirstFocusable(cell.cellElement)?.focus();
      }
    }
  };

  private onFocusout = (event: FocusEvent) => {
    this.focusedCell = null;

    // Invalidate previously focused cell when the focus leaves the table.
    if (event.relatedTarget && !nodeBelongs(this.table, event.relatedTarget)) {
      this.prevFocusedCell = null;
    }
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
    if (numModifiersPressed === 1 && (event.ctrlKey || event.shiftKey)) {
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
        return moveFocusBy(this.table, from, { y: -1, x: 0 });

      case KeyCode.down:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: 1, x: 0 });

      case KeyCode.left:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: 0, x: -1 });

      case KeyCode.right:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: 0, x: 1 });

      case KeyCode.pageUp:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: -this.pageSize, x: 0 });

      case KeyCode.pageDown:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: this.pageSize, x: 0 });

      case KeyCode.home:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: 0, x: minExtreme });

      case KeyCode.end:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: 0, x: maxExtreme });

      case -KeyCode.home:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: minExtreme, x: minExtreme });

      case -KeyCode.end:
        event.preventDefault();
        return moveFocusBy(this.table, from, { y: maxExtreme, x: maxExtreme });

      case KeyCode.tab:
        return this.setTabbed('forward');

      case -KeyCode.tab:
        return this.setTabbed('backward');

      default:
        return;
    }
  };

  private setTabbed(value: 'forward' | 'backward') {
    this._tabbed = value;
    // The flag only needs to be set for the immediately following focusin event.
    setTimeout(() => (this._tabbed = null), 0);
  }
}
