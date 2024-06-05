// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { highContrastHeaderClassName } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Notifications() {
  const {
    ariaLabels,
    hasDrawerViewportOverlay,
    notifications,
    notificationsElement,
    stickyNotifications,
    headerVariant,
    hasNotificationsContent,
  } = useAppLayoutInternals();

  if (!notifications) {
    return null;
  }

  /**
   * The notificationsElement ref is assigned to an inner div to prevent internal bottom margin
   * from affecting the calculated height, which is used for sticky elements below.
   */
  return (
    <div
      role="region"
      aria-label={ariaLabels?.notifications ?? undefined}
      className={clsx(
        styles.notifications,
        {
          [styles['sticky-notifications']]: stickyNotifications,
          [styles['has-notification-content']]: hasNotificationsContent,
          [styles.unfocusable]: hasDrawerViewportOverlay,
          [highContrastHeaderClassName]: headerVariant === 'high-contrast',
          [styles['high-contrast']]: headerVariant === 'high-contrast',
        },
        testutilStyles.notifications
      )}
    >
      <div ref={notificationsElement}>{notifications}</div>
    </div>
  );
}
