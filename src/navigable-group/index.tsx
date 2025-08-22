// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { NavigableGroupProps } from './interfaces';
import InternalNavigableGroup from './internal';

export { NavigableGroupProps };

const NavigableGroup = React.forwardRef(({ ...rest }: NavigableGroupProps, ref: React.Ref<NavigableGroupProps.Ref>) => {
  const baseProps = getBaseProps(rest);
  const baseComponentProps = useBaseComponent('NavigableGroup');
  const externalProps = getExternalProps(rest);

  return <InternalNavigableGroup {...baseProps} {...baseComponentProps} {...externalProps} ref={ref} />;
});

applyDisplayName(NavigableGroup, 'NavigableGroup');
export default NavigableGroup;
