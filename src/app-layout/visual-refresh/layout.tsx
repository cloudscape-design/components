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
    disableContentHeaderOverlap,
    drawersTriggerCount,
    dynamicOverlapHeight,
    footerHeight,
    hasNotificationsContent,
    hasOpenDrawer,
    headerHeight,
    isNavigationOpen,
    layoutElement,
    layoutWidth,
    mainOffsetLeft,
    maxContentWidth,
    minContentWidth,
    navigationHide,
    notificationsHeight,
    splitPanelPosition,
    stickyNotifications,
    splitPanelDisplayed,
  } = useAppLayoutInternals();

  // Content gaps on the left and right are used with the minmax function in the CSS grid column definition
  const hasContentGapLeft = isNavigationOpen || navigationHide;
  const hasContentGapRight = drawersTriggerCount <= 0 || hasOpenDrawer;
  const isOverlapDisabled = getOverlapDisabled(dynamicOverlapHeight, contentHeader, disableContentHeaderOverlap);

  return (
    <main
      className={clsx(
        styles.layout,
        styles[`content-type-${contentType}`],
        styles[`split-panel-position-${splitPanelPosition ?? 'bottom'}`],
        {
          [styles['disable-body-scroll']]: disableBodyScroll,
          [testutilStyles['disable-body-scroll-root']]: disableBodyScroll,
          [styles['has-content-gap-left']]: hasContentGapLeft,
          [styles['has-content-gap-right']]: hasContentGapRight,
          [styles['has-max-content-width']]: maxContentWidth && maxContentWidth > 0,
          [styles['has-split-panel']]: splitPanelDisplayed,
          [styles['has-sticky-notifications']]: stickyNotifications && hasNotificationsContent,
          [styles['is-overlap-disabled']]: isOverlapDisabled,
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
        ...(!isOverlapDisabled &&
          dynamicOverlapHeight > 0 && { [customCssProps.overlapHeight]: `${dynamicOverlapHeight}px` }),
      }}
    >
      {children}
    </main>
  );
}

/**
 * Determine whether the overlap between the contentHeader and content slots should be disabled.
 * The disableContentHeaderOverlap property is absolute and will always disable the overlap
 * if it is set to true. If there is no contentHeader then the overlap should be disabled
 * unless there is a dynamicOverlapHeight. The dynamicOverlapHeight property is set by a
 * component in the content slot that needs to manually control the overlap height. Components
 * such as the Table (full page variant), Wizard, ContentLayout use this property and will
 * retain the overlap even if there is nothing rendered in the contentHeader slot.
 */
function getOverlapDisabled(
  dynamicOverlapHeight: number,
  contentHeader?: React.ReactNode,
  disableContentHeaderOverlap?: boolean
) {
  let isOverlapDisabled = false;

  if (disableContentHeaderOverlap) {
    isOverlapDisabled = true;
  } else if (!contentHeader && dynamicOverlapHeight <= 0) {
    isOverlapDisabled = true;
  }

  return isOverlapDisabled;
}
