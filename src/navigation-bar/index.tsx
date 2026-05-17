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

export default function NavigationBar(props: NavigationBarProps) {
  const baseComponentProps = useBaseComponent('NavigationBar');
  return <InternalNavigationBar {...getExternalProps(props)} {...baseComponentProps} />;
}

applyDisplayName(NavigationBar, 'NavigationBar');
