// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableRootProps } from './interfaces';
import InternalTableRoot from './internal';

export { TableRootProps };

function TableRoot({ columnLayout = { type: 'auto' }, ...props }: TableRootProps) {
  const baseComponentProps = useBaseComponent('TableRoot', {
    props: {},
    metadata: { columnLayoutType: columnLayout.type },
  });
  return <InternalTableRoot columnLayout={columnLayout} {...props} {...baseComponentProps} />;
}

applyDisplayName(TableRoot, 'TableRoot');

export default TableRoot;
