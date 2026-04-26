// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { NavigationBarProps } from './interfaces';
import InternalNavigationBar from './internal';

export { NavigationBarProps };

export default function NavigationBar({
  variant = 'primary',
  placement = 'top',
  role = 'region',
  ...restProps
}: NavigationBarProps) {
  const baseComponentProps = useBaseComponent('NavigationBar', {
    props: { variant, placement, role },
  });
  return (
    <InternalNavigationBar
      variant={variant}
      placement={placement}
      role={role}
      {...getExternalProps(restProps)}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(NavigationBar, 'NavigationBar');
