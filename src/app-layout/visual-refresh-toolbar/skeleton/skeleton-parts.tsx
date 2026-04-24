// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

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
        {!!toolbarProps && (
          <ToolbarSkeletonStructure
            ref={ref}
            ariaLabels={toolbarProps.ariaLabels}
            expandedDrawerId={toolbarProps.expandedDrawerId}
            hasNavigation={toolbarProps.hasNavigation}
            navigationOpen={toolbarProps.navigationOpen}
            ownBreadcrumbs={appLayoutProps.breadcrumbs}
          />
        )}
        {toolbarProps?.hasNavigation && (
          <div
            className={clsx(
              styles.navigation,
              !toolbarProps?.navigationOpen && styles['panel-hidden'],
              !!toolbarProps?.activeDrawerId && styles['unfocusable-mobile'],
              !!toolbarProps?.expandedDrawerId && styles.hidden
            )}
          >
            {appLayoutProps.navigation}
          </div>
        )}
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
      ariaLabels={appLayoutInternals.ariaLabels}
      expandedDrawerId={appLayoutInternals.expandedDrawerId}
      navigationOpen={appLayoutInternals.navigationOpen}
      ownBreadcrumbs={appLayoutInternals.breadcrumbs}
      discoveredBreadcrumbs={appLayoutInternals.discoveredBreadcrumbs}
    />
  )
);

export const NotificationsSkeleton = React.forwardRef<HTMLElement, AppLayoutNotificationsImplementationProps>(
  (props: AppLayoutNotificationsImplementationProps, ref) => <NotificationsSlot ref={ref} />
);
