// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { TableTdElement, TableTdElementProps } from '../body-cell/td-element';
import { ItemsLoader, ItemsLoaderProps } from './items-loader';

export interface TableLoaderCellProps<ItemType>
  extends Omit<TableTdElementProps, 'isEditable' | 'isEditing' | 'children'>,
    ItemsLoaderProps<ItemType> {}

export function TableLoaderCell<ItemType>({ item, trackBy, children, ...props }: TableLoaderCellProps<ItemType>) {
  return (
    <TableTdElement {...props} isEditable={false} isEditing={false}>
      {props.isRowHeader ? (
        <ItemsLoader item={item} trackBy={trackBy}>
          {children}
        </ItemsLoader>
      ) : null}
    </TableTdElement>
  );
}
