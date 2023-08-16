// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TokenGroupProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalTokenGroup from './internal';

export { TokenGroupProps };

export default function TokenGroup({
  items = [],
  alignment = 'horizontal',
  variant = 'default',
  ...props
}: TokenGroupProps) {
  const baseComponentProps = useBaseComponent('TokenGroup');
  return (
    <InternalTokenGroup items={items} alignment={alignment} variant={variant} {...props} {...baseComponentProps} />
  );
}

applyDisplayName(TokenGroup, 'TokenGroup');
