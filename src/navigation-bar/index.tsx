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

const NavigationBar = React.forwardRef<NavigationBarProps.Ref, NavigationBarProps>(function NavigationBar(
  { variant = 'primary', placement = 'horizontal', ...props },
  ref
) {
  const baseComponentProps = useBaseComponent('NavigationBar', {
    props: { variant, placement, disableBorder: props.disableBorder },
  });
  return (
    <InternalNavigationBar
      ref={ref}
      variant={variant}
      placement={placement}
      {...getExternalProps(props)}
      {...baseComponentProps}
    />
  );
});

export default NavigationBar;

applyDisplayName(NavigationBar, 'NavigationBar');
