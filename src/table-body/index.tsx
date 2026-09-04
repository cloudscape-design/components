// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableBodyProps } from './interfaces';
import { Body } from './internal';

export type { TableBodyProps };

function TableBody(props: TableBodyProps) {
  const baseComponentProps = useBaseComponent('TableBody');
  return <Body {...props} {...baseComponentProps} />;
}

applyDisplayName(TableBody, 'TableBody');
export default TableBody;
