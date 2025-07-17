// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ListProps } from './interfaces';
import InternalList from './internal';

export { ListProps };

export default function List<T = any>(props: ListProps<T>) {
  const baseComponentProps = useBaseComponent('List');
  return <InternalList {...baseComponentProps} {...props} />;
}

applyDisplayName(List, 'List');
