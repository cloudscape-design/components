// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  findFocusedCell,
  getNextFocusable,
  getSingleFocusable,
  getAllowedFocusables,
  defaultIsSuppressed,
} from './utils';
import {
  FocusableChangeHandler,
  FocusableDefinition,
  FocusableOptions,
  FocusedCell,
  GridNavigationProviderProps,
} from './interfaces';
import { KeyCode } from '../../internal/keycode';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { nodeBelongs } from '../../internal/utils/node-belongs';
import { useUniqueId } from '../../internal/hooks/use-unique-id';

export const GridNavigationContext = createContext<{
  focusMuted: boolean;
  registerFocusable(
    focusableId: string,
    focusable: FocusableDefinition,
    handler: FocusableChangeHandler,
    options?: FocusableOptions
  ): () => void;
  unregisterFocusable(focusable: FocusableDefinition): void;
}>({
  focusMuted: false,
  registerFocusable: () => () => {},
  unregisterFocusable: () => {},
});

export const GridNavigationSuppressionContext = createContext<{ navigationSuppressed: boolean }>({
  navigationSuppressed: false,
});

export function GridNavigationSuppressed({ children }: { children: React.ReactNode }) {
  return (
    <GridNavigationSuppressionContext.Provider value={{ navigationSuppressed: true }}>
      <div style={{ display: 'contents' }} data-awsui-table-suppress-navigation={true}>
        {children}
      </div>
    </GridNavigationSuppressionContext.Provider>
  );
}

/**
 * Makes table navigable with keyboard commands.
 * See https://www.w3.org/WAI/ARIA/apg/patterns/grid
 *
 * The hook attaches the GridNavigationHelper helper when active=true.
 * See GridNavigationHelper for more details.
 */
export function GridNavigationProvider({
  children,
  keyboardNavigation,
  pageSize,
  getTable,
}: GridNavigationProviderProps) {
  const gridNavigation = useMemo(() => new GridNavigationHelper(), []);

  const getTableStable = useStableCallback(getTable);

  // Initialize the helper with the table container assuming it is mounted synchronously and only once.
  useEffect(() => {
    if (keyboardNavigation) {
      const table = getTableStable();
      table && gridNavigation.init(table);
    }
    return () => gridNavigation.cleanup();
  }, [keyboardNavigation, gridNavigation, getTableStable]);

  // Notify the helper of the props change.
  useEffect(() => {
    gridNavigation.update({ pageSize });
  }, [gridNavigation, pageSize]);

  // Notify the helper of the new render.
  useEffect(() => {
    if (keyboardNavigation) {
      gridNavigation.refresh();
    }
  });

  return (
    <GridNavigationContext.Provider
      value={{
        focusMuted: keyboardNavigation,
        registerFocusable: gridNavigation.registerFocusable,
        unregisterFocusable: gridNavigation.unregisterFocusable,
      }}
    >
      {children}
    </GridNavigationContext.Provider>
  );
}

export function useGridNavigationContext() {
  const { navigationSuppressed } = useContext(GridNavigationSuppressionContext);
  const { focusMuted, registerFocusable, unregisterFocusable } = useContext(GridNavigationContext);
  return { focusMuted: focusMuted && !navigationSuppressed, registerFocusable, unregisterFocusable };
}

export function useGridNavigationFocusable(
  focusable: FocusableDefinition,
  { suppressNavigation }: FocusableOptions = {}
) {
  const focusableId = useUniqueId();
  const { focusMuted, registerFocusable } = useGridNavigationContext();
  const [focusTarget, setFocusTarget] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const changeHandler = (focusTargetId: string, focusTarget: null | HTMLElement) =>
      setFocusTarget(focusTargetId === focusableId ? focusTarget : null);

    const unregister = registerFocusable(focusableId, focusable, changeHandler, { suppressNavigation });

    return () => unregister();
  }, [focusableId, focusable, registerFocusable, suppressNavigation]);

  const focusTargetMuted = focusMuted && focusTarget !== getFocusableElement(focusable);

  return { focusMuted, focusTargetMuted };
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

class GridNavigationFocusStore {
  private focusables = new Set<FocusableDefinition>();
  private focusableToId = new Map<FocusableDefinition, string>();
  private focusableSuppressed = new Set<FocusableDefinition>();
  private focusTargetHandlers = new Map<FocusableDefinition, FocusableChangeHandler>();

  public registerFocusable = (
    focusableId: string,
    focusable: FocusableDefinition,
    changeHandler: FocusableChangeHandler,
    { suppressNavigation = false }: FocusableOptions = {}
  ) => {
    this.focusables.add(focusable);
    this.focusableToId.set(focusable, focusableId);
    this.focusTargetHandlers.set(focusable, changeHandler);
    if (suppressNavigation) {
      this.focusableSuppressed.add(focusable);
    }
    return () => this.unregisterFocusable(focusable);
  };

  public unregisterFocusable = (focusable: FocusableDefinition) => {
    this.focusables.delete(focusable);
    this.focusableToId.delete(focusable);
    this.focusableSuppressed.delete(focusable);
    this.focusTargetHandlers.delete(focusable);
  };

  public getNavigableElements = (): Set<HTMLElement> => {
    const registeredElements = new Set<HTMLElement>();
    for (const focusable of this.focusables) {
      const element = getFocusableElement(focusable);
      if (element) {
        registeredElements.add(element);
      }
    }
    return registeredElements;
  };

  public setFocusTarget(focusTarget: HTMLElement) {
    const focusable = [...this.focusables].find(f => getFocusableElement(f) === focusTarget);
    const focusableId = focusable ? this.focusableToId.get(focusable) : null;
    if (focusable && focusableId) {
      this.focusTargetHandlers.forEach(handler => handler(focusableId, focusTarget));
    }
  }

  public isSuppressed(focusTarget: HTMLElement) {
    const focusable = [...this.focusables].find(f => getFocusableElement(f) === focusTarget);
    return focusable && this.focusableSuppressed.has(focusable);
  }
}

function getFocusableElement(focusable: FocusableDefinition): null | HTMLElement {
  return typeof focusable === 'function' ? focusable() : focusable.current;
}
