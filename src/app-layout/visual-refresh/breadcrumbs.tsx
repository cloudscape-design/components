// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Breadcrumbs() {
  const { breadcrumbs, hasStickyBackground, isMobile, userSettingsThemeHighContrastHeader } = useAppLayoutInternals();

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
        userSettingsThemeHighContrastHeader === 'enabled' && 'awsui-context-content-header'
      )}
    >
      {breadcrumbs}
    </div>
  );
}
