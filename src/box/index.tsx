// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { BoxProps } from './interfaces.js';
import InternalBox from './internal.js';

export { BoxProps };

export default function Box({ variant = 'div', margin = {}, padding = {}, ...props }: BoxProps) {
  const baseComponentProps = useBaseComponent('Box', {
    props: {
      color: props.color,
      display: props.display,
      float: props.float,
      fontSize: props.fontSize,
      fontWeight: props.fontWeight,
      textAlign: props.textAlign,
      variant,
    },
  });
  return <InternalBox variant={variant} margin={margin} padding={padding} {...props} {...baseComponentProps} />;
}
applyDisplayName(Box, 'Box');
