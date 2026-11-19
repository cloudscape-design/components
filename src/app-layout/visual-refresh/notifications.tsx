// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { highContrastHeaderClassName } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';

import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

export default function Notifications() {
  const { notifications } = useAppLayoutInternals();
  if (!notifications) {
    return null;
  }
  return <NotificationsImplementation />;
}

function NotificationsImplementation() {
  const {
    ariaLabels,
    hasDrawerViewportOverlay,
    notifications,
    setNotificationsHeight,
    stickyNotifications,
    headerVariant,
    hasNotificationsContent,
  } = useAppLayoutInternals();
  const ref = useRef<HTMLDivElement>(null);

  useResizeObserver(ref, entry => setNotificationsHeight(entry.contentBoxHeight));
  useEffect(() => {
    return () => {
      setNotificationsHeight(0);
    };
    // unmount effect only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div ref={ref}>{notifications}</div>
    </div>
  );
}
