// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableBodyProps } from './interfaces';
import InternalTableBody from './internal';

export { TableBodyProps };

function TableBody(props: TableBodyProps) {
  const baseComponentProps = useBaseComponent('TableBody');
  return <InternalTableBody {...props} {...baseComponentProps} />;
}

applyDisplayName(TableBody, 'TableBody');
export default TableBody;
