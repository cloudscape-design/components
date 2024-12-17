// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { Box, SpaceBetween } from '~components';
import { DndArea } from '~components/internal/components/dnd-area';
import DragHandle, { DragHandleProps } from '~components/internal/components/drag-handle';

import { i18nStrings } from './commons';

import tableStyles from '../table-fragments/styles.scss';
import styles from './styles.scss';

interface ColumnDefinition<Item> {
  key: string;
  label: string;
  render: (item: Item) => React.ReactNode;
}

export function ReorderableTable<Item extends { id: string }>({
  items,
  onReorder,
  columnDefinitions,
}: {
  items: readonly Item[];
  onReorder: (items: readonly Item[]) => void;
  columnDefinitions: readonly ColumnDefinition<Item>[];
}) {
  const getColumnDefinitions = (props: {
    dragHandleAttributes: DragHandleProps['attributes'];
    dragHandleListeners?: DragHandleProps['listeners'];
  }) => {
    const firstColumn = columnDefinitions[0];
    const enhancedColumns = columnDefinitions.map(def => ({ ...def }));
    enhancedColumns[0] = {
      key: firstColumn.key,
      label: firstColumn.label,
      render: item => (
        <SpaceBetween size="xs" direction="horizontal" alignItems="center">
          <DragHandle attributes={props.dragHandleAttributes} listeners={props.dragHandleListeners} />
          <Box>{firstColumn.render(item)}</Box>
        </SpaceBetween>
      ),
    };
    return enhancedColumns;
  };

  const tableRef = useRef<HTMLTableElement>(null);
  const columnWidthsRef = useRef<number[]>([]);
  useEffect(() => {
    if (tableRef.current) {
      const headerCells = Array.from(tableRef.current.querySelectorAll('th'));
      columnWidthsRef.current = headerCells.map(cell => cell.getBoundingClientRect().width);
    }
  });

  return (
    <div className={tableStyles['custom-table']}>
      <table ref={tableRef} className={clsx(tableStyles['custom-table-table'], tableStyles['use-wrapper-paddings'])}>
        <thead>
          <tr>
            {columnDefinitions.map(column => (
              <th key={column.key} className={tableStyles['custom-table-cell']}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <DndArea
            items={items.map(data => ({ id: data.id, label: data.id, data }))}
            onItemsChange={items => onReorder(items.map(item => item.data))}
            renderItem={props => {
              const row = (
                <tr
                  ref={props.ref}
                  className={clsx(props.isActive ? styles['active-row'] : clsx(props.isDragging && styles.placeholder))}
                  style={props.isActive ? {} : props.style}
                >
                  {getColumnDefinitions(props).map((column, index) => (
                    <td
                      key={column.key}
                      className={tableStyles['custom-table-cell']}
                      style={props.isActive ? { width: columnWidthsRef.current[index] ?? 0 } : undefined}
                    >
                      {column.render(props.item.data)}
                    </td>
                  ))}
                </tr>
              );
              return !props.isActive ? (
                row
              ) : (
                <Box>
                  <div className={tableStyles['custom-table']}>
                    <table className={clsx(tableStyles['custom-table-table'], tableStyles['use-wrapper-paddings'])}>
                      <tbody>{row}</tbody>
                    </table>
                  </div>
                </Box>
              );
            }}
            i18nStrings={i18nStrings}
          />
        </tbody>
      </table>
    </div>
  );
}
