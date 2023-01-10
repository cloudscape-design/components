// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

/**
 * The CSS class 'awsui-context-content-header' needs to be added to the root element so
 * that the design tokens used are overridden with the appropriate values.
 */
export default function Notifications() {
  const { ariaLabels, hasNotificationsContent, notifications, notificationsElement, stickyNotifications } =
    useAppLayoutInternals();

  if (!notifications) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label={ariaLabels?.notifications ?? undefined}
      className={clsx(
        styles.notifications,
        {
          [styles['has-notifications-content']]: hasNotificationsContent,
          [styles['sticky-notifications']]: stickyNotifications,
        },
        testutilStyles.notifications,
        'awsui-context-content-header'
      )}
      ref={notificationsElement}
    >
      {notifications}
    </div>
  );
}
