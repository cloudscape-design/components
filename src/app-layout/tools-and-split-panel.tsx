// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { DesktopDrawerProps, Drawer } from './drawer';
import { AppLayoutProps } from './interfaces';
import { SplitPanelWrapper } from './split-panel-wrapper';
import useContentHeight from './utils/use-content-height';
import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';
import { SplitPanelContextProps } from '../internal/context/split-panel-context';

interface ToolsAndSplitPanelProps {
  toolsHide: boolean;
  toolsOpen: boolean;
  isHidden: DesktopDrawerProps['isHidden'];

  splitPanelOpen: boolean;

  drawerWidth: number;
  toolsWidth: number;
  splitPanelReportedSize: number;
  closedDrawerWidth: number;

  headerHeight: DesktopDrawerProps['topOffset'];
  footerHeight: DesktopDrawerProps['bottomOffset'];
  panelHeightStyle: ReturnType<typeof useContentHeight>['panelHeightStyle'];
  contentHeightStyle: ReturnType<typeof useContentHeight>['contentHeightStyle'];

  tools: React.ReactNode;
  splitPanel?: React.ReactNode;
  splitPanelContext: SplitPanelContextProps;

  ariaLabels: AppLayoutProps['ariaLabels'];

  disableContentPaddings: AppLayoutProps['disableContentPaddings'];
  isMobile: boolean;
  isMotionEnabled: boolean;

  onToolsToggle: DesktopDrawerProps['onToggle'];

  toggleRefs: DesktopDrawerProps['toggleRefs'];

  onLoseToolsFocus: (event: React.FocusEvent) => void;
}

export function ToolsAndSplitPanel({
  ariaLabels,
  drawerWidth,
  footerHeight,
  headerHeight,
  isHidden,
  isMobile,
  onToolsToggle,
  panelHeightStyle,
  splitPanel,
  splitPanelContext,
  toggleRefs,
  onLoseToolsFocus,
  tools,
  toolsHide,
  toolsOpen,
  toolsWidth,
  splitPanelOpen,
}: ToolsAndSplitPanelProps) {
  const splitPanelVisible = splitPanelOpen && Boolean(splitPanel);

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
          {splitPanel && <SplitPanelWrapper context={splitPanelContext}>{splitPanel}</SplitPanelWrapper>}
          {!toolsHide && (
            <Drawer
              type="tools"
              isMobile={isMobile}
              width={toolsWidth}
              isOpen={toolsOpen}
              onToggle={onToolsToggle}
              toggleRefs={toggleRefs}
              onLoseFocus={onLoseToolsFocus}
              isHidden={isHidden}
              externalizedToggle={Boolean(splitPanel)}
              contentClassName={clsx(styles.tools, testutilStyles.tools)}
              closeClassName={clsx(styles['tools-close'], testutilStyles['tools-close'])}
              toggleClassName={clsx(styles['tools-toggle'], testutilStyles['tools-toggle'])}
              topOffset={headerHeight}
              bottomOffset={footerHeight}
              ariaLabels={ariaLabels}
              extendRight={0}
              hasDividerWithSplitPanel={splitPanelVisible}
            >
              {tools}
            </Drawer>
          )}
        </div>
      </div>
    </>
  );
}
