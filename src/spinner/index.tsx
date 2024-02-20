// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SpinnerProps } from './interfaces';
import InternalSpinner from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useLatencyMetrics } from '../internal/hooks/use-latency-metrics';

export { SpinnerProps };

export default function Spinner({ size = 'normal', variant = 'normal', ...props }: SpinnerProps) {
  const baseComponentProps = useBaseComponent('Spinner');

  // TODO: Add the instanceId when it becomes available.
  useLatencyMetrics('Spinner', baseComponentProps.__internalRootRef, undefined, true, 'spinner');

  return <InternalSpinner size={size} variant={variant} {...props} {...baseComponentProps} />;
}

applyDisplayName(Spinner, 'Spinner');
