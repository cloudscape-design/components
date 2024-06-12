// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { SideNavigationProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { InternalSideNavigation } from './internal';

export { SideNavigationProps };

export default function SideNavigation({ items = [], ...props }: SideNavigationProps) {
  const internalProps = useBaseComponent('SideNavigation');
  return <InternalSideNavigation {...props} {...internalProps} items={items} />;
}

applyDisplayName(SideNavigation, 'SideNavigation');
