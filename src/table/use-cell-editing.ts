// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { TableProps } from './interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import AsyncStore from '../area-chart/async-store';

export interface CellId {
  rowIndex: number;
  colIndex: number;
}

interface CellEditingProps<ItemType, ValueType> {
  onCancel?: CancelableEventHandler;
  onSubmit?: TableProps.SubmitEditFunction<ItemType, ValueType>;
}

export interface CellEditingState {
  loading: boolean;
  editingCell: null | CellId;
  lastSuccessfulEdit: null | CellId;
}

export interface CellEditingModel<ItemType, ValueType> extends AsyncStore<CellEditingState> {
  startEdit(cellId: CellId): void;
  cancelEdit(): void;
  completeEdit(cellId: CellId, editCancelled: boolean): void;
  submitEdit(item: ItemType, column: TableProps.ColumnDefinition<ItemType>, newValue: ValueType): Promise<void>;
}

export function useCellEditing<ItemType, ValueType>({
  onCancel,
  onSubmit,
}: CellEditingProps<ItemType, ValueType>): CellEditingModel<ItemType, ValueType> {
  const store = useMemo(() => new CellEditingStore<ItemType, ValueType>(), []);

  // Synchronize handlers.
  store.onCancel = onCancel;
  store.onSubmit = onSubmit;

  return store;
}

class CellEditingStore<ItemType, ValueType> extends AsyncStore<CellEditingState> {
  onCancel?: CancelableEventHandler;
  onSubmit?: TableProps.SubmitEditFunction<ItemType, ValueType>;

  constructor() {
    super({ loading: false, editingCell: null, lastSuccessfulEdit: null });
  }

  public startEdit = (cellId: CellId) => {
    this.set(prev => ({ ...prev, editingCell: cellId, lastSuccessfulEdit: null }));
  };

  public cancelEdit = () => this.set(prev => ({ ...prev, editingCell: null }));

  public completeEdit = (cellId: CellId, editCancelled: boolean) => {
    const eventCancelled = fireCancelableEvent(this.onCancel, {});
    if (!eventCancelled) {
      this.set(prev =>
        !editCancelled ? { ...prev, editingCell: null, lastSuccessfulEdit: cellId } : { ...prev, editingCell: null }
      );
    }
  };

  public submitEdit = async (item: ItemType, column: TableProps.ColumnDefinition<ItemType>, newValue: ValueType) => {
    if (!this.onSubmit) {
      throw new Error('The function `handleSubmit` is required for editable columns');
    }
    this.set(prev => ({ ...prev, loading: true }));
    try {
      await this.onSubmit(item, column, newValue);
    } finally {
      this.set(prev => ({ ...prev, loading: false }));
    }
  };
}
