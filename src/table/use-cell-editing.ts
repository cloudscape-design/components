// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import { TableProps } from './interfaces';

interface CellId {
  row: string; // Item ID (from trackBy) or row index
  col: string; // Column ID or column index
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

  const checkEditing = ({ row, col }: CellId) => row === currentEditCell?.row && col === currentEditCell.col;

  const checkLastSuccessfulEdit = ({ row, col }: CellId) =>
    row === lastSuccessfulEditCell?.row && col === lastSuccessfulEditCell.col;

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
