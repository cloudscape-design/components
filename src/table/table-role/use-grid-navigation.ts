// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import { findFocusinCell, moveFocusBy } from './utils';
import { FocusedCell, GridNavigationAPI, GridNavigationProps } from './interfaces';
import { KeyCode } from '../../internal/keycode';

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

  // Notify the model of the props change.
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

    switch (key) {
      case KeyCode.up:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: -1, colIndex: 0 });

      case KeyCode.down:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: 1, colIndex: 0 });

      case KeyCode.left:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: 0, colIndex: -1 });

      case KeyCode.right:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: 0, colIndex: 1 });

      case KeyCode.pageUp:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: -this.pageSize, colIndex: 0 });

      case KeyCode.pageDown:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: this.pageSize, colIndex: 0 });

      case KeyCode.home:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: 0, colIndex: minExtreme });

      case KeyCode.end:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: 0, colIndex: maxExtreme });

      case -KeyCode.home:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: minExtreme, colIndex: minExtreme });

      case -KeyCode.end:
        event.preventDefault();
        return moveFocusBy(this.container, from, { rowIndex: maxExtreme, colIndex: maxExtreme });

      default:
        return;
    }
  };
}
