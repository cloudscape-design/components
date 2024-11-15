// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { TableTdElement, TableTdElementProps } from '../body-cell/td-element';
import { ItemsLoader, ItemsLoaderProps } from './items-loader';

export interface TableLoaderCellProps<ItemType> extends TableTdElementProps, ItemsLoaderProps<ItemType> {}

export function TableLoaderCell<ItemType>({
  item,
  loadingStatus,
  renderLoaderPending,
  renderLoaderLoading,
  renderLoaderError,
  trackBy,
  ...props
}: TableLoaderCellProps<ItemType>) {
  return (
    <TableTdElement {...props}>
      {props.isRowHeader ? (
        <ItemsLoader
          item={item}
          loadingStatus={loadingStatus}
          renderLoaderPending={renderLoaderPending}
          renderLoaderLoading={renderLoaderLoading}
          renderLoaderError={renderLoaderError}
          trackBy={trackBy}
        />
      ) : null}
    </TableTdElement>
  );
}
