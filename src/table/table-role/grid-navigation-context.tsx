// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useCallback } from 'react';
import AsyncStore, { ReadonlyAsyncStore, useSelector } from '../../area-chart/async-store';
import { getFocusables } from '../../internal/components/focus-lock/utils';

interface CellDefinition {
  focusables: readonly FocusableDefinition[];
}

interface FocusableDefinition {
  id: string;
  getElement: () => HTMLElement;
}

interface GridNavigationFocusStoreState {
  cells: readonly GridNavigationCellFocusState[][];
}

interface GridNavigationCellFocusState {
  focusIndex?: -1 | number;
}

export interface GridNavigationFocus extends ReadonlyAsyncStore<GridNavigationFocusStoreState> {
  registerFocusable(props: {
    rowIndex: number;
    columnIndex: number;
    cellElement: null | HTMLTableCellElement;
    focusable: FocusableDefinition;
  }): void;
  getCellDefinition(props: { rowIndex: number; columnIndex: number }): CellDefinition;
  focusElement(props: { rowIndex: number; columnIndex: number; elementIndex: number }): boolean;
}

export class GridNavigationFocusStore extends AsyncStore<GridNavigationFocusStoreState> {
  private cellDefinitions: CellDefinition[][] = [];

  constructor() {
    super({ cells: [] });
  }

  public registerFocusable = ({
    rowIndex,
    columnIndex,
    cellElement,
    focusable,
  }: {
    rowIndex: number;
    columnIndex: number;
    cellElement: null | HTMLTableCellElement;
    focusable: FocusableDefinition;
  }) => {
    if (!cellElement) {
      return;
    }

    while (!this.cellDefinitions[rowIndex]) {
      this.cellDefinitions.push([]);
    }
    while (!this.cellDefinitions[rowIndex][columnIndex]) {
      this.cellDefinitions[rowIndex].push({ focusables: [] });
    }

    // Update/insert new focusable
    let focusables = [...this.cellDefinitions[rowIndex][columnIndex].focusables];
    const focusableIndex = focusables.findIndex(current => current.id === focusable.id);
    if (focusableIndex !== -1) {
      focusables[focusableIndex] = focusable;
    } else {
      focusables.push(focusable);
    }

    // Remove unmounted nodes
    focusables = focusables.filter(f => !!f.getElement());

    // Order focusables
    const cellFocusTargets = getFocusables(cellElement);
    const focusTargetToIndex = cellFocusTargets.reduce(
      (map, element, index) => map.set(element, index),
      new WeakMap<HTMLElement, number>()
    );
    const getIndex = (element: HTMLElement) => focusTargetToIndex.get(element) ?? -1;
    focusables.sort((a, b) => getIndex(a.getElement()) - getIndex(b.getElement()));

    this.cellDefinitions[rowIndex][columnIndex] = { focusables };
  };

  public getCellDefinition = ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }): CellDefinition => {
    return this.cellDefinitions[rowIndex]?.[columnIndex] ?? { focusables: [] };
  };

  public focusElement = ({
    rowIndex,
    columnIndex,
    elementIndex,
  }: {
    rowIndex: number;
    columnIndex: number;
    elementIndex: number;
  }): boolean => {
    const definition = this.getCellDefinition({ rowIndex, columnIndex });
    const elementNode = definition.focusables[elementIndex]?.getElement() ?? null;
    if (elementNode && 'focus' in elementNode) {
      elementNode.focus();
      return true;
    }
    return false;
  };
}

export const GridNavigationCellContext = createContext<{
  focusIndex?: -1 | number;
  registerFocusable(focusable: FocusableDefinition): void;
  autoRegisterFocusables(focusableParentId: string, getParent: () => null | HTMLElement): void;
}>({
  focusIndex: undefined,
  registerFocusable: () => {},
  autoRegisterFocusables: () => {},
});

export function GridNavigationCellProvider({
  children,
  rowIndex,
  columnIndex,
  gridNavigationFocus,
  cellRef,
}: {
  children: React.ReactNode;
  rowIndex: number;
  columnIndex: number;
  gridNavigationFocus: GridNavigationFocus;
  cellRef: React.RefObject<HTMLTableCellElement>;
}) {
  const focusIndex = useSelector(gridNavigationFocus, state => state.cells[rowIndex]?.[columnIndex]?.focusIndex);

  const registerFocusable = useCallback(
    (focusable: FocusableDefinition) =>
      gridNavigationFocus.registerFocusable({ rowIndex, columnIndex, cellElement: cellRef.current, focusable }),
    [gridNavigationFocus, rowIndex, columnIndex, cellRef]
  );

  const autoRegisterFocusables = useCallback(
    (focusableParentId: string, getParent: () => HTMLElement) => {
      const parent = getParent();
      if (!parent) {
        return;
      }
      const focusables = getFocusables(parent);
      for (let i = 0; i < focusables.length; i++) {
        gridNavigationFocus.registerFocusable({
          rowIndex,
          columnIndex,
          cellElement: cellRef.current,
          focusable: { id: `${focusableParentId}-${i}`, getElement: () => focusables[i] },
        });
      }
    },
    [gridNavigationFocus, rowIndex, columnIndex, cellRef]
  );

  return (
    <GridNavigationCellContext.Provider value={{ focusIndex, registerFocusable, autoRegisterFocusables }}>
      {children}
    </GridNavigationCellContext.Provider>
  );
}
