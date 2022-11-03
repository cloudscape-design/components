// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import clsx from 'clsx';
import { AppLayoutContext } from './context';
import styles from './styles.css.js';

/**
 * The CSS class 'awsui-context-content-header' needs to be added to the root element so
 * that the design tokens used are overridden with the appropriate values.
 */
export default function Background() {
  const { contentType, hasNotificationsContent, stickyNotifications, hasStickyOverlap } = useContext(AppLayoutContext);

  return (
    <div className={clsx(styles.background, 'awsui-context-content-header')}>
      <div
        className={clsx(styles['notifications-appbar-header'], styles[`content-type-${contentType}`], {
          [styles['has-notifications-content']]: hasNotificationsContent,
          [styles['sticky-notifications']]: stickyNotifications,
        })}
      />

      <div
        className={clsx(styles.overlap, styles[`content-type-${contentType}`], {
          [styles['has-sticky-overlap']]: hasStickyOverlap,
        })}
      />
    </div>
  );
}
