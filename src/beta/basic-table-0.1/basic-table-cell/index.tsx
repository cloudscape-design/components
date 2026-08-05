// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';

import { applyDisplayName } from '../internal/utils/apply-display-name';
import { Cell } from '../basic-table/internal';
import { BasicTableProps } from '../basic-table/interfaces';

applyDisplayName(Cell, 'BasicTableCell');

export default Cell;
export type BasicTableCellProps = BasicTableProps.CellProps;
