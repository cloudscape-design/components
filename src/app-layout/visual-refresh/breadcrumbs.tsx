// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getContentHeaderClassName } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Breadcrumbs() {
  const { breadcrumbs, hasStickyBackground, isMobile, headerType, highContrastHeader } = useAppLayoutInternals();

  console.log('The HeaderType in Breadcrumb is ' + headerType);
  const isDarkHeaderContext = highContrastHeader;

  if (isMobile || !breadcrumbs) {
    return null;
  }

  return (
    <div
      className={clsx(
        styles.breadcrumbs,
        testutilStyles.breadcrumbs,
        {
          [styles['has-sticky-background']]: hasStickyBackground,
        },
        getContentHeaderClassName(isDarkHeaderContext || headerType === 'homepage' || headerType === 'hero')
      )}
    >
      {breadcrumbs}
    </div>
  );
}
