// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { DrawerProps } from './interfaces';
import { InternalDrawer } from './internal';

export { DrawerProps };

export default function Drawer(props: DrawerProps) {
  const internalProps = useBaseComponent('Drawer');
  return <InternalDrawer {...internalProps} {...props} />;
}

applyDisplayName(Drawer, 'Drawer');
