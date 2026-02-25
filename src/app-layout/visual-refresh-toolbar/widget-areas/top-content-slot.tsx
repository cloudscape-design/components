// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { AppLayoutBuiltInErrorBoundary } from '../../../error-boundary/internal';
import { highContrastHeaderClassName } from '../../../internal/utils/content-header-utils';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutNotificationsImplementation as AppLayoutNotifications } from '../notifications';
import { SkeletonPartProps } from '../skeleton/interfaces';
import { isWidgetReady } from '../state/invariants';

import styles from '../skeleton/styles.css.js';

export const TopContentSlotImplementation = ({ appLayoutProps, appLayoutState }: SkeletonPartProps) => {
  if (!isWidgetReady(appLayoutState)) {
    return null;
  }
  return (
    <AppLayoutBuiltInErrorBoundary>
      {appLayoutProps.notifications && (
        <div
          className={clsx(
            styles['notifications-background'],
            appLayoutProps.headerVariant === 'high-contrast' && highContrastHeaderClassName
          )}
        ></div>
      )}
      {appLayoutProps.notifications && (
        <AppLayoutNotifications appLayoutInternals={appLayoutState.appLayoutInternals}>
          {appLayoutProps.notifications}
        </AppLayoutNotifications>
      )}
    </AppLayoutBuiltInErrorBoundary>
  );
};

export const createWidgetizedAppLayoutTopContentSlot = createWidgetizedComponent(TopContentSlotImplementation);
