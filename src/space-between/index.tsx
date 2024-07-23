// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SpaceBetweenProps } from './interfaces';
import InternalSpaceBetween from './internal';

export { SpaceBetweenProps };

export default function SpaceBetween({ direction = 'vertical', ...props }: SpaceBetweenProps) {
  const baseComponentProps = useBaseComponent('SpaceBetween', {
    props: { alignItems: props.alignItems, direction, size: props.size },
  });
  return <InternalSpaceBetween direction={direction} {...props} {...baseComponentProps} />;
}

applyDisplayName(SpaceBetween, 'SpaceBetween');
