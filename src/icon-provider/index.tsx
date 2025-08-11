// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { IconProviderProps } from './interfaces.js';
import InternalIconProvider from './internal.js';

export { IconProviderProps } from './interfaces.js';

/**
 * @awsuiSystem core
 */
export default function IconProvider(props: IconProviderProps) {
  useBaseComponent('IconProvider');
  return <InternalIconProvider {...props} />;
}

applyDisplayName(IconProvider, 'IconProvider');
