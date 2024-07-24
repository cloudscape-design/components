// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalStatusIndicator, { StatusIndicatorProps } from './internal';

export { StatusIndicatorProps };

export default function StatusIndicator({ type = 'success', wrapText = true, ...props }: StatusIndicatorProps) {
  const baseComponentProps = useBaseComponent('StatusIndicator', {
    props: { colorOverride: props.colorOverride, type, wrapText },
  });
  return <InternalStatusIndicator type={type} wrapText={wrapText} {...props} {...baseComponentProps} />;
}

applyDisplayName(StatusIndicator, 'StatusIndicator');
