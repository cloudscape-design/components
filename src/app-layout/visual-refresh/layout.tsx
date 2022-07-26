// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import clsx from 'clsx';
import { AppLayoutContext } from './context';
import { useIsomorphicLayoutEffect } from '../../internal/hooks/use-isomorphic-layout-effect';
import { SplitPanelContext } from '../../internal/context/split-panel-context';
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
    contentHeader,
    contentType,
    disableBodyScroll,
    disableContentHeaderOverlap,
    dynamicOverlapHeight,
    footerHeight,
    hasNotificationsContent,
    headerHeight,
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
    setOffsetBottom,
    splitPanel,
    stickyNotifications,
    toolsHide,
  } = useContext(AppLayoutContext);

  const {
    getHeader: getSplitPanelHeader,
    position: splitPanelPosition,
    size: splitPanelSize,
  } = useContext(SplitPanelContext);

  const isOverlapDisabled = getOverlapDisabled(dynamicOverlapHeight, contentHeader, disableContentHeaderOverlap);

  // Content gaps on the left and right are used with the minmax function in the CSS grid column definition
  const hasContentGapLeft = getContentGapLeft(isNavigationOpen, navigationHide);
  const hasContentGapRight = getContentGapRight(
    splitPanelPosition,
    isSplitPanelOpen,
    isToolsOpen,
    splitPanel,
    toolsHide
  );

  /**
   * Determine the offsetBottom value based on the presence of a footer element and
   * the SplitPanel component. Ignore the SplitPanel if it is not in the bottom
   * position. Use the size property if it is open and the header height if it is closed.
   */
  useIsomorphicLayoutEffect(
    function handleOffsetBottom() {
      let offsetBottom = footerHeight;

      if (splitPanel && splitPanelPosition === 'bottom') {
        if (isSplitPanelOpen) {
          offsetBottom += splitPanelSize;
        } else {
          const splitPanelHeader = getSplitPanelHeader();
          offsetBottom += splitPanelHeader ? splitPanelHeader.clientHeight : 0;
        }
      }

      setOffsetBottom(offsetBottom);
    },
    [
      footerHeight,
      getSplitPanelHeader,
      isSplitPanelOpen,
      setOffsetBottom,
      splitPanelPosition,
      splitPanel,
      splitPanelSize,
    ]
  );

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
          [styles['has-split-panel']]: splitPanel,
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
 * When the Navigation and Tools are present the grid definition has the center column
 * touch the first and last columns with no gap. The forms with the circular buttons
 * for Navigation and Tools have internal padding which creates the necessary
 * horizontal space when the drawers are closed. The remaining conditions below
 * determine the necessity of utilizing the content gap left property to create
 * horizontal space between the center column and its adjacent siblings.
 */
function getContentGapRight(
  splitPanelPosition: AppLayoutProps.SplitPanelPosition,
  isSplitPanelOpen?: boolean,
  isToolsOpen?: boolean,
  splitPanel?: React.ReactNode,
  toolsHide?: boolean
) {
  let hasContentGapRight = false;

  // Main is touching the edge of the Layout and needs a content gap
  if (!splitPanel && toolsHide) {
    hasContentGapRight = true;
  }

  // Main is touching the Tools drawer and needs a content gap
  if ((!splitPanel || !isSplitPanelOpen) && !toolsHide && isToolsOpen) {
    hasContentGapRight = true;
  }

  // Main is touching the edge of the Layout and needs a content gap
  if (splitPanel && splitPanelPosition === 'bottom' && (isToolsOpen || toolsHide)) {
    hasContentGapRight = true;
  }

  // Main is touching the Split Panel drawer and needs a content gap
  if (splitPanel && isSplitPanelOpen && splitPanelPosition === 'side') {
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
