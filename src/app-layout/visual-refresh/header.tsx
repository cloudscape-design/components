// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getContentHeaderClassName } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';

export default function Header() {
  const { breadcrumbs, contentHeader, hasDrawerViewportOverlay, hasNotificationsContent, darkHeader } =
    useAppLayoutInternals();

  if (!contentHeader) {
    return null;
  }

  const removeHighContrastHeader = darkHeader ? 'awsui-context-content-header' : getContentHeaderClassName();

  return (
    <header
      className={clsx(
        styles.content,
        {
          [styles['has-breadcrumbs']]: breadcrumbs,
          [styles['has-notifications-content']]: hasNotificationsContent,
          [styles.unfocusable]: hasDrawerViewportOverlay,
        },
        //getContentHeaderClassName()
        removeHighContrastHeader
      )}
    >
      {contentHeader}
    </header>
  );
}
