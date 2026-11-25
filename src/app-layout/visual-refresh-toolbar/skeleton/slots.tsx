// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BreadcrumbGroupImplementation } from '../../../breadcrumb-group/implementation';
import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { isAppLayoutHideToolbar, isAppLayoutSimplifiedView } from '../../utils/feature-flags';
import { BreadcrumbsSlotContext, BreadcrumbsSlotContextType } from '../contexts';

import testutilStyles from '../../test-classes/styles.css.js';
import toolbarStyles from '../toolbar/styles.css.js';
import styles from './styles.css.js';

interface ToolbarSlotProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ToolbarSlot = React.forwardRef<HTMLElement, ToolbarSlotProps>(({ className, style, children }, ref) => {
  const hidden = isAppLayoutHideToolbar();
  const insetBlockStart = style?.insetBlockStart ?? 0;
  return (
    <>
      <section
        ref={ref as React.Ref<any>}
        className={clsx(
          styles['toolbar-container'],
          toolbarStyles['universal-toolbar'],
          testutilStyles.toolbar,
          hidden && toolbarStyles['toolbar-hidden'],
          isAppLayoutSimplifiedView() && toolbarStyles['simplified-view'],
          className
        )}
        style={{ insetBlockStart, ...style }}
      >
        {children}
      </section>
      {/* the content area keeps a top border in the toolbar border color, where the hidden toolbar would be */}
      {hidden && <div className={styles['hidden-toolbar-border']} style={{ insetBlockStart }} />}
    </>
  );
});

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
  reportOwnBreadcrumbsProps?: BreadcrumbsSlotContextType['reportOwnBreadcrumbsProps'];
}

const breadcrumbsSlotContextValue = { isInToolbar: true };

export function BreadcrumbsSlot({
  ownBreadcrumbs,
  discoveredBreadcrumbs,
  reportOwnBreadcrumbsProps,
}: BreadcrumbsSlotProps) {
  const isSSR = typeof window === 'undefined';
  const ownBreadcrumbsSlotContextValue = React.useMemo(
    () => ({ isInToolbar: true, reportOwnBreadcrumbsProps }),
    [reportOwnBreadcrumbsProps]
  );

  return (
    <>
      <BreadcrumbsSlotContext.Provider value={ownBreadcrumbsSlotContextValue}>
        <div className={styles['breadcrumbs-own']}>{ownBreadcrumbs}</div>
      </BreadcrumbsSlotContext.Provider>
      {discoveredBreadcrumbs && !isSSR && (
        <BreadcrumbsSlotContext.Provider value={breadcrumbsSlotContextValue}>
          <div className={styles['breadcrumbs-discovered']}>
            <BreadcrumbGroupImplementation
              {...discoveredBreadcrumbs}
              data-awsui-discovered-breadcrumbs={true}
              __injectAnalyticsComponentMetadata={true}
            />
          </div>
        </BreadcrumbsSlotContext.Provider>
      )}
    </>
  );
}
