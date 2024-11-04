// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import {
  DATA_ATTR_FUNNEL_KEY,
  DATA_ATTR_RESOURCE_TYPE,
  FUNNEL_KEY_FUNNEL_NAME,
} from '../../internal/analytics/selectors';

import analyticsSelectors from '../analytics-metadata/styles.css.js';

interface FunnelBreadcrumbItemProps {
  className?: string;
  text: string;
  itemIndex: number;
  totalCount: number;
  disableAnalytics?: boolean;
}

export const FunnelBreadcrumbItem = React.forwardRef<HTMLSpanElement, FunnelBreadcrumbItemProps>(
  ({ className, text, itemIndex, totalCount, disableAnalytics }, ref) => {
    const funnelAttributes: Record<string, string> = {};
    if (!disableAnalytics) {
      if (itemIndex === totalCount - 1) {
        funnelAttributes[DATA_ATTR_FUNNEL_KEY] = FUNNEL_KEY_FUNNEL_NAME;
      }
      if (itemIndex === 1) {
        funnelAttributes[DATA_ATTR_RESOURCE_TYPE] = 'true';
      }
    }

    return (
      <span
        {...funnelAttributes}
        className={clsx(className, !disableAnalytics && analyticsSelectors['breadcrumb-item'])}
        ref={ref}
      >
        {text}
      </span>
    );
  }
);
