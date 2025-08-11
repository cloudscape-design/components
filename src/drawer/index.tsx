// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { DrawerProps } from './interfaces.js';
import { InternalDrawer } from './internal.js';

export { DrawerProps };

export default function Drawer(props: DrawerProps) {
  const internalProps = useBaseComponent('Drawer');
  return <InternalDrawer {...internalProps} {...props} />;
}

applyDisplayName(Drawer, 'Drawer');
