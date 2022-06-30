// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { AppLayoutProps } from './interfaces';
import { DesktopDrawerProps, Drawer } from './drawer';
import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';
import useContentHeight from './utils/use-content-height';

interface NavigationPanelProps {
  navigationOpen: boolean;
  isHidden: DesktopDrawerProps['isHidden'];

  navigationDrawerWidth: number;
  navigationWidth: number;
  headerHeight: DesktopDrawerProps['topOffset'];
  footerHeight: DesktopDrawerProps['bottomOffset'];
  panelHeightStyle: ReturnType<typeof useContentHeight>['panelHeightStyle'];

  navigation: React.ReactNode;

  ariaLabels: AppLayoutProps['ariaLabels'];

  isMobile: boolean;
  isMotionEnabled: boolean;

  onNavigationToggle: DesktopDrawerProps['onToggle'];
  onClick: DesktopDrawerProps['onClick'];

  toggleRefs: DesktopDrawerProps['toggleRefs'];
}

export function NavigationPanel({
  ariaLabels,
  footerHeight,
  headerHeight,
  isHidden,
  isMobile,
  navigation,
  navigationDrawerWidth,
  navigationWidth,
  navigationOpen,
  onClick,
  onNavigationToggle,
  panelHeightStyle,
  toggleRefs,
}: NavigationPanelProps) {
  return (
    <div
      style={{
        width: navigationDrawerWidth,
      }}
    >
      <div
        className={clsx(styles['panel-wrapper-outer'], {
          [styles.mobile]: isMobile,
          [styles.open]: navigationOpen,
        })}
        style={{
          ...(isMobile ? { top: headerHeight, bottom: footerHeight } : panelHeightStyle),
        }}
      >
        <Drawer
          type="navigation"
          isMobile={isMobile}
          width={navigationWidth}
          isOpen={navigationOpen}
          isHidden={isHidden}
          onToggle={onNavigationToggle}
          toggleRefs={toggleRefs}
          onClick={onClick}
          contentClassName={clsx(styles.navigation, testutilStyles.navigation)}
          closeClassName={clsx(styles['navigation-close'], testutilStyles['navigation-close'])}
          toggleClassName={clsx(styles['navigation-toggle'], testutilStyles['navigation-toggle'])}
          topOffset={headerHeight}
          bottomOffset={footerHeight}
          ariaLabels={ariaLabels}
        >
          {navigation}
        </Drawer>
      </div>
    </div>
  );
}
