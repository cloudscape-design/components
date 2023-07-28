// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import { TableRole } from '../table-role';

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

// TODO: add TAB traps surrounding table container
// when the first tab trap is hit -> move the focus to the element after the last tab trap
// when the last tab trap is hit -> move the focus to the container

class GridNavigationModel {
  // Props
  private _rows = 0;
  private _columns = 0;
  private _pageSize = 0;
  private _container: null | HTMLElement = null;

  // State
  private focusedRow: null | number = null;
  private focusedColumn: null | number = null;
  private focusedElement: null | HTMLElement = null;
  private focusTrapInside: null | HTMLDivElement = null;
  private focusTrapAfter: null | HTMLDivElement = null;

  public init(container: HTMLElement) {
    this._container = container;

    this.container.addEventListener('focusin', this.onFocus);
    this.container.addEventListener('blur', this.onBlur);

    this.focusTrapInside = this.createFocusTrap(this.onFocusInside);
    this.container.insertBefore(this.focusTrapInside, this.container.firstChild);

    this.focusTrapAfter = this.createFocusTrap(this.onFocusAfter);
    this.container.append(this.focusTrapAfter);
  }

  public destroy() {
    this.container.removeEventListener('focusin', this.onFocus);
    this.container.removeEventListener('blur', this.onBlur);

    if (this.focusTrapInside) {
      this.focusTrapInside.remove();
    }

    if (this.focusTrapAfter) {
      this.focusTrapAfter.remove();
    }
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

  private onFocus() {
    console.log('FOCUS ON WRAPPER');
  }

  private onBlur() {
    console.log('BLUR WRAPPER');
  }

  private createFocusTrap(onFocus: () => void) {
    const div = document.createElement('div');
    div.tabIndex = 0;
    div.addEventListener('focus', onFocus);
    return div;
  }

  private onFocusInside() {}

  private onFocusAfter() {}
}
