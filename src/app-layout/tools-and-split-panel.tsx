// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { DesktopDrawerProps, Drawer } from './drawer';
import { AppLayoutProps } from './interfaces';
import useContentHeight from './utils/use-content-height';
import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

interface ToolsAndSplitPanelProps {
  toolsHide: boolean;
  toolsOpen: boolean;
  drawerWidth: number;
  toolsWidth: number;
  headerHeight: DesktopDrawerProps['topOffset'];
  footerHeight: DesktopDrawerProps['bottomOffset'];
  panelHeightStyle: ReturnType<typeof useContentHeight>['panelHeightStyle'];
  tools: React.ReactNode;
  splitPanel: React.ReactNode;
  ariaLabels: AppLayoutProps['ariaLabels'];
  isMobile: boolean;
  onToolsToggle: DesktopDrawerProps['onToggle'];
  toggleRefs: DesktopDrawerProps['toggleRefs'];
  onLoseToolsFocus: (event: React.FocusEvent) => void;
}

export function ToolsAndSplitPanel({
  ariaLabels,
  drawerWidth,
  footerHeight,
  headerHeight,
  isMobile,
  onToolsToggle,
  panelHeightStyle,
  splitPanel,
  toggleRefs,
  onLoseToolsFocus,
  tools,
  toolsHide,
  toolsOpen,
  toolsWidth,
}: ToolsAndSplitPanelProps) {
  return (
    <>
      <div
        style={{
          width: drawerWidth,
        }}
      >
        <div
          className={clsx(styles['panel-wrapper-outer'], {
            [styles.mobile]: isMobile,
            [styles.open]: toolsOpen,
          })}
          style={{
            ...(isMobile ? { top: headerHeight, bottom: footerHeight } : panelHeightStyle),
          }}
        >
          {splitPanel}
          {!toolsHide && (
            <Drawer
              type="tools"
              isMobile={isMobile}
              width={toolsWidth}
              isOpen={toolsOpen}
              onToggle={onToolsToggle}
              toggleRefs={toggleRefs}
              onLoseFocus={onLoseToolsFocus}
              contentClassName={testutilStyles.tools}
              closeClassName={testutilStyles['tools-close']}
              toggleClassName={testutilStyles['tools-toggle']}
              topOffset={headerHeight}
              bottomOffset={footerHeight}
              ariaLabels={ariaLabels}
            >
              {tools}
            </Drawer>
          )}
        </div>
      </div>
    </>
  );
}
