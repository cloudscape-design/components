// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import { AppLayoutNotificationsImplementationProps } from '../notifications';
import { AppLayoutToolbarImplementationProps } from '../toolbar';
import { SkeletonPartProps } from './interfaces';
import { NotificationsSlot } from './slots';
import { ToolbarSkeletonStructure } from './toolbar-container';

import navStyles from '../navigation/styles.css.js';
import styles from './styles.css.js';

/**
 * New widgetized parts
 */

export const BeforeMainSlotSkeleton = React.forwardRef<HTMLElement, SkeletonPartProps>(
  ({ toolbarProps, appLayoutProps }, ref) => {
    const hasNavigation = toolbarProps ? toolbarProps.hasNavigation : !!appLayoutProps.navigation;
    return (
      <>
        {!!toolbarProps && (
          <ToolbarSkeletonStructure
            ref={ref}
            ariaLabels={toolbarProps.ariaLabels}
            hasNavigation={hasNavigation}
            navigationOpen={toolbarProps.navigationOpen}
            ownBreadcrumbs={appLayoutProps.breadcrumbs}
          />
        )}
        {hasNavigation && (
          <div
            className={clsx(
              styles.navigation,
              !toolbarProps?.navigationOpen && !toolbarProps?.navigationCollapsed && styles['panel-hidden'],
              !toolbarProps?.navigationOpen && toolbarProps?.navigationCollapsed && styles['navigation-collapsed'],
              !!toolbarProps?.activeDrawerId && styles['unfocusable-mobile']
            )}
          >
            <div
              className={clsx(
                navStyles['navigation-container'],
                toolbarProps?.navigationOpen && navStyles['is-navigation-open'],
                !toolbarProps?.navigationOpen &&
                  toolbarProps?.navigationCollapsed &&
                  navStyles['is-navigation-collapsed']
              )}
            >
              <nav className={navStyles.navigation}>
                <div className={navStyles['hide-navigation']}>
                  <InternalButton iconName="angle-left" variant="icon" formAction="none" />
                </div>
                {appLayoutProps.navigation}
              </nav>
            </div>
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
