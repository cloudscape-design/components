// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableSortButtonProps } from './interfaces';
import InternalTableSortButton from './internal';

export { TableSortButtonProps };

function TableSortButton(props: TableSortButtonProps) {
  const baseComponentProps = useBaseComponent('TableSortButton');
  return <InternalTableSortButton {...props} {...baseComponentProps} />;
}

applyDisplayName(TableSortButton, 'TableSortButton');
export default TableSortButton;
