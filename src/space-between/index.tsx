// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalSpaceBetween from './internal';
import { SpaceBetweenProps } from './interfaces';
import useBaseComponent from '../internal/hooks/use-base-component';

export { SpaceBetweenProps };

export default function SpaceBetween({ direction = 'vertical', ...props }: SpaceBetweenProps) {
  const baseComponentProps = useBaseComponent('SpaceBetween', {
    props: { alignItems: props.alignItems, direction, size: props.size },
  });
  return <InternalSpaceBetween direction={direction} {...props} {...baseComponentProps} />;
}

applyDisplayName(SpaceBetween, 'SpaceBetween');
