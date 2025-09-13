// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutNotificationsImplementationProps } from '../notifications';
import { AppLayoutToolbarImplementationProps } from '../toolbar';
import { SkeletonPartProps } from './interfaces';
import { NotificationsSlot } from './slots';
import { ToolbarSkeletonStructure } from './toolbar-container';

import styles from './styles.css.js';

/**
 * New widgetized parts
 */

export const BeforeMainSlotSkeleton = React.forwardRef<HTMLElement, SkeletonPartProps>(
  ({ toolbarProps, appLayoutProps }, ref) => {
    return (
      <>
        {!!toolbarProps && <ToolbarSkeletonStructure ref={ref} ownBreadcrumbs={appLayoutProps.breadcrumbs} />}
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
    <ToolbarSkeletonStructure
      ref={ref}
      ownBreadcrumbs={appLayoutInternals.breadcrumbs}
      discoveredBreadcrumbs={appLayoutInternals.discoveredBreadcrumbs}
    />
  )
);

export const NotificationsSkeleton = React.forwardRef<HTMLElement, AppLayoutNotificationsImplementationProps>(
  (_props: AppLayoutNotificationsImplementationProps, ref) => <NotificationsSlot ref={ref} />
);
