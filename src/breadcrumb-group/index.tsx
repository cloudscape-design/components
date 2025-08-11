// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { useSetGlobalBreadcrumbs } from '../internal/plugins/helpers/use-global-breadcrumbs.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { BreadcrumbGroupProps } from './interfaces.js';
import { InternalBreadcrumbGroup } from './internal.js';
import { BreadcrumbGroupSkeleton } from './skeleton.js';

export { BreadcrumbGroupProps };

export default function BreadcrumbGroup<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item>({
  items = [],
  ...props
}: BreadcrumbGroupProps<T>) {
  const registeredGlobally = useSetGlobalBreadcrumbs({ items, ...props });
  const baseComponentProps = useBaseComponent('BreadcrumbGroup');

  if (registeredGlobally) {
    return <BreadcrumbGroupSkeleton items={items} />;
  }

  return (
    <InternalBreadcrumbGroup
      items={items}
      {...props}
      {...baseComponentProps}
      __injectAnalyticsComponentMetadata={true}
    />
  );
}

applyDisplayName(BreadcrumbGroup, 'BreadcrumbGroup');
