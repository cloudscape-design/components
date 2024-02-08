// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getContentHeaderClassName, shouldRemoveHighContrastHeader } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Breadcrumbs() {
  const { breadcrumbs, hasStickyBackground, isMobile, contentType, darkHeader } = useAppLayoutInternals();

  if (isMobile || !breadcrumbs) {
    return null;
  }

  console.log('The header part recieves darkHeader' + darkHeader);
  // Call shouldRemoveHighContrastHeader() conditionally based on darkHeader value
  const removeHighContrastHeader = darkHeader ? false : shouldRemoveHighContrastHeader();

  // Get content header class name
  const contentHeaderClassName = removeHighContrastHeader ? '' : getContentHeaderClassName();

  return (
    <div
      className={clsx(
        styles.breadcrumbs,
        testutilStyles.breadcrumbs,
        contentType === 'hero' && styles['content-type-hero'],
        {
          [styles['has-sticky-background']]: hasStickyBackground,
        },
        //getContentHeaderClassName()
        contentHeaderClassName
      )}
    >
      {breadcrumbs}
    </div>
  );
}
