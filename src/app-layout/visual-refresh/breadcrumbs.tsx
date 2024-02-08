// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getContentHeaderClassName } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Breadcrumbs() {
  const { breadcrumbs, hasStickyBackground, isMobile, contentType, darkHeader } = useAppLayoutInternals();

  if (isMobile || !breadcrumbs) {
    return null;
  }

  const removeHighContrastHeader = darkHeader ? 'awsui-context-content-header' : getContentHeaderClassName();

  return (
    <div
      className={clsx(
        styles.breadcrumbs,
        testutilStyles.breadcrumbs,
        contentType === 'hero' && styles['content-type-hero'],
        {
          [styles['has-sticky-background']]: hasStickyBackground,
        },
        removeHighContrastHeader
      )}
    >
      {breadcrumbs}
    </div>
  );
}
