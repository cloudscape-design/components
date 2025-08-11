// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { AnchorNavigationProps } from './interfaces.js';
import InternalAnchorNavigation from './internal.js';

export { AnchorNavigationProps };

export default function AnchorNavigation({ scrollSpyOffset = 0, ...props }: AnchorNavigationProps) {
  const baseComponentProps = useBaseComponent('AnchorNavigation');
  return <InternalAnchorNavigation scrollSpyOffset={scrollSpyOffset} {...props} {...baseComponentProps} />;
}
applyDisplayName(AnchorNavigation, 'AnchorNavigation');
