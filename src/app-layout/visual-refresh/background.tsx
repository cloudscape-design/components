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
  const { hasNotificationsContent, hasStickyBackground, stickyNotifications } = useContext(AppLayoutContext);

  return (
    <div className={clsx(styles.background, 'awsui-context-content-header')}>
      <div
        className={clsx(styles['notifications-appbar-header'], {
          [styles['has-notifications-content']]: hasNotificationsContent,
          [styles['has-sticky-background']]: hasStickyBackground,
          [styles['sticky-notifications']]: stickyNotifications,
        })}
      />

      <div
        className={clsx(styles.overlap, {
          [styles['has-sticky-background']]: hasStickyBackground,
        })}
      />
    </div>
  );
}
