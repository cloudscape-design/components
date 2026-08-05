// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';

import { applyDisplayName } from '../internal/utils/apply-display-name';
import { HeaderCell } from '../basic-table/internal';
import { BasicTableProps } from '../basic-table/interfaces';

applyDisplayName(HeaderCell, 'BasicTableHeaderCell');

export default HeaderCell;
export type BasicTableHeaderCellProps = BasicTableProps.HeaderCellProps;
