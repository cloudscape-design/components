// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { IconProviderProps } from './interfaces';
import InternalIconProvider from './internal';

export { IconProviderProps } from './interfaces';
export { defineIcons } from './define-icons';
export type { IconRegistry, IconMap, IconGroupStates, IconGroupName, IconGroupRenderer } from './interfaces';

export default function IconProvider(props: IconProviderProps) {
  useBaseComponent('IconProvider', {
    props: {},
    metadata: {
      iconsCount: Object.keys(props.icons ?? {}).length,
      iconGroupsCount: Object.keys(props.iconGroups ?? {}).length,
    },
  });
  return <InternalIconProvider {...props} />;
}

applyDisplayName(IconProvider, 'IconProvider');
