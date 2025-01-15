// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { DragHandleProps } from './interfaces';
import InternalDragHandle from './internal';

export { DragHandleProps };

export default function DragHandle({ variant = 'drag-indicator', size = 'normal', ...rest }: DragHandleProps) {
  const baseComponentProps = useBaseComponent('DragHandle', {
    props: {
      variant,
      size,
    },
  });
  return <InternalDragHandle variant={variant} size={size} {...getExternalProps(rest)} {...baseComponentProps} />;
}
applyDisplayName(DragHandle, 'DragHandle');
