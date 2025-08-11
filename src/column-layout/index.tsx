// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { getExternalProps } from '../internal/utils/external-props.js';
import { ColumnLayoutProps } from './interfaces.js';
import InternalColumnLayout from './internal.js';

export { ColumnLayoutProps };

export default function ColumnLayout({
  columns = 1,
  variant = 'default',
  borders = 'none',
  disableGutters = false,
  ...props
}: ColumnLayoutProps) {
  const baseComponentProps = useBaseComponent('ColumnLayout', {
    props: { borders, columns, disableGutters, minColumnWidth: props.minColumnWidth, variant },
  });
  const externalProps = getExternalProps(props);
  return (
    <InternalColumnLayout
      columns={columns}
      variant={variant}
      borders={borders}
      disableGutters={disableGutters}
      {...externalProps}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(ColumnLayout, 'ColumnLayout');
