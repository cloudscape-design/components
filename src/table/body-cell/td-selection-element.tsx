// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { KeyboardEventHandler } from 'react';
import SelectionControl from '../selection-control/';
import { getCellClassName, TableTdElementProps } from './td-element.js';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { ItemSelectionProps } from '../use-selection';

type TableBodySelectionCellProps = Omit<TableTdElementProps, 'style' | 'nativeAttributes' | 'onClick' | 'wrapLines'> & {
  onFocusUp?: KeyboardEventHandler;
  onFocusDown?: KeyboardEventHandler;
  onShiftToggle: (value: boolean) => void;
  itemSelectionProps: ItemSelectionProps;
};

export function TableBodySelectionCell({
  className,
  isFirstRow,
  isLastRow,
  isSelected,
  isNextSelected,
  isPrevSelected,
  isEvenRow,
  stripedRows,
  hasFooter,
  onFocusDown,
  onFocusUp,
  onShiftToggle,
  itemSelectionProps,
}: TableBodySelectionCellProps) {
  const isVisualRefresh = useVisualRefresh();
  return (
    <td
      className={clsx(
        className,
        getCellClassName({
          isFirstRow,
          isLastRow,
          isSelected,
          isNextSelected,
          isPrevSelected,
          isEvenRow,
          stripedRows,
          isVisualRefresh,
          hasFooter,
          hasSelection: true,
        })
      )}
    >
      <SelectionControl
        onFocusDown={onFocusDown}
        onFocusUp={onFocusUp}
        onShiftToggle={onShiftToggle}
        {...itemSelectionProps}
      />
    </td>
  );
}
