// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import {
  defaultIsSuppressed,
  findFocusinCell,
  moveFocusBy,
  restoreTableFocusables,
  updateTableFocusables,
  getFocusables,
} from './utils';
import { FocusedCell, GridNavigationProps } from './interfaces';
import { KeyCode } from '../../internal/keycode';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

/**
 * Makes table navigable with keyboard commands.
 * See https://www.w3.org/WAI/ARIA/apg/patterns/grid
 *
 * The hook attaches the GridNavigationModel helper when active=true.
 * See GridNavigationModel for more details.
 */
export function useGridNavigation({ active, pageSize, getTable, isSuppressed }: GridNavigationProps) {
  const model = useMemo(() => new GridNavigationModel(), []);

  const getTableStable = useStableCallback(getTable);
  const isSuppressedStable = useStableCallback((element: HTMLElement) => isSuppressed?.(element) ?? false);

  // Initialize the model with the table container assuming it is mounted synchronously and only once.
  useEffect(() => {
    if (active) {
      const table = getTableStable();
      table && model.init(table, isSuppressedStable);
    }
    return () => model.destroy();
  }, [model, active, getTableStable, isSuppressedStable]);

  // Notify the model of the props change.
  useEffect(() => {
    model.update({ pageSize });
  }, [model, pageSize]);
}

/**
 * This helper encapsulates the grid navigation behaviors which are:
 * 1. Responding to keyboard commands and moving the focus accordingly;
 * 2. Muting table interactive elements for only one to be user-focusable at a time;
 * 3. Suppressing the above behaviors when focusing an element inside a dialog or when instructed by the isSuppressed callback.
 *
 * All behaviors are attached upon initialization and are re-evaluated with every focusin, focusout, and keydown events,
 * and also when a node removal inside the table is observed to ensure consistency at any given moment.
 *
 * When the navigation is suppressed the keyboard commands are no longer intercepted and all table interactive elements are made
 * user-focusable to unblock the Tab navigation. The suppression should only be used for interactive elements inside the table that would
 * otherwise conflict with the navigation. Once the interactive element is deactivated or lose focus the table navigation becomes active again.
 */
class GridNavigationModel {
  // Props
  private _pageSize = 0;
  private _table: null | HTMLTableElement = null;
  private _isSuppressed: (focusedElement: HTMLElement) => boolean = () => false;

  // State
  private prevFocusedCell: null | FocusedCell = null;
  private focusedCell: null | FocusedCell = null;
  private cleanup = () => {};

  public init(table: HTMLTableElement, isSuppressed: (focusedElement: HTMLElement) => boolean) {
    this._table = table;
    this._isSuppressed = isSuppressed;

    this.table.addEventListener('focusin', this.onFocusin);
    this.table.addEventListener('focusout', this.onFocusout);
    this.table.addEventListener('keydown', this.onKeydown);

    const tableNodesObserver = new MutationObserver(this.onTableNodeMutation);
    tableNodesObserver.observe(table, { childList: true, subtree: true });

    updateTableFocusables(this.table, null, false);

    this.cleanup = () => {
      this.table.removeEventListener('focusin', this.onFocusin);
      this.table.removeEventListener('focusout', this.onFocusout);
      this.table.removeEventListener('keydown', this.onKeydown);

      tableNodesObserver.disconnect();

      restoreTableFocusables(this.table);
    };
  }

  public destroy() {
    this.cleanup();
  }

  public update({ pageSize }: { pageSize: number }) {
    this._pageSize = pageSize;
  }

  private get pageSize() {
    return this._pageSize;
  }

  private get table(): HTMLTableElement {
    if (!this._table) {
      throw new Error('Invariant violation: GridNavigationModel is used before initialization.');
    }
    return this._table;
  }

  private isSuppressed(focusedElement: HTMLElement): boolean {
    return defaultIsSuppressed(focusedElement) || this._isSuppressed(focusedElement);
  }

  private onFocusin = (event: FocusEvent) => {
    const cell = findFocusinCell(event);
    if (!cell) {
      return;
    }

    this.prevFocusedCell = cell;
    this.focusedCell = cell;

    updateTableFocusables(this.table, cell, this.isSuppressed(cell.element));

    // Focusing on cell is not eligible when it contains focusable elements in the content.
    // If content focusables are available - move the focus to the first one.
    if (cell.element === cell.cellElement) {
      getFocusables(cell.cellElement)[0]?.focus();
    }
  };

  private onFocusout = () => {
    this.focusedCell = null;
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

      default:
        return;
    }
  };

  private onTableNodeMutation = (mutationRecords: MutationRecord[]) => {
    // When focused cell is un-mounted the focusout event handler removes this.cell,
    // while this.prevFocusedCell is retained until the next focusin event.
    if (!this.prevFocusedCell) {
      return;
    }

    // The lost focus in an unmount event is reapplied to the table using the previous cell position.
    // The moveFocusBy takes care of finding the closest position if the previous one no longer exists.
    for (const record of mutationRecords) {
      if (record.type === 'childList') {
        for (const removedNode of Array.from(record.removedNodes)) {
          if (removedNode === this.prevFocusedCell.element || nodeContains(removedNode, this.prevFocusedCell.element)) {
            const cell = this.focusedCell ?? this.prevFocusedCell;
            updateTableFocusables(this.table, cell, this.isSuppressed(cell.element));
            moveFocusBy(this.table, this.prevFocusedCell, { y: 0, x: 0 });
          }
        }
      }
    }
  };
}
