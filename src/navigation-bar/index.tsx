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
  placement = 'block-start',
  sticky = false,
  disablePadding = false,
  ...restProps
}: NavigationBarProps) {
  const baseComponentProps = useBaseComponent('NavigationBar', {
    props: { variant, placement, sticky, disablePadding },
  });
  return (
    <InternalNavigationBar
      variant={variant}
      placement={placement}
      sticky={sticky}
      disablePadding={disablePadding}
      {...getExternalProps(restProps)}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(NavigationBar, 'NavigationBar');
