// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getContentHeaderClassName } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';

export default function Background() {
  const {
    breadcrumbs,
    hasBackgroundOverlap,
    hasNotificationsContent,
    hasStickyBackground,
    isMobile,
    stickyNotifications,
    headerType,
    highContrastHeader,
  } = useAppLayoutInternals();

  const isDarkHeaderContext = highContrastHeader;

  //console.log('The dark header context is ' + isDarkHeaderContext);
  console.log('The HeaderType is ' + headerType);

  if (!hasNotificationsContent && (!breadcrumbs || isMobile) && !hasBackgroundOverlap) {
    return null;
  }

  //console.log('Header background is ' + headerBackground);

  return (
    <div className={clsx(styles.background, getContentHeaderClassName(isDarkHeaderContext))}>
      <div
        className={clsx(
          styles['scrolling-background'],
          (headerType === 'homepage' || headerType === 'hero') && styles['hero-header'],
          headerType === 'documentation' && styles['documentation-header']
        )}
        //style={{ background: headerBackground }}
      />

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
