// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';

/**
 * The CSS class 'awsui-context-content-header' needs to be added to the root element so
 * that the design tokens used are overridden with the appropriate values.
 */
export default function Header() {
  const { contentHeader, isAnyPanelOpen, isMobile } = useAppLayoutInternals();

  if (!contentHeader) {
    return null;
  }

  return (
    <header className={clsx(
      styles.content, {
        [styles.unfocusable]: isMobile && isAnyPanelOpen,
      },
      'awsui-context-content-header'
    )}>
      {contentHeader}
    </header>
  );
}
