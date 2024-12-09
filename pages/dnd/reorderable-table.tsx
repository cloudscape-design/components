// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import clsx from 'clsx';

import { Box, SpaceBetween } from '~components';
import { DndContainer } from '~components/internal/components/dnd-container';
import DragHandle from '~components/internal/components/drag-handle';

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
    option: Item;
    dragHandleAriaLabel?: string;
    listeners?: SyntheticListenerMap;
  }) => {
    const dragHandleAttributes = { ['aria-label']: [props.dragHandleAriaLabel, props.option.id].join(', ') };
    const firstColumn = columnDefinitions[0];
    const enhancedColumns = columnDefinitions.map(def => ({ ...def }));
    enhancedColumns[0] = {
      key: firstColumn.key,
      label: firstColumn.label,
      render: item => (
        <SpaceBetween size="xs" direction="horizontal" alignItems="center">
          <DragHandle attributes={dragHandleAttributes} listeners={props.listeners} />
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
    <DndContainer
      options={items}
      getOptionId={item => item.id}
      onReorder={onReorder}
      renderOption={props => {
        if (props.isActive) {
          return (
            <Box>
              <div className={tableStyles['custom-table']}>
                <table className={clsx(tableStyles['custom-table-table'], tableStyles['use-wrapper-paddings'])}>
                  <tbody>
                    <tr className={styles['active-row']}>
                      {getColumnDefinitions(props).map((column, index) => (
                        <td
                          key={column.key}
                          className={tableStyles['custom-table-cell']}
                          style={{ width: columnWidthsRef.current[index] ?? 0 }}
                        >
                          {column.render(props.option)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Box>
          );
        }
        return (
          <tr ref={props.ref} style={props.style} className={clsx(props.isDragging && styles.placeholder)}>
            {getColumnDefinitions(props).map(column => (
              <td key={column.key} className={tableStyles['custom-table-cell']}>
                {column.render(props.option)}
              </td>
            ))}
          </tr>
        );
      }}
      renderContent={content => (
        <div className={tableStyles['custom-table']}>
          <table
            ref={tableRef}
            className={clsx(tableStyles['custom-table-table'], tableStyles['use-wrapper-paddings'])}
          >
            <thead>
              <tr>
                {columnDefinitions.map(column => (
                  <th key={column.key} className={tableStyles['custom-table-cell']}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
      )}
      i18nStrings={i18nStrings}
    />
  );
}
