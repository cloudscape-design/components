// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableHeadProps } from './interfaces';
import { Head } from './internal';

export type { TableHeadProps };

function TableHead(props: TableHeadProps) {
  const baseComponentProps = useBaseComponent('TableHead');
  return <Head {...props} {...baseComponentProps} />;
}

applyDisplayName(TableHead, 'TableHead');
export default TableHead;
