// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { TooltipProps } from './interfaces';
import InternalTooltip from './internal';

export { TooltipProps };

export default function Tooltip({ position = 'top', triggerVariant, ...rest }: TooltipProps) {
  const baseComponentProps = useBaseComponent('Tooltip', {
    props: { position, triggerVariant },
  });
  const externalProps = getExternalProps(rest);

  return (
    <InternalTooltip position={position} triggerVariant={triggerVariant} {...externalProps} {...baseComponentProps} />
  );
}
applyDisplayName(Tooltip, 'Tooltip');
