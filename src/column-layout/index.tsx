// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalColumnLayout from './internal';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { ColumnLayoutProps } from './interfaces';

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
