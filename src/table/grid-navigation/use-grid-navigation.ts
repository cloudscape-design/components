// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import { findFocusinCell } from './utils';
import { FocusedCell, GridNavigationAPI, GridNavigationProps } from './interfaces';

export function useGridNavigation({ tableRole, pageSize, getContainer }: GridNavigationProps): GridNavigationAPI {
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
    model.update({ pageSize });
  }, [model, pageSize]);

  return model;
}

class GridNavigationModel {
  // Props
  private _pageSize = 0;
  private _container: null | HTMLElement = null;

  // State
  private focusedCell: null | FocusedCell = null;

  public init(container: HTMLElement) {
    this._container = container;

    this.container.addEventListener('focusin', this.onFocusin);
    this.container.addEventListener('focusout', this.onFocusout);
    this.container.addEventListener('keydown', this.onKeydown);
  }

  public destroy() {
    this.container.removeEventListener('focusin', this.onFocusin);
    this.container.removeEventListener('focusout', this.onFocusout);
    this.container.removeEventListener('keydown', this.onKeydown);
  }

  public update({ pageSize }: { pageSize: number }) {
    this._pageSize = pageSize;
    // TODO: validate state
  }

  // TODO: implement
  public focusCell = ({ rowIndex, colIndex }: { rowIndex: number; colIndex: number }) => {
    throw new Error(`focusCell({ rowIndex: ${rowIndex}, colIndex: ${colIndex} }) is not implemented.`);
  };

  private get pageSize() {
    return this._pageSize;
  }

  private get container(): HTMLElement {
    if (!this._container) {
      throw new Error('Invariant violation: GridNavigationModel is used before initialization.');
    }
    return this._container;
  }

  private onFocusin = (event: FocusEvent) => {
    const cell = findFocusinCell(event);
    if (!cell) {
      return;
    }
    this.focusedCell = cell;

    console.log('FOCUS IN', cell.rowIndex, cell.colIndex, cell.element);
  };

  private onFocusout = () => {
    this.focusedCell = null;
  };

  private onKeydown = () => {
    console.log('onkeydown');
  };
}
