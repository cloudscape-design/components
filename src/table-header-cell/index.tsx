// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableHeaderCellProps } from './interfaces';
import { HeaderCell } from './internal';

export type { TableHeaderCellProps };

function TableHeaderCell(props: TableHeaderCellProps) {
  const baseComponentProps = useBaseComponent('TableHeaderCell');
  return <HeaderCell {...props} {...baseComponentProps} />;
}

applyDisplayName(TableHeaderCell, 'TableHeaderCell');
export default TableHeaderCell;
