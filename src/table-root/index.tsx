// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableRootProps } from './interfaces';
import { InternalRoot } from './internal';

// Root of the atomic table. The parts (TableHead, TableRow, …) are sibling top-level components;
// keeping each dir single-component (one default export + its props type) is what lets the
// documenter treat every part as its own documented component.
export type { TableRootProps };

function TableRoot({ columnLayout = { type: 'auto' }, ...props }: TableRootProps) {
  const baseComponentProps = useBaseComponent('TableRoot', {
    props: {},
    metadata: { columnLayoutType: columnLayout.type },
  });
  return <InternalRoot columnLayout={columnLayout} {...props} {...baseComponentProps} />;
}

applyDisplayName(TableRoot, 'TableRoot');

export default TableRoot;
