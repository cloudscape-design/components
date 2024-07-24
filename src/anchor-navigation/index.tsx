// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { AnchorNavigationProps } from './interfaces';
import InternalAnchorNavigation from './internal';

export { AnchorNavigationProps };

export default function AnchorNavigation({ scrollSpyOffset = 0, ...props }: AnchorNavigationProps) {
  const baseComponentProps = useBaseComponent('AnchorNavigation');
  return <InternalAnchorNavigation scrollSpyOffset={scrollSpyOffset} {...props} {...baseComponentProps} />;
}
applyDisplayName(AnchorNavigation, 'AnchorNavigation');
