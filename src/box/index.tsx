// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BoxProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalBox from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { BoxProps };

export default function Box({ variant = 'div', margin = {}, padding = {}, ...props }: BoxProps) {
  const baseComponentProps = useBaseComponent('Box');
  return <InternalBox variant={variant} margin={margin} padding={padding} {...props} {...baseComponentProps} />;
}
applyDisplayName(Box, 'Box');
