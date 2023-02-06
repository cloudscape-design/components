// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { AppLayoutProps } from '../interfaces';
import customCssProps from '../../internal/generated/custom-css-properties';

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
    breadcrumbs,
    contentHeader,
    disableBodyScroll,
    disableContentHeaderOverlap,
    dynamicOverlapHeight,
    footerHeight,
    hasNotificationsContent,
    hasStickyBackground,
    headerHeight,
    isMobile,
    isNavigationOpen,
    isSplitPanelOpen,
    isToolsOpen,
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
    toolsHide,
  } = useAppLayoutInternals();

  const isOverlapDisabled = getOverlapDisabled(dynamicOverlapHeight, contentHeader, disableContentHeaderOverlap);

  // Content gaps on the left and right are used with the minmax function in the CSS grid column definition
  const hasContentGapLeft = getContentGapLeft(isNavigationOpen, navigationHide);
  const hasContentGapRight = getContentGapRight(
    splitPanelPosition,
    isSplitPanelOpen,
    isToolsOpen,
    splitPanelDisplayed,
    toolsHide
  );

  // Determine the first content child so the gap will vertically align with the trigger buttons
  const contentFirstChild = getContentFirstChild(breadcrumbs, contentHeader, hasNotificationsContent, isMobile);

  return (
    <main
      className={clsx(
        styles.layout,
        styles[`content-first-child-${contentFirstChild}`],
        styles[`split-panel-position-${splitPanelPosition ?? 'bottom'}`],
        {
          [styles['disable-body-scroll']]: disableBodyScroll,
          [testutilStyles['disable-body-scroll-root']]: disableBodyScroll,
          [styles['has-breadcrumbs']]: breadcrumbs && !isMobile,
          [styles['has-content-gap-left']]: hasContentGapLeft,
          [styles['has-content-gap-right']]: hasContentGapRight,
          [styles['has-header']]: contentHeader,
          [styles['has-max-content-width']]: maxContentWidth && maxContentWidth > 0,
          [styles['has-notifications-content']]: hasNotificationsContent,
          [styles['has-split-panel']]: splitPanelDisplayed,
          [styles['has-sticky-background']]: hasStickyBackground,
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

/*
The Notifications, Breadcrumbs, Header, and Main are all rendered in the center
column of the grid layout. Any of these could be the first child to render in the 
content area if the previous siblings do not exist. The grid gap before the first 
child will be different to ensure vertical alignment with the trigger buttons.
*/
function getContentFirstChild(
  breadcrumbs: React.ReactNode,
  contentHeader: React.ReactNode,
  hasNotificationsContent: boolean,
  isMobile: boolean
) {
  let contentFirstChild = 'main';

  if (hasNotificationsContent) {
    contentFirstChild = 'notifications';
  } else if (breadcrumbs && !isMobile) {
    contentFirstChild = 'breadcrumbs';
  } else if (contentHeader) {
    contentFirstChild = 'header';
  }

  return contentFirstChild;
}

/**
 * When the Navigation and Tools are present the grid definition has the center column
 * touch the first and last columns with no gap. The forms with the circular buttons
 * for Navigation and Tools have internal padding which creates the necessary
 * horizontal space when the drawers are closed. The remaining conditions below
 * determine the necessity of utilizing the content gap left property to create
 * horizontal space between the center column and its adjacent siblings.
 */
function getContentGapRight(
  splitPanelPosition: AppLayoutProps.SplitPanelPosition,
  isSplitPanelOpen: boolean | undefined,
  isToolsOpen: boolean,
  splitPanelDisplayed: boolean,
  toolsHide?: boolean
) {
  let hasContentGapRight = false;

  // Main is touching the edge of the Layout and needs a content gap
  if (!splitPanelDisplayed && toolsHide) {
    hasContentGapRight = true;
  }

  // Main is touching the Tools drawer and needs a content gap
  if ((!splitPanelDisplayed || !isSplitPanelOpen) && !toolsHide && isToolsOpen) {
    hasContentGapRight = true;
  }

  // Main is touching the edge of the Layout and needs a content gap
  if (splitPanelDisplayed && splitPanelPosition === 'bottom' && (isToolsOpen || toolsHide)) {
    hasContentGapRight = true;
  }

  // Main is touching the Split Panel drawer and needs a content gap
  if (splitPanelDisplayed && isSplitPanelOpen && splitPanelPosition === 'side') {
    hasContentGapRight = true;
  }

  return hasContentGapRight;
}

/**
 * Additional function to determine whether or not a content gap is needed
 * on the left (see the getContentGapRight function). The same render logic applies
 * regarding the center column touching an adjacent sibling but the only
 * component state that needs to be tracked is the Navigation.
 */
function getContentGapLeft(isNavigationOpen: boolean, navigationHide?: boolean) {
  return isNavigationOpen || navigationHide ? true : false;
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
