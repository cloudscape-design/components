// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_FUNNEL_NAME } from '../../internal/analytics/selectors';

import styles from './styles.css.js';

interface FunnelBreadcrumbItemProps {
  text: string;
  last: boolean;
  hidden?: boolean;
}

export const FunnelBreadcrumbItem = React.forwardRef<HTMLSpanElement, FunnelBreadcrumbItemProps>(
  ({ text, hidden, last }, ref) => {
    const funnelAttributes: Record<string, string> = {};
    if (last) {
      funnelAttributes[DATA_ATTR_FUNNEL_KEY] = FUNNEL_KEY_FUNNEL_NAME;
    }

    return (
      <span {...funnelAttributes} className={clsx(styles.text, hidden && styles['text-hidden'])} ref={ref}>
        {text}
      </span>
    );
  }
);
