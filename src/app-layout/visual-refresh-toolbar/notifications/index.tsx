// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { NotificationsSlot } from '../skeleton/slot-wrappers';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutInternals } from '../interfaces';
import styles from './styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';

interface AppLayoutNotificationsImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  children: React.ReactNode;
}

export function AppLayoutNotificationsImplementation({
  appLayoutInternals,
  children,
}: AppLayoutNotificationsImplementationProps) {
  const { ariaLabels, stickyNotifications, notificationsRef, verticalOffsets } = appLayoutInternals;
  return (
    <NotificationsSlot
      ref={notificationsRef}
      className={clsx(stickyNotifications && styles['sticky-notifications'])}
      style={{
        insetBlockStart: stickyNotifications ? verticalOffsets.notifications : undefined,
      }}
    >
      <div className={testutilStyles.notifications} role="region" aria-label={ariaLabels?.notifications}>
        {children}
      </div>
    </NotificationsSlot>
  );
}

export const createWidgetizedAppLayoutNotifications = createWidgetizedComponent(AppLayoutNotificationsImplementation);
