// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { DividerProps } from './interfaces';
import InternalDivider from './internal';

export { DividerProps };

export default function Divider({
  semantic = false,
  orientation = 'horizontal',
  children,
  ariaLabel,
  nativeAttributes,
  ...rest
}: DividerProps) {
  const baseComponentProps = useBaseComponent('Divider', { props: { semantic, orientation } });
  const baseProps = getBaseProps(rest);

  return (
    <InternalDivider
      {...baseProps}
      {...baseComponentProps}
      semantic={semantic}
      orientation={orientation}
      ariaLabel={ariaLabel}
      nativeAttributes={nativeAttributes}
    >
      {children}
    </InternalDivider>
  );
}

applyDisplayName(Divider, 'Divider');
