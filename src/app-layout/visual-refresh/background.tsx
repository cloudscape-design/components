// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';

export default function Background() {
  const { breadcrumbs, hasHeaderOverlap, hasNotificationsContent, hasStickyBackground, isMobile, stickyNotifications } =
    useAppLayoutInternals();

  if (!hasNotificationsContent && (!breadcrumbs || isMobile) && !hasHeaderOverlap) {
    return null;
  }

  return (
    <div className={clsx(styles.background, 'awsui-context-content-header')}>
      <div className={styles['scrolling-background']} />

      {!isMobile && hasStickyBackground && (
        <div
          className={clsx(styles['sticky-background'], {
            [styles['has-sticky-notifications']]: stickyNotifications,
          })}
        />
      )}
    </div>
  );
}
