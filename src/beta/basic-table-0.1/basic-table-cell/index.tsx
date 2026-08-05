// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { Cell } from '../basic-table/internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BasicTableProps } from '../basic-table/interfaces';

export type BasicTableCellProps = BasicTableProps.CellProps;

function BasicTableCell(props: BasicTableCellProps) {
  return <Cell {...props} />;
}
applyDisplayName(BasicTableCell, 'BasicTableCell');
export default BasicTableCell;
