// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import { defaultIsSuppressed, findFocusinCell, getFocusableBefore, getFocusableAfter, moveFocusBy } from './utils';
import { FocusedCell, GridNavigationProps } from './interfaces';
import { KeyCode } from '../../internal/keycode';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { getFirstFocusable } from '../../internal/components/focus-lock/utils';

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
}

/**
 * This helper encapsulates the grid navigation behaviors which are:
 * 1. Responding to keyboard commands and moving the focus accordingly;
 * 2. Muting table interactive elements for only one to be user-focusable at a time;
 * 3. Suppressing the above behaviors when focusing an element inside a dialog.
 *
 * All behaviors are attached upon initialization and are re-evaluated with every focusin, focusout, and keydown events,
 * and also when a node removal inside the table is observed to ensure consistency at any given moment.
 *
 * When the navigation is suppressed the keyboard commands are no longer intercepted and all table interactive elements are made
 * user-focusable to unblock the Tab navigation. The suppression should only be used for interactive elements inside the table that would
 * otherwise conflict with the navigation. Once the interactive element is deactivated or lose focus the table navigation becomes active again.
 */
class GridNavigationHelper {
  // Props
  private _pageSize = 0;
  private _table: null | HTMLTableElement = null;
  private _tabbed: null | 'forward' | 'backward' = null;

  // State
  private lastFocusedCell: null | FocusedCell = null;
  private prevFocusedCell: null | FocusedCell = null;
  private focusedCell: null | FocusedCell = null;

  public init(table: HTMLTableElement) {
    this._table = table;

    this.table.addEventListener('focusin', this.onFocusin);
    this.table.addEventListener('focusout', this.onFocusout);
    this.table.addEventListener('keydown', this.onKeydown);

    const tableNodesObserver = new MutationObserver(this.onTableNodeMutation);
    tableNodesObserver.observe(table, { childList: true, subtree: true });

    this.cleanup = () => {
      this.table.removeEventListener('focusin', this.onFocusin);
      this.table.removeEventListener('focusout', this.onFocusout);
      this.table.removeEventListener('keydown', this.onKeydown);

      tableNodesObserver.disconnect();
    };
  }

  public cleanup() {
    // Do nothing before initialized.
  }

  public update({ pageSize }: { pageSize: number }) {
    this._pageSize = pageSize;
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
    const cell = findFocusinCell(event);

    if (this._tabbed && cell && !this.isSuppressed(cell.element)) {
      return this._tabbed === 'backward'
        ? getFocusableBefore(this.table).focus()
        : getFocusableAfter(this.table).focus();
    }

    if (
      event.relatedTarget instanceof Element &&
      !this.table.contains(event.relatedTarget) &&
      this.lastFocusedCell &&
      this.table.contains(this.lastFocusedCell.element)
    ) {
      return moveFocusBy(this.table, this.lastFocusedCell, { x: 0, y: 0 });
    }

    if (!cell) {
      return;
    }

    this.lastFocusedCell = cell;
    this.prevFocusedCell = cell;
    this.focusedCell = cell;

    // Focusing on cell is not eligible when it contains focusable elements in the content.
    // If content focusables are available - move the focus to the first one.
    if (cell.element === cell.cellElement) {
      getFirstFocusable(cell.cellElement)?.focus();
    }
  };

  private onFocusout = () => {
    this.focusedCell = null;
    // if (event.relatedTarget && event.relatedTarget instanceof Element && !this.table.contains(event.relatedTarget)) {
    //   this.prevFocusedCell = null;
    // }
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
    } else if (numModifiersPressed === 1 && event.shiftKey && key === KeyCode.tab) {
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
    setTimeout(() => (this._tabbed = null), 0);
  }

  private onTableNodeMutation = (mutationRecords: MutationRecord[]) => {
    // When focused cell is un-mounted the focusout event handler removes this.focusedCell,
    // while this.prevFocusedCell is retained until the next focusin event.
    const cell = this.focusedCell ?? this.prevFocusedCell;
    const cellSuppressed = cell ? this.isSuppressed(cell.element) : false;

    if (cell && !cellSuppressed) {
      for (const record of mutationRecords) {
        if (record.type === 'childList') {
          // The lost focus in an unmount event is reapplied to the table using the previous cell position.
          // The moveFocusBy takes care of finding the closest position if the previous one no longer exists.
          for (const removedNode of Array.from(record.removedNodes)) {
            if (nodeContains(removedNode, cell.element)) {
              moveFocusBy(this.table, cell, { y: 0, x: 0 });
              return;
            }
          }
        }
      }
    }
  };
}
