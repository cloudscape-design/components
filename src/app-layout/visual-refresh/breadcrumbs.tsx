// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getContentHeaderClassName } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Breadcrumbs() {
  const { breadcrumbs, hasStickyBackground, isMobile, darkHeader } = useAppLayoutInternals();

  const removeHighContrastHeader = darkHeader ? 'awsui-context-content-header' : getContentHeaderClassName();

  if (isMobile || !breadcrumbs) {
    return null;
  }

  return (
    <div
      className={clsx(
        styles.breadcrumbs,
        testutilStyles.breadcrumbs,
        darkHeader && styles['dark-header'],
        {
          [styles['has-sticky-background']]: hasStickyBackground,
        },
        //getContentHeaderClassName()
        removeHighContrastHeader
      )}
    >
      {breadcrumbs}
    </div>
  );
}
