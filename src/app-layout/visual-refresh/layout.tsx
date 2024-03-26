// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import customCssProps from '../../internal/generated/custom-css-properties';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * The layoutElement ref will be used by the resize observers to calculate the offset from
 * the top and bottom of the viewport based on the header and footer elements. This is to
 * ensure the Layout component minimum height will fill 100% of the viewport less those
 * cumulative heights.
 */
export default function Layout({ children }: LayoutProps) {
  const {
    contentHeader,
    contentType,
    disableBodyScroll,
    disableContentPaddings,
    drawersTriggerCount,
    footerHeight,
    hasNotificationsContent,
    hasStickyBackground,
    hasOpenDrawer,
    headerHeight,
    isBackgroundOverlapDisabled,
    navigationOpen,
    layoutElement,
    layoutWidth,
    mainOffsetLeft,
    maxContentWidth,
    minContentWidth,
    navigationHide,
    notificationsHeight,
    __embeddedViewMode,
    offsetBottom,
    splitPanelPosition,
    stickyNotifications,
    splitPanelDisplayed,
    toolbarHeight,
    tools,
  } = useAppLayoutInternals();

  // Content gaps on the left and right are used with the minmax function in the CSS grid column definition
  const hasContentGapLeft = navigationOpen || navigationHide;
  const hasContentGapRight = drawersTriggerCount === 0 || hasOpenDrawer || tools;

  const splitPanelHeight = offsetBottom - footerHeight;
  return (
    <main
      className={clsx(
        styles.layout,
        styles[`content-type-${contentType}`],
        styles[`split-panel-position-${splitPanelPosition ?? 'bottom'}`],
        {
          [styles['disable-body-scroll']]: disableBodyScroll,
          [testutilStyles['disable-body-scroll-root']]: disableBodyScroll,
          [styles['disable-content-paddings']]: disableContentPaddings,
          [styles['has-content-gap-left']]: hasContentGapLeft,
          [styles['has-content-gap-right']]: hasContentGapRight,
          [styles['has-header']]: contentHeader,
          [styles['has-max-content-width']]: maxContentWidth && maxContentWidth > 0,
          [styles['has-notifications']]: hasNotificationsContent,
          [styles['has-split-panel']]: splitPanelDisplayed,
          [styles['has-sticky-background']]: hasStickyBackground,
          [styles['has-sticky-notifications']]: stickyNotifications && hasNotificationsContent,
          [styles['is-overlap-disabled']]: isBackgroundOverlapDisabled,
          [styles['is-hide-mobile-toolbar']]: __embeddedViewMode,
        },
        testutilStyles.root
      )}
      ref={layoutElement}
      style={{
        [customCssProps.headerHeight]: `${headerHeight}px`,
        [customCssProps.footerHeight]: `${footerHeight}px`,
        [customCssProps.layoutWidth]: `${layoutWidth}px`,
        [customCssProps.mainOffsetLeft]: `${mainOffsetLeft}px`,
        ...(maxContentWidth && { [customCssProps.maxContentWidth]: `${maxContentWidth}px` }),
        ...(minContentWidth && { [customCssProps.minContentWidth]: `${minContentWidth}px` }),
        [customCssProps.notificationsHeight]: `${notificationsHeight}px`,
        [customCssProps.toolbarHeight]: `${toolbarHeight}px`,
        [customCssProps.splitPanelHeight]: `${splitPanelHeight}px`,
      }}
    >
      {children}
    </main>
  );
}
