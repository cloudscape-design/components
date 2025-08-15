// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutNotificationsImplementationProps } from '../notifications';
import { AppLayoutToolbarImplementationProps } from '../toolbar';
import { SkeletonPartProps } from './interfaces';
import { BreadcrumbsSlot, NotificationsSlot, ToolbarSlot } from './slots';

import styles from './styles.css.js';

/**
 * New widgetized parts
 */

export const BeforeMainSlotSkeleton = React.forwardRef<HTMLElement, SkeletonPartProps>(
  ({ toolbarProps, appLayoutProps }, ref) => {
    return (
      <>
        {!!toolbarProps && (
          <ToolbarSlot ref={ref}>
            <BreadcrumbsSlot ownBreadcrumbs={appLayoutProps.breadcrumbs} />
          </ToolbarSlot>
        )}
        {toolbarProps?.navigationOpen && <div className={styles.navigation} />}
      </>
    );
  }
);

/**
 * Legacy parts
 */

export const ToolbarSkeleton = React.forwardRef<HTMLElement, AppLayoutToolbarImplementationProps>(
  ({ appLayoutInternals }: AppLayoutToolbarImplementationProps, ref) => (
    <ToolbarSlot ref={ref}>
      <BreadcrumbsSlot
        ownBreadcrumbs={appLayoutInternals.breadcrumbs}
        discoveredBreadcrumbs={appLayoutInternals.discoveredBreadcrumbs}
      />
    </ToolbarSlot>
  )
);

export const NotificationsSkeleton = React.forwardRef<HTMLElement, AppLayoutNotificationsImplementationProps>(
  (props: AppLayoutNotificationsImplementationProps, ref) => <NotificationsSlot ref={ref} />
);
