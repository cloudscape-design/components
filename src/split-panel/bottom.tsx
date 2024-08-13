// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { isAppLayoutToolbarEnabled } from '../app-layout/utils/feature-flags';
import { useSplitPanelContext } from '../internal/context/split-panel-context';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SplitPanelContentProps } from './interfaces';

import sharedStyles from '../app-layout/resize/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

interface SplitPanelContentBottomProps extends SplitPanelContentProps {
  appLayoutMaxWidth: React.CSSProperties | undefined;
}

export function SplitPanelContentBottom({
  baseProps,
  isOpen,
  splitPanelRef,
  cappedSize,
  header,
  resizeHandle,
  children,
  appLayoutMaxWidth,
  panelHeaderId,
  onToggle,
}: SplitPanelContentBottomProps) {
  const isRefresh = useVisualRefresh();
  const { bottomOffset, leftOffset, rightOffset, disableContentPaddings, contentWrapperPaddings, reportHeaderHeight } =
    useSplitPanelContext();
  const isMobile = useMobile();

  const headerRef = useRef<HTMLDivElement>(null);
  useResizeObserver(headerRef, entry => reportHeaderHeight(entry.borderBoxHeight));
  useEffect(() => {
    // report empty height when unmounting the panel
    return () => reportHeaderHeight(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const centeredMaxWidthClasses = clsx({
    [styles['pane-bottom-center-align']]: isRefresh,
    [styles['pane-bottom-content-nav-padding']]: contentWrapperPaddings?.closedNav,
    [styles['pane-bottom-content-tools-padding']]: contentWrapperPaddings?.closedTools,
  });

  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.drawer,
        styles['position-bottom'],
        testUtilStyles.root,
        sharedStyles['with-motion'],
        {
          [testUtilStyles['open-position-bottom']]: isOpen,
          [styles['drawer-closed']]: !isOpen,
          [styles['drawer-mobile']]: isMobile,
          [styles['drawer-disable-content-paddings']]: disableContentPaddings,
          [styles.refresh]: isRefresh,
          [styles['with-toolbar']]: isAppLayoutToolbarEnabled(),
        }
      )}
      onClick={() => !isOpen && onToggle()}
      style={{
        insetBlockEnd: bottomOffset,
        insetInlineStart: leftOffset,
        insetInlineEnd: rightOffset,
        blockSize: isOpen ? cappedSize : isAppLayoutToolbarEnabled() ? '0px' : undefined,
      }}
      ref={splitPanelRef}
    >
      {isOpen && <div className={styles['slider-wrapper-bottom']}>{resizeHandle}</div>}
      <div className={styles['drawer-content-bottom']} aria-labelledby={panelHeaderId} role="region">
        <div className={clsx(styles['pane-header-wrapper-bottom'], centeredMaxWidthClasses)} ref={headerRef}>
          {header}
        </div>
        <div className={clsx(styles['content-bottom'], centeredMaxWidthClasses)} aria-hidden={!isOpen}>
          <div className={clsx({ [styles['content-bottom-max-width']]: isRefresh })} style={appLayoutMaxWidth}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
