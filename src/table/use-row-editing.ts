// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

import { fireCancelableEvent } from '../internal/events';
import { CancelableEventHandler } from '../types/events';
import { TableProps } from './interfaces';

export type RowEditValues = Map<string, unknown>; // columnKey → value

export interface RowEditState<T> {
  item: T;
  rowId: string;
  values: RowEditValues;
}

interface UseRowEditingProps<T> {
  onCancel?: CancelableEventHandler;
  onSubmit?: TableProps.SubmitRowEditFunction<T>;
}

export function useRowEditing<T>({ onCancel, onSubmit }: UseRowEditingProps<T>) {
  const [currentEditRow, setCurrentEditRow] = useState<RowEditState<T> | null>(null);
  const [lastSuccessfulEditRow, setLastSuccessfulEditRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startRowEdit = useCallback((item: T, rowId: string) => {
    setLastSuccessfulEditRow(null);
    setCurrentEditRow({ item, rowId, values: new Map() });
  }, []);

  const cancelRowEdit = useCallback(() => {
    const eventCancelled = fireCancelableEvent(onCancel, {});
    if (!eventCancelled) {
      setCurrentEditRow(null);
    }
  }, [onCancel]);

  const setColumnValue = useCallback((colKey: string, value: unknown) => {
    setCurrentEditRow(prev => {
      if (!prev) {
        return prev;
      }
      const next = new Map(prev.values);
      next.set(colKey, value);
      return { ...prev, values: next };
    });
  }, []);

  const submitRowEdit = onSubmit
    ? async () => {
        if (!currentEditRow) {
          return;
        }
        setIsLoading(true);
        try {
          await onSubmit(currentEditRow.item, currentEditRow.values);
          setLastSuccessfulEditRow(currentEditRow.rowId);
          setCurrentEditRow(null);
        } finally {
          setIsLoading(false);
        }
      }
    : undefined;

  const isRowEditing = (rowId: string) => currentEditRow?.rowId === rowId;
  const isLastSuccessfulEditRow = (rowId: string) => lastSuccessfulEditRow === rowId;
  const getColumnValue = (colKey: string): unknown => currentEditRow?.values.get(colKey);

  return {
    currentEditRow,
    isLoading,
    startRowEdit,
    cancelRowEdit,
    setColumnValue,
    submitRowEdit,
    isRowEditing,
    isLastSuccessfulEditRow,
    getColumnValue,
  };
}
