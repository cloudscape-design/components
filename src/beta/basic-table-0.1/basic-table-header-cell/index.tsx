// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { HeaderCell } from '../basic-table/internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BasicTableProps } from '../basic-table/interfaces';

export type BasicTableHeaderCellProps = BasicTableProps.HeaderCellProps;

function BasicTableHeaderCell(props: BasicTableHeaderCellProps) {
  return <HeaderCell {...props} />;
}
applyDisplayName(BasicTableHeaderCell, 'BasicTableHeaderCell');
export default BasicTableHeaderCell;
