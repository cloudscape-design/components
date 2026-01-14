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

/**
 * @awsuiSystem core
 */
export default function Tooltip({ position = 'top', ...rest }: TooltipProps) {
  const baseComponentProps = useBaseComponent('Tooltip', {
    props: { position },
  });
  const externalProps = getExternalProps(rest);

  return <InternalTooltip position={position} {...externalProps} {...baseComponentProps} />;
}
applyDisplayName(Tooltip, 'Tooltip');
