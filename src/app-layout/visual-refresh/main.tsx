// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import clsx from 'clsx';
import { AppLayoutContext } from './context';
import { SplitPanelContext } from '../../internal/context/split-panel-context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Main() {
  const {
    breadcrumbs,
    content,
    contentHeader,
    contentType,
    disableContentPaddings,
    hasNotificationsContent,
    isNavigationOpen,
    isSplitPanelOpen,
    isToolsOpen,
    isMobile,
    isAnyPanelOpen,
    mainElement,
  } = useContext(AppLayoutContext);

  const { position: splitPanelPosition } = useContext(SplitPanelContext);
  const isUnfocusable = isMobile && isAnyPanelOpen;

  return (
    <div
      className={clsx(
        styles.container,
        styles[`content-type-${contentType}`],
        styles[`split-panel-position-${splitPanelPosition ?? 'bottom'}`],
        {
          [styles['disable-content-paddings']]: disableContentPaddings,
          [styles['has-breadcrumbs']]: breadcrumbs,
          [styles['has-header']]: contentHeader,
          [styles['has-notifications-content']]: hasNotificationsContent,
          [styles['is-navigation-open']]: isNavigationOpen,
          [styles['is-tools-open']]: isToolsOpen,
          [styles['is-split-panel-open']]: isSplitPanelOpen,
          [styles.unfocusable]: isUnfocusable,
        },
        testutilStyles.content
      )}
      ref={mainElement}
    >
      {content}
    </div>
  );
}
