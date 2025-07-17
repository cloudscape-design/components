// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { TableTdElement, TableTdElementProps } from '../body-cell/td-element';
import { ItemsLoader, ItemsLoaderProps } from './items-loader';

export interface TableLoaderCellProps<ItemType>
  extends Omit<TableTdElementProps, 'isEditable' | 'isEditing' | 'children'>,
    ItemsLoaderProps<ItemType> {}

export function TableLoaderCell<ItemType>({
  item,
  trackBy,
  counter,
  children,
  ...props
}: TableLoaderCellProps<ItemType>) {
  return props.isRowHeader ? (
    <TableTdElement {...props} counter={counter} isEditable={false} isEditing={false}>
      <ItemsLoader item={item} trackBy={trackBy}>
        {children}
      </ItemsLoader>
    </TableTdElement>
  ) : (
    <TableTdElement {...props} isEditable={false} isEditing={false}>
      {null}
    </TableTdElement>
  );
}
