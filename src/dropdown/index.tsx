// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { DropdownProps } from './interfaces';
import InternalDropdown from './internal';

export { DropdownProps };

/**
 * @awsuiSystem core
 */
export default function Dropdown({ ...props }: DropdownProps) {
  const baseComponentProps = useBaseComponent('Dropdown');
  return <InternalDropdown {...props} {...baseComponentProps} />;
}
applyDisplayName(Dropdown, 'Dropdown');
