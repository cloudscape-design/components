// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { TopNavigationProps } from './interfaces.js';
import InternalTopNavigation from './internal.js';

export { TopNavigationProps };

export default function TopNavigation({ utilities = [], ...restProps }: TopNavigationProps) {
  const baseComponentProps = useBaseComponent('TopNavigation');
  return <InternalTopNavigation {...baseComponentProps} utilities={utilities} {...restProps} />;
}

applyDisplayName(TopNavigation, 'TopNavigation');
