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
    breadcrumbs,
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
    isMobile,
    isNavigationOpen,
    layoutElement,
    layoutWidth,
    mainOffsetLeft,
    maxContentWidth,
    minContentWidth,
    navigationHide,
    notificationsHeight,
    __embeddedViewMode,
    splitPanelPosition,
    stickyNotifications,
    splitPanelDisplayed,
  } = useAppLayoutInternals();

  // Determine the first content child so the gap will vertically align with the trigger buttons
  const contentFirstChild = getContentFirstChild(breadcrumbs, contentHeader, hasNotificationsContent, isMobile);

  // Content gaps on the left and right are used with the minmax function in the CSS grid column definition
  const hasContentGapLeft = isNavigationOpen || navigationHide;
  const hasContentGapRight = drawersTriggerCount === 0 || hasOpenDrawer;

  /**
   * POC mutation observer.
   */
  const [userSettingsLayoutWidth, setUserSettingsLayoutWidth] = React.useState('Optimized for content');

  function callback(mutationList: any) {
    for (const mutation of mutationList) {
      if (mutation.type === 'attributes') {
        //console.log(mutation.target.dataset.userSettingsLayoutWidth);
        setUserSettingsLayoutWidth(mutation.target.dataset.userSettingsLayoutWidth);
      }
    }
  }

  const observer = new MutationObserver(callback);
  observer.observe(document.body, { attributeFilter: ['data-user-settings-layout-width'] });

  console.log(userSettingsLayoutWidth);

  return (
    <main
      className={clsx(
        styles.layout,
        styles[`content-first-child-${contentFirstChild}`],
        styles[`content-type-${contentType}`],
        styles[`split-panel-position-${splitPanelPosition ?? 'bottom'}`],
        {
          [styles['disable-body-scroll']]: disableBodyScroll,
          [testutilStyles['disable-body-scroll-root']]: disableBodyScroll,
          [styles['disable-content-paddings']]: disableContentPaddings,
          [styles['has-breadcrumbs']]: breadcrumbs && !isMobile,
          [styles['has-content-gap-left']]: hasContentGapLeft,
          [styles['has-content-gap-right']]: hasContentGapRight,
          [styles['has-header']]: contentHeader,
          [styles['has-max-content-width']]: maxContentWidth && maxContentWidth > 0,
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
        // POC user settings override
        ...(userSettingsLayoutWidth === 'full-width' && { [customCssProps.defaultMaxContentWidth]: `100%` }),
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
