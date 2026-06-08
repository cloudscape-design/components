// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BreadcrumbGroup, { BreadcrumbGroupProps } from '@cloudscape-design/components/breadcrumb-group';

export function Breadcrumbs({ items }: { items: BreadcrumbGroupProps['items'] }) {
  return (
    <BreadcrumbGroup
      items={[{ text: 'Service', href: '#' }, ...items]}
      expandAriaLabel="Show path"
      ariaLabel="Breadcrumbs"
    />
  );
}
