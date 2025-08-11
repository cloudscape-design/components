// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { SpaceBetweenProps } from './interfaces.js';
import InternalSpaceBetween from './internal.js';

export { SpaceBetweenProps };

export default function SpaceBetween({ direction = 'vertical', ...props }: SpaceBetweenProps) {
  const baseComponentProps = useBaseComponent('SpaceBetween', {
    props: { alignItems: props.alignItems, direction, size: props.size },
  });
  return <InternalSpaceBetween direction={direction} {...props} {...baseComponentProps} />;
}

applyDisplayName(SpaceBetween, 'SpaceBetween');
