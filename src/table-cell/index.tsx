// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableCellProps } from './interfaces';
import { Cell } from './internal';

export type { TableCellProps };

function TableCell(props: TableCellProps) {
  const baseComponentProps = useBaseComponent('TableCell');
  return <Cell {...props} {...baseComponentProps} />;
}

applyDisplayName(TableCell, 'TableCell');
export default TableCell;
