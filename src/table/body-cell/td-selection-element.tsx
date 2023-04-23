// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef, KeyboardEventHandler } from 'react';
import styles from './styles.css.js';
import { useStickyStyles } from '../sticky-state-model';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { TableTdElementProps } from './td-element.js';
import SelectionControl from '../selection-control/';
import { TableProps } from '../interfaces.js';

type TableBodySelectionCellProps = Omit<
  TableTdElementProps,
  'style' | 'nativeAttributes' | 'onClick' | 'tdRef' | 'hasSelection' | 'wrapLines' | 'columnId'
> & {
  selectionType?: 'single' | 'multi';
  onFocusUp?: KeyboardEventHandler;
  onFocusDown?: KeyboardEventHandler;
  onShiftToggle: (value: boolean) => void;
  itemSelectionProps: {
    name: string;
    selectionType: TableProps.SelectionType | undefined;
    ariaLabel: string | undefined;
    onChange: () => void;
    checked: boolean;
    disabled: boolean;
  };
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
  stickyState,
  selectionType,
  onFocusDown,
  onFocusUp,
  onShiftToggle,
  itemSelectionProps,
}: TableBodySelectionCellProps) {
  const ref = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLTableCellElement | null>;
  const isVisualRefresh = useVisualRefresh();
  const stickyClassNames = useStickyStyles({ stickyState, ref, columnId: 'awsui-selection-column', cellType: 'td' });
  if (selectionType !== undefined) {
    return (
      <td
        style={stickyClassNames.style}
        className={clsx(
          className,
          styles['body-cell'],
          styles['has-selection'],
          isFirstRow && styles['body-cell-first-row'],
          isLastRow && styles['body-cell-last-row'],
          isSelected && styles['body-cell-selected'],
          isNextSelected && styles['body-cell-next-selected'],
          isPrevSelected && styles['body-cell-prev-selected'],
          !isEvenRow && stripedRows && styles['body-cell-shaded'],
          stripedRows && styles['has-striped-rows'],
          isVisualRefresh && styles['is-visual-refresh'],
          hasFooter && styles['has-footer'],
          stickyClassNames.className
        )}
        ref={ref}
      >
        <SelectionControl
          onFocusDown={onFocusDown}
          onFocusUp={onFocusUp}
          onShiftToggle={onShiftToggle}
          {...itemSelectionProps}
        />
      </td>
    );
  } else {
    return null;
  }
}
