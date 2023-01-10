// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import customCssProps from '../../internal/generated/custom-css-properties';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function Main() {
  const {
    breadcrumbs,
    content,
    contentHeader,
    contentType,
    disableContentPaddings,
    dynamicOverlapHeight,
    hasNotificationsContent,
    isNavigationOpen,
    isSplitPanelOpen,
    isToolsOpen,
    isMobile,
    isAnyPanelOpen,
    mainElement,
    splitPanel,
    offsetBottom,
    footerHeight,
    splitPanelPosition,
  } = useAppLayoutInternals();

  const isUnfocusable = isMobile && isAnyPanelOpen;
  const splitPanelHeight = offsetBottom - footerHeight;

  return (
    <div
      className={clsx(
        styles.container,
        styles[`content-type-${contentType}`],
        styles[`split-panel-position-${splitPanelPosition ?? 'bottom'}`],
        {
          [styles['disable-content-paddings']]: disableContentPaddings,
          [styles['has-breadcrumbs']]: breadcrumbs,
          [styles['has-dynamic-overlap-height']]: dynamicOverlapHeight > 0,
          [styles['has-header']]: contentHeader,
          [styles['has-notifications-content']]: hasNotificationsContent,
          [styles['has-split-panel']]: splitPanel,
          [styles['is-navigation-open']]: isNavigationOpen,
          [styles['is-tools-open']]: isToolsOpen,
          [styles['is-split-panel-open']]: isSplitPanelOpen,
          [styles.unfocusable]: isUnfocusable,
        },
        testutilStyles.content
      )}
      ref={mainElement}
      style={{
        [customCssProps.splitPanelHeight]: `${splitPanelHeight}px`,
      }}
    >
      {content}
    </div>
  );
}
