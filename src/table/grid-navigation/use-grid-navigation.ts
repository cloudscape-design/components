// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import { TableRole } from '../table-role';
import { getFocusinCell } from './utils';

export interface GridNavigationProps {
  tableRole: TableRole;
  rows: number;
  columns: number;
  pageSize: number;
  getContainer: () => null | HTMLElement;
}

export interface GridNavigationAPI {
  focusCell: (coordinates: { row: number; column: number }) => void;
}

export function useGridNavigation({
  tableRole,
  rows,
  columns,
  pageSize,
  getContainer,
}: GridNavigationProps): GridNavigationAPI {
  const model = useMemo(() => new GridNavigationModel(), []);

  // Initialize the model with the table container assuming it is mounted synchronously and only once.
  useEffect(
    () => {
      if (tableRole === 'grid') {
        const container = getContainer();
        container && model.init(container);
      }
      return () => model.destroy();
    },
    // Assuming getContainer is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, tableRole]
  );

  // TODO: is columns/rows actually needed??
  // TODO: handle the case when rows and columns stay unchanged by the focused item disappears (e.g. it is replaced by another item)
  // Notify the model of the props change. The focus might need to move when the focused cell is no longer available.
  useEffect(() => {
    model.update({ rows, columns, pageSize });
  }, [model, rows, columns, pageSize]);

  return model;
}

class GridNavigationModel {
  // Props
  private _rows = 0;
  private _columns = 0;
  private _pageSize = 0;
  private _container: null | HTMLElement = null;

  // State
  private focusedCell: null | { row: number; column: number } = null;
  private focusedElement: null | HTMLElement = null;

  public init(container: HTMLElement) {
    this._container = container;

    this.container.addEventListener('focusin', this.onFocusin);
    this.container.addEventListener('keydown', this.onKeydown);
  }

  public destroy() {
    this.container.removeEventListener('focusin', this.onFocusin);
    this.container.removeEventListener('keydown', this.onKeydown);
  }

  public update({ rows, columns, pageSize }: { rows: number; columns: number; pageSize: number }) {
    this._rows = rows;
    this._columns = columns;
    this._pageSize = pageSize;
    // TODO: validate state
  }

  // TODO: implement
  public focusCell = ({ row, column }: { row: number; column: number }) => {
    throw new Error(`focusCell({ row: ${row}, column: ${column} }) is not implemented.`);
  };

  private get rows() {
    return this._rows;
  }

  private get columns() {
    return this._columns;
  }

  private get pageSize() {
    return this._pageSize;
  }

  private get container(): HTMLElement {
    if (!this._container) {
      throw new Error('Invariant violation: GridNavigationModel is used before initialization.');
    }
    return this._container;
  }

  private onFocusin(event: FocusEvent) {
    const cell = getFocusinCell(event);
    if (!cell) {
      return;
    }

    console.log('FOCUS IN WRAPPER', cell.rowIndex, cell.colIndex);

    // check target - if inside cell, update state, listeners, etc.
    // if not cell - do nothing
  }

  private onCellFocus() {}

  // TODO: check if blur is triggered upon cell unmounting
  private onCellBlur() {}

  private onKeydown() {
    console.log('onkeydown');
  }

  private lockCellFocus() {}

  private unlockCellFocus() {}
}
