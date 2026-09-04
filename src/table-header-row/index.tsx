// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableHeaderRowProps } from './interfaces';
import { HeaderRow } from './internal';

export type { TableHeaderRowProps };

function TableHeaderRow(props: TableHeaderRowProps) {
  const baseComponentProps = useBaseComponent('TableHeaderRow');
  return <HeaderRow {...props} {...baseComponentProps} />;
}

applyDisplayName(TableHeaderRow, 'TableHeaderRow');
export default TableHeaderRow;
