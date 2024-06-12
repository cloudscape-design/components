// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { FunnelBreadcrumbItem } from './item/funnel';
import { BreadcrumbGroupProps, InternalBreadcrumbGroupProps } from './interfaces';

export function BreadcrumbGroupSkeleton<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item>({
  items,
}: InternalBreadcrumbGroupProps<T>) {
  const lastItem = items[items.length - 1];
  if (!lastItem) {
    return <></>;
  }
  return <FunnelBreadcrumbItem hidden={true} last={true} text={lastItem.text} />;
}
