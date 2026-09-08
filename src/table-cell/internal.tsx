// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useTableContext } from '../table-root/context';
import { TableCellProps } from './interfaces';

import styles from './styles.css.js';

// Internal reuse surface: consumed only when the Table renders the atomic Cell as its body <td>.
// The public surface stays TableCellProps = { disablePaddings, children }.
export interface TableCellInternalProps {
  __ref?: React.Ref<HTMLTableCellElement>;
  __style?: React.CSSProperties;
  __tabIndex?: number;
  __featureClassName?: string;
  __nativeAttributes?: React.TdHTMLAttributes<HTMLTableCellElement>;
  __onClick?: () => void;
  __onFocus?: () => void;
  __onBlur?: () => void;
  __selected?: boolean;
  __shaded?: boolean;
  __prevSelected?: boolean;
  __nextSelected?: boolean;
  __notSelectedNext?: boolean;
  // Sticky-only: the Table's first-row top placeholder only manifests as height under sticky positioning.
  __firstRow?: boolean;
  __lastRow?: boolean;
  __hasFooter?: boolean;
  __isVisualRefresh?: boolean;
  __hasSelection?: boolean;
  __hasStripedRows?: boolean;
  __tableVariant?: string;
}

export function Cell(props: TableCellProps & InternalBaseComponentProps & TableCellInternalProps) {
  const {
    children,
    disablePaddings,
    __internalRootRef,
    __ref,
    __style,
    __tabIndex,
    __featureClassName,
    __nativeAttributes,
    __onClick,
    __onFocus,
    __onBlur,
    __selected,
    __shaded,
    __prevSelected,
    __nextSelected,
    __notSelectedNext,
    __firstRow,
    __lastRow,
    __hasFooter,
    __isVisualRefresh,
    __hasSelection,
    __hasStripedRows,
    __tableVariant,
  } = props;
  const { columnLayout } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const runtimeVisualRefresh = useVisualRefresh();
  const isVisualRefresh = __isVisualRefresh ?? runtimeVisualRefresh;
  const baseProps = getBaseProps(props);
  return (
    <td
      {...baseProps}
      role={isGrid ? 'cell' : undefined}
      ref={__ref ?? __internalRootRef}
      style={__style}
      tabIndex={__tabIndex}
      onClick={__onClick}
      onFocus={__onFocus}
      onBlur={__onBlur}
      {...__nativeAttributes}
      className={clsx(
        baseProps.className,
        styles.cell,
        isGrid && styles['cell-grid'],
        disablePaddings && styles['disable-paddings'],
        __selected && styles['cell-selected'],
        __shaded && styles['cell-shaded'],
        __prevSelected && styles['cell-prev-selected'],
        __nextSelected && styles['cell-next-selected'],
        __notSelectedNext && styles['cell-not-selected-next'],
        __firstRow && styles['body-cell-first-row'],
        __lastRow && styles['body-cell-last-row'],
        __lastRow && __hasFooter && styles['body-cell-has-footer'],
        isVisualRefresh && styles['is-visual-refresh'],
        __hasSelection && styles['has-selection'],
        __hasStripedRows && styles['has-striped-rows'],
        __tableVariant && styles[`table-variant-${__tableVariant}`],
        __featureClassName
      )}
    >
      {children}
    </td>
  );
}
