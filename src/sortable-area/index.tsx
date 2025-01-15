// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { SortableAreaProps } from './interfaces';
import InternalSortableArea, { getBorderRadiusVariant } from './internal';

export { SortableAreaProps };

export default function SortableArea<Data>({ disableReorder = false, ...rest }: SortableAreaProps<Data>) {
  const baseComponentProps = useBaseComponent('SortableArea', {
    props: {},
    metadata: { itemBorderRadius: getBorderRadiusVariant(rest.itemDefinition) },
  });
  return <InternalSortableArea disableReorder={disableReorder} {...getExternalProps(rest)} {...baseComponentProps} />;
}
applyDisplayName(SortableArea, 'SortableArea');
