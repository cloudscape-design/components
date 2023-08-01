// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalStatusIndicator, { StatusIndicatorProps } from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { StatusIndicatorProps };

export default function StatusIndicator({ type = 'success', wrapText = true, ...props }: StatusIndicatorProps) {
  const baseComponentProps = useBaseComponent('StatusIndicator', { type });
  return <InternalStatusIndicator type={type} wrapText={wrapText} {...props} {...baseComponentProps} />;
}

applyDisplayName(StatusIndicator, 'StatusIndicator');
