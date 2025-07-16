// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { IconProviderProps } from './interfaces';
import InternalIconProvider from './internal';

export { IconProviderProps } from './interfaces';

/**
 * @awsuiSystem core
 */
export default function IconProvider(props: IconProviderProps) {
  useBaseComponent('IconProvider');
  return <InternalIconProvider {...props} />;
}

applyDisplayName(IconProvider, 'IconProvider');
