// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalBreadcrumbGroupProps } from './interfaces';
import { FunnelBreadcrumbItem } from './item/funnel';

import styles from './styles.css.js';

export const BreadcrumbGroupSkeleton = React.forwardRef<HTMLElement, InternalBreadcrumbGroupProps>(({ items }, ref) => (
  <div ref={ref as React.Ref<HTMLDivElement>} className={styles['breadcrumbs-skeleton']}>
    {items.map((item, index) => (
      <FunnelBreadcrumbItem itemIndex={index} totalCount={items.length} text={item.text} key={index} />
    ))}
  </div>
));
