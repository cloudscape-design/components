// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { ColumnLayoutProps } from './interfaces';
import InternalColumnLayout from './internal';

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
