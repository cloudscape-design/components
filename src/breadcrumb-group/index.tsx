// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BreadcrumbGroupProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import useBaseComponent from '../internal/hooks/use-base-component';
import { InternalBreadcrumbGroup } from './internal';

export { BreadcrumbGroupProps };

export default function BreadcrumbGroup<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item>({
  items = [],
  ...props
}: BreadcrumbGroupProps<T>) {
  const baseComponentProps = useBaseComponent('BreadcrumbGroup');
  return <InternalBreadcrumbGroup items={items} {...props} {...baseComponentProps} />;
}

applyDisplayName(BreadcrumbGroup, 'BreadcrumbGroup');
