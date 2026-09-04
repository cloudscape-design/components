// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableRowProps } from './interfaces';
import { Row } from './internal';

export type { TableRowProps };

function TableRow(props: TableRowProps) {
  const baseComponentProps = useBaseComponent('TableRow', { props: { variant: props.variant } });
  return <Row {...props} {...baseComponentProps} />;
}

applyDisplayName(TableRow, 'TableRow');
export default TableRow;
