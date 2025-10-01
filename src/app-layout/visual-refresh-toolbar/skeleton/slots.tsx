// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BreadcrumbGroupImplementation } from '../../../breadcrumb-group/implementation';
import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { BreadcrumbsSlotContext } from '../contexts';

import styles from './styles.css.js';

interface ToolbarSlotProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ToolbarSlot = React.forwardRef<HTMLElement, ToolbarSlotProps>(({ className, style, children }, ref) => (
  <section
    ref={ref as React.Ref<any>}
    className={clsx(styles['toolbar-container'], className)}
    style={{
      insetBlockStart: style?.insetBlockStart ?? 0,
      ...style,
    }}
  >
    {children}
  </section>
));

interface NotificationsSlotProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const NotificationsSlot = React.forwardRef<HTMLElement, NotificationsSlotProps>(
  ({ className, style, children }, ref) => (
    <div ref={ref as React.Ref<any>} className={clsx(styles['notifications-container'], className)} style={style}>
      {children}
    </div>
  )
);

interface BreadcrumbsSlotProps {
  ownBreadcrumbs: React.ReactNode;
  discoveredBreadcrumbs?: BreadcrumbGroupProps | null;
}

export function BreadcrumbsSlot({ ownBreadcrumbs, discoveredBreadcrumbs }: BreadcrumbsSlotProps) {
  const isSSR = typeof window === 'undefined';
  const contextValue = React.useMemo(() => ({ isInToolbar: true }), []);

  return (
    <BreadcrumbsSlotContext.Provider value={contextValue}>
      <div className={styles['breadcrumbs-own']}>{ownBreadcrumbs}</div>
      {discoveredBreadcrumbs && !isSSR && (
        <div className={styles['breadcrumbs-discovered']}>
          <BreadcrumbGroupImplementation
            {...discoveredBreadcrumbs}
            data-awsui-discovered-breadcrumbs={true}
            __injectAnalyticsComponentMetadata={true}
          />
        </div>
      )}
    </BreadcrumbsSlotContext.Provider>
  );
}
