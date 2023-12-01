// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  findFocusedCell,
  getNextFocusable,
  getSingleFocusable,
  getAllowedFocusables,
  defaultIsSuppressed,
} from './utils';
import { FocusableDefinition, FocusableOptions, FocusedCell, GridNavigationProviderProps } from './interfaces';
import { KeyCode } from '../../internal/keycode';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { nodeBelongs } from '../../internal/utils/node-belongs';
import { unstable_batchedUpdates } from 'react-dom';

type ChangeHandler = (newFocusableId: string, focusTarget: HTMLElement) => void;

export const GridNavigationContext = createContext<{
  focusMuted: boolean;
  focusStore: any;
  registerFocusable(
    focusableId: string,
    focusable: FocusableDefinition,
    options: FocusableOptions,
    changeHandler: ChangeHandler
  ): () => void;
  unregisterFocusable(focusable: FocusableDefinition): void;
}>({
  focusMuted: false,
  focusStore: {
    focusTarget: null,
    registerFocusable: () => () => {},
    unregisterFocusable: () => {},
    getNavigableElements: () => [],
    setFocusTarget: () => {},
    isSuppressed: () => false,
  },
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
  const focusStore = useGridNavigationFocusStore();
  const gridNavigation = useMemo(() => new GridNavigationHelper(), []);

  const getTableStable = useStableCallback(getTable);

  // Initialize the helper with the table container assuming it is mounted synchronously and only once.
  useEffect(() => {
    if (keyboardNavigation) {
      const table = getTableStable();
      table && gridNavigation.init(table, focusStore);
    }
    return () => gridNavigation.cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        focusStore,
        registerFocusable: focusStore.registerFocusable,
        unregisterFocusable: focusStore.unregisterFocusable,
      }}
    >
      {children}
    </GridNavigationContext.Provider>
  );
}

export function useGridNavigationFocusable(
  focusableId?: string,
  focusable?: FocusableDefinition,
  { suppressNavigation }: FocusableOptions = {}
) {
  const [currentFocusTarget, setCurrentFocusTarget] = useState<HTMLElement | null>(null);
  const { navigationSuppressed } = useContext(GridNavigationSuppressionContext);
  const { focusMuted, registerFocusable, unregisterFocusable } = useContext(GridNavigationContext);

  useEffect(() => {
    if (focusableId && focusable) {
      return registerFocusable(focusableId, focusable, { suppressNavigation }, (newFocusableId, focusTarget) => {
        setCurrentFocusTarget(newFocusableId === focusableId ? focusTarget : null);
      });
    }
  }, [focusableId, focusable, registerFocusable, suppressNavigation]);

  return {
    focusMuted: focusMuted && !navigationSuppressed,
    focusTarget: currentFocusTarget,
    registerFocusable,
    unregisterFocusable,
  };
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
  private _focusStore: any;

  // State
  private focusedCell: null | FocusedCell = null;

  public init(table: HTMLTableElement, focusStore: any) {
    this._table = table;
    this._focusStore = focusStore;

    this.table.addEventListener('focusin', this.onFocusin);
    this.table.addEventListener('focusout', this.onFocusout);
    this.table.addEventListener('keydown', this.onKeydown);

    const focusTarget = getSingleFocusable(this.table, null, this._focusStore.getNavigableElements());
    focusTarget && this._focusStore.setFocusTarget(focusTarget);

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
    if (this._table && this._focusStore) {
      const focusableElements = this._focusStore.getNavigableElements();

      // Update focused cell indices in case table rows, columns, or firstIndex change.
      if (this.focusedCell) {
        this.focusedCell = findFocusedCell(this.focusedCell.element, focusableElements);
      }

      const focusTarget = getSingleFocusable(this.table, this.focusedCell, focusableElements);
      focusTarget && this._focusStore.setFocusTarget(focusTarget);
    }
  }

  public registerFocusable = (focusableId: string, focusable: FocusableDefinition, options?: FocusableOptions) => {
    return this._focusStore.registerFocusable(focusableId, focusable, options);
  };

  public unregisterFocusable = (focusable: FocusableDefinition) => {
    return this._focusStore.unregisterFocusable(focusable);
  };

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

    const cell = findFocusedCell(event.target, this._focusStore.getNavigableElements());
    if (!cell) {
      return;
    }

    this.focusedCell = cell;
    const focusableElements = this._focusStore.getNavigableElements();

    const focusTarget = getSingleFocusable(this.table, cell, focusableElements);
    focusTarget && this._focusStore.setFocusTarget(focusTarget);

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
    if (this._focusStore.isSuppressed(from.element) || defaultIsSuppressed(from.element)) {
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
    getNextFocusable(this.table, cell, delta, this._focusStore.getNavigableElements())?.focus();
  }
}

function useGridNavigationFocusStore() {
  const focusablesRef = useRef(new Set<FocusableDefinition>());
  const focusableToIdRef = useRef(new Map<FocusableDefinition, string>());
  const focusableSuppressedRef = useRef(new Set<FocusableDefinition>());
  const changeHandlers = useRef(new Set<ChangeHandler>());

  function registerFocusable(
    focusableId: string,
    focusable: FocusableDefinition,
    { suppressNavigation = false }: FocusableOptions = {},
    changeHandler: ChangeHandler
  ) {
    changeHandlers.current.add(changeHandler);
    focusablesRef.current.add(focusable);
    focusableToIdRef.current.set(focusable, focusableId);
    if (suppressNavigation) {
      focusableSuppressedRef.current.add(focusable);
    }
    return () => {
      changeHandlers.current.delete(changeHandler);
      unregisterFocusable(focusable);
    };
  }

  const unregisterFocusable = useCallback((focusable: FocusableDefinition) => {
    focusablesRef.current.delete(focusable);
    focusableToIdRef.current.delete(focusable);
    focusableSuppressedRef.current.delete(focusable);
  }, []);

  const getNavigableElements = useCallback((): Set<HTMLElement> => {
    const registeredElements = new Set<HTMLElement>();
    for (const focusable of focusablesRef.current) {
      const element = getFocusableElement(focusable);
      if (element) {
        registeredElements.add(element);
      }
    }
    return registeredElements;
  }, []);

  const setFocusTarget = useCallback((focusTarget: HTMLElement) => {
    unstable_batchedUpdates(() => {
      const focusable = [...focusablesRef.current].find(f => getFocusableElement(f) === focusTarget);
      const focusableId = focusable ? focusableToIdRef.current.get(focusable) : null;
      if (focusable && focusableId) {
        changeHandlers.current.forEach(handler => handler(focusableId, focusTarget));
      }
    });
  }, []);

  const isSuppressed = useCallback((focusTarget: HTMLElement) => {
    const focusable = [...focusablesRef.current].find(f => getFocusableElement(f) === focusTarget);
    return focusable && focusableSuppressedRef.current.has(focusable);
  }, []);

  return { registerFocusable, unregisterFocusable, getNavigableElements, setFocusTarget, isSuppressed };
}

function getFocusableElement(focusable: FocusableDefinition): null | HTMLElement {
  return typeof focusable === 'function' ? focusable() : focusable.current;
}
