// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { TransitionStatus } from '../internal/components/transition';
import { SplitPanelContentProps } from './interfaces';
import styles from './styles.css.js';
import { useSplitPanelContext } from '../internal/context/split-panel-context';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

interface SplitPanelContentBottomProps extends SplitPanelContentProps {
  state: TransitionStatus;
  transitioningElementRef: React.Ref<any>;
  appLayoutMaxWidth: React.CSSProperties | undefined;
}

export function SplitPanelContentBottom({
  baseProps,
  isOpen,
  state,
  transitioningElementRef,
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
  const {
    bottomOffset,
    leftOffset,
    rightOffset,
    disableContentPaddings,
    contentWrapperPaddings,
    isMobile,
    splitPanelHeaderRef,
  } = useSplitPanelContext();
  const transitionContentBottomRef = useMergeRefs(splitPanelRef || null, transitioningElementRef);

  const centeredMaxWidthClasses = clsx({
    [styles['pane-bottom-center-align']]: isRefresh,
    [styles['pane-bottom-content-nav-padding']]: contentWrapperPaddings?.closedNav,
    [styles['pane-bottom-content-tools-padding']]: contentWrapperPaddings?.closedTools,
  });

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles.drawer, styles['position-bottom'], {
        [styles['drawer-closed']]: !isOpen,
        [styles['drawer-mobile']]: isMobile,
        [styles['drawer-disable-content-paddings']]: disableContentPaddings,
        [styles.animating]: isRefresh && (state === 'entering' || state === 'exiting'),
        [styles.refresh]: isRefresh,
      })}
      onClick={() => !isOpen && onToggle()}
      style={{
        bottom: bottomOffset,
        left: leftOffset,
        right: rightOffset,
        height: isOpen ? cappedSize : undefined,
      }}
      ref={transitionContentBottomRef}
    >
      {isOpen && <div className={styles['slider-wrapper-bottom']}>{resizeHandle}</div>}
      <div className={styles['drawer-content-bottom']} aria-labelledby={panelHeaderId} role="region">
        <div className={clsx(styles['pane-header-wrapper-bottom'], centeredMaxWidthClasses)} ref={splitPanelHeaderRef}>
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
