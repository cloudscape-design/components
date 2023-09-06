// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AnchorNavigationProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalAnchorNavigation from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { AnchorNavigationProps };

export default function AnchorNavigation({ ...props }: AnchorNavigationProps) {
  const baseComponentProps = useBaseComponent('AnchorNavigation');
  return <InternalAnchorNavigation {...props} {...baseComponentProps} />;
}
applyDisplayName(AnchorNavigation, 'AnchorNavigation');
