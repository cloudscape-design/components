// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ScreenreaderOnly from '../internal/components/screenreader-only';
import InternalSkeleton from '../skeleton/internal';
import { TableBodyCell } from './body-cell';
import { TableProps } from './interfaces';
import { StickyColumnsModel } from './sticky-columns';
import { TableRole } from './table-role';
import { getColumnKey } from './utils';

import styles from './styles.css.js';

const noop = () => {};

interface SkeletonRowsProps {
  count: number;
  hasDataRows: boolean;
  totalColumnsCount: number;
  loadingText: string | undefined;
  hasSelection: boolean;
  hasFooter: boolean;
  stickyState: StickyColumnsModel;
  tableRole: TableRole;
  ariaLabels: TableProps['ariaLabels'];
  cellVerticalAlign: TableProps.VerticalAlign | undefined;
  computedVariant: string;
  visibleColumnDefinitions: readonly TableProps.ColumnDefinition<any>[];
  wrapLines: boolean | undefined;
  resizableColumns: boolean | undefined;
  colIndexOffset: number;
}

export function SkeletonRows({
  count,
  hasDataRows,
  totalColumnsCount,
  loadingText,
  hasSelection,
  hasFooter,
  stickyState,
  tableRole,
  ariaLabels,
  cellVerticalAlign,
  computedVariant,
  visibleColumnDefinitions,
  wrapLines,
  resizableColumns,
  colIndexOffset,
}: SkeletonRowsProps) {
  return (
    <>
      <tr aria-hidden="false">
        <td colSpan={totalColumnsCount} className={styles['skeleton-loading-cell']}>
          <ScreenreaderOnly>{loadingText}</ScreenreaderOnly>
        </td>
      </tr>
      {Array.from({ length: count }, (_, i) => {
        const isFirstRow = !hasDataRows && i === 0;
        const isLastRow = i === count - 1;
        return (
          <tr key={`skeleton-row-${i}`} className={styles.row} aria-hidden="true">
            {hasSelection && <td className={styles['selection-control']} />}
            {visibleColumnDefinitions.map((column: any, colIndex: number) => (
              <TableBodyCell
                key={`skeleton-${getColumnKey(column, colIndex)}`}
                isFirstRow={isFirstRow}
                isLastRow={isLastRow}
                isSelected={false}
                isPrevSelected={false}
                isNextSelected={false}
                hasSelection={hasSelection}
                hasFooter={hasFooter}
                stickyState={stickyState}
                tableRole={tableRole}
                resizableStyle={{
                  width: column.width,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                }}
                ariaLabels={ariaLabels}
                column={{
                  ...column,
                  cell: () => <InternalSkeleton variant="dynamic" tagOverride="span" />,
                }}
                item={{}}
                wrapLines={wrapLines}
                isEditable={false}
                isEditing={false}
                isRowHeader={column.isRowHeader}
                resizableColumns={resizableColumns}
                onEditStart={noop}
                onEditEnd={noop}
                columnId={column.id ?? colIndex}
                colIndex={colIndex + colIndexOffset}
                verticalAlign={column.verticalAlign ?? cellVerticalAlign}
                tableVariant={computedVariant}
              />
            ))}
          </tr>
        );
      })}
    </>
  );
}
