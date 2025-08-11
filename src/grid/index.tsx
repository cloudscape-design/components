// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component/index.js';
import { useContainerBreakpoints } from '../internal/hooks/container-queries/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GridProps } from './interfaces.js';
import InternalGrid from './internal.js';

export { GridProps };

export default function Grid({ gridDefinition = [], disableGutters = false, children, ...restProps }: GridProps) {
  const baseComponentProps = useBaseComponent('Grid', {
    props: { disableGutters },
  });
  const baseProps = getBaseProps(restProps);
  const [breakpoint, ref] = useContainerBreakpoints(undefined);

  return (
    <InternalGrid
      {...baseProps}
      {...baseComponentProps}
      ref={ref}
      __breakpoint={breakpoint}
      gridDefinition={gridDefinition}
      disableGutters={disableGutters}
    >
      {children}
    </InternalGrid>
  );
}

applyDisplayName(Grid, 'Grid');
