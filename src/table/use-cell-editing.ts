// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';
import { TableProps } from './interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';

export interface CellId {
  rowIndex: number;
  colIndex: number;
}

interface CellEditingProps {
  onCancel?: CancelableEventHandler;
  onSubmit?: TableProps.SubmitEditFunction<any>;
}

export function useCellEditing({ onCancel, onSubmit }: CellEditingProps) {
  const [currentEditCell, setCurrentEditCell] = useState<null | CellId>(null);
  const [lastSuccessfulEditCell, setLastSuccessfulEditCell] = useState<null | CellId>(null);
  const [currentEditLoading, setCurrentEditLoading] = useState(false);

  const startEdit = (cellId: CellId) => {
    setLastSuccessfulEditCell(null);
    setCurrentEditCell(cellId);
  };

  const cancelEdit = useCallback(() => setCurrentEditCell(null), []);

  const completeEdit = (cellId: CellId, editCancelled: boolean) => {
    const eventCancelled = fireCancelableEvent(onCancel, {});
    if (!eventCancelled) {
      setCurrentEditCell(null);
      if (!editCancelled) {
        setLastSuccessfulEditCell(cellId);
      }
    }
  };

  const checkEditing = ({ rowIndex, colIndex }: CellId) =>
    rowIndex === currentEditCell?.rowIndex && colIndex === currentEditCell.colIndex;

  const checkLastSuccessfulEdit = ({ rowIndex, colIndex }: CellId) =>
    rowIndex === lastSuccessfulEditCell?.rowIndex && colIndex === lastSuccessfulEditCell.colIndex;

  const submitEdit = onSubmit
    ? async (...args: Parameters<typeof onSubmit>) => {
        setCurrentEditLoading(true);
        try {
          await onSubmit(...args);
        } finally {
          setCurrentEditLoading(false);
        }
      }
    : undefined;

  return {
    isLoading: currentEditLoading,
    startEdit,
    cancelEdit,
    checkEditing,
    checkLastSuccessfulEdit,
    completeEdit,
    submitEdit,
  };
}
