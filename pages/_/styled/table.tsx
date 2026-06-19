// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { SpaceBetween } from '~components';
import BaseTable, { TableProps as BaseTableProps } from '~components/table';

import styles from './table.scss';

interface TableProps<T> extends BaseTableProps<T> {
  notifications?: React.ReactNode;
}

export function Table<T>({ notifications, header, ...props }: TableProps<T>) {
  const isEmpty = !props.items || props.items.length === 0;
  return (
    <BaseTable
      {...props}
      header={
        <SpaceBetween size="s">
          {header}
          {notifications}
        </SpaceBetween>
      }
      classNames={{
        container: styles.container,
        table: styles.table,
        cell: isEmpty ? styles['cell-empty'] : undefined,
        selectionCheckbox: styles['selection-checkbox'],
        row: ({ index }) => clsx(styles.row, index % 2 === 1 && styles['row-stripe']),
      }}
    />
  );
}
