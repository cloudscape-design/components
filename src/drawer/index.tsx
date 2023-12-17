// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { DrawerProps } from './interfaces';
import InternalDrawer from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { DrawerProps };

export default function Drawer({ ...props }: DrawerProps) {
  const baseComponentProps = useBaseComponent('Drawer');
  return <InternalDrawer {...props} {...baseComponentProps} />;
}

applyDisplayName(Drawer, 'Drawer');
