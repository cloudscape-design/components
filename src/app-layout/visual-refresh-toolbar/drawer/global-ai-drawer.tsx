// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { usePrevious } from '../../../internal/hooks/use-previous';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { AppLayoutProps } from '../../interfaces';
import { OnChangeParams } from '../../utils/use-ai-drawer';
import { FocusControlState } from '../../utils/use-focus-control';
import { AppLayoutInternals, InternalDrawer } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AIDrawerProps {
  activeAiDrawerSize: number;
  minAiDrawerSize: number;
  aiDrawer: AppLayoutProps.Drawer | undefined;
  maxAiDrawerSize: number;
  ariaLabels: any;
  aiDrawerFocusControl: FocusControlState | undefined;
  isMobile: boolean;
  drawersOpenQueue: ReadonlyArray<string> | undefined;
  onActiveAiDrawerChange: undefined | ((newDrawerId: string | null, params?: OnChangeParams) => void);
  onActiveDrawerResize: (detail: { id: string; size: number }) => void;
  expandedDrawerId?: string | null;
  setExpandedDrawerId: (value: string | null) => void;
}

interface AppLayoutGlobalAiDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  show: boolean;
  activeAiDrawer: InternalDrawer | null;
  aiDrawerProps: AIDrawerProps;
}

export function AppLayoutGlobalAiDrawerImplementation({
  appLayoutInternals,
  show,
  activeAiDrawer,
  aiDrawerProps,
}: AppLayoutGlobalAiDrawerImplementationProps) {
  const {
    activeAiDrawerSize,
    minAiDrawerSize,
    maxAiDrawerSize,
    ariaLabels,
    aiDrawerFocusControl,
    isMobile,
    drawersOpenQueue,
    onActiveAiDrawerChange,
    onActiveDrawerResize,
    expandedDrawerId,
    setExpandedDrawerId,
  } = aiDrawerProps;
  const [state, setState] = useState<'entered' | ''>('');

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => {
        setState('entered');
      });
    }
    return () => {
      setState('');
    };
  }, [show]);
  const { verticalOffsets, placement } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeAiDrawer?.id;

  const computedAriaLabels = {
    closeButton: activeAiDrawer ? activeAiDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeAiDrawer ? activeAiDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const resizeProps = useResize({
    currentWidth: activeAiDrawerSize,
    minWidth: minAiDrawerSize,
    maxWidth: maxAiDrawerSize,
    panelRef: drawerRef,
    handleRef: aiDrawerFocusControl!.refs.slider,
    onResize: size => {
      onActiveDrawerResize({ id: activeDrawerId!, size });
    },
    position: 'side-start',
  });
  const size = getLimitedValue(minAiDrawerSize, activeAiDrawerSize, maxAiDrawerSize);
  const isExpanded = activeAiDrawer?.isExpandable && expandedDrawerId === activeDrawerId;
  const wasExpanded = usePrevious(isExpanded);
  const animationDisabled =
    (activeAiDrawer?.defaultActive && !drawersOpenQueue?.includes(activeAiDrawer.id)) || (wasExpanded && !isExpanded);
  const drawerHeight = `calc(100vh - ${verticalOffsets.toolbar + placement.insetBlockEnd}px)`;
  // disable resizing when the drawer is at its minimum width in a "squeezed" state
  // (window is between mobile and desktop sizes). At this point, the drawer can't be
  // resized in either direction, so we disable the resize handler
  const isResizingDisabled = maxAiDrawerSize < activeAiDrawerSize;

  return (
    <aside
      id={activeAiDrawer?.id}
      aria-hidden={!activeAiDrawer}
      aria-label={computedAriaLabels.content}
      className={clsx(
        styles.drawer,
        styles['ai-drawer'],
        !animationDisabled && isExpanded && styles['with-expanded-motion'],
        !show && styles['drawer-hidden'],
        {
          [sharedStyles['with-motion-horizontal']]: !animationDisabled,
          [testutilStyles['active-drawer']]: show,
          [styles['drawer-hidden']]: !show,
          [testutilStyles['drawer-closed']]: !activeAiDrawer,
          [styles['drawer-expanded']]: isExpanded,
        }
      )}
      ref={drawerRef}
      onBlur={e => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
          aiDrawerFocusControl?.loseFocus();
        }
      }}
      style={{
        blockSize: drawerHeight,
        insetBlockStart: `${placement.insetBlockStart}px`,
        ...(!isMobile && {
          [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? size : 0}px`,
        }),
      }}
      data-testid={activeDrawerId && `awsui-app-layout-drawer-${activeDrawerId}`}
    >
      {!isMobile && activeAiDrawer?.resizable && !isExpanded && (
        <div className={styles['drawer-slider']}>
          <PanelResizeHandle
            ref={aiDrawerFocusControl?.refs.slider}
            position="side-start"
            className={clsx(testutilStyles['drawers-slider'], styles['ai-drawer-slider-handle'])}
            ariaLabel={activeAiDrawer?.ariaLabels?.resizeHandle}
            tooltipText={activeAiDrawer?.ariaLabels?.resizeHandleTooltipText}
            ariaValuenow={resizeProps.relativeSize}
            onKeyDown={resizeProps.onKeyDown}
            onPointerDown={resizeProps.onPointerDown}
            onDirectionClick={resizeProps.onDirectionClick}
            disabled={isResizingDisabled}
          />
        </div>
      )}
      <div className={clsx(styles['drawer-content-container'], sharedStyles['with-motion-horizontal'])}>
        <div className={styles['drawer-content']}>
          <header className={styles['drawer-content-header']}>
            <div className={styles['drawer-content-header-content']}>
              {activeAiDrawer?.header ?? <div />}
              <div className={styles['drawer-actions']}>
                {!isMobile && activeAiDrawer?.isExpandable && (
                  <div className={styles['drawer-expanded-mode-button']}>
                    <InternalButton
                      ariaLabel={activeAiDrawer?.ariaLabels?.expandedModeButton}
                      className={testutilStyles['active-drawer-expanded-mode-button']}
                      formAction="none"
                      ariaExpanded={isExpanded}
                      iconName={isExpanded ? 'shrink' : 'expand'}
                      onClick={() => setExpandedDrawerId(isExpanded ? null : activeDrawerId!)}
                      variant="icon"
                      analyticsAction={isExpanded ? 'expand' : 'collapse'}
                    />
                  </div>
                )}
                <div className={clsx(styles['drawer-close-button'])}>
                  <InternalButton
                    ariaLabel={computedAriaLabels.closeButton}
                    className={clsx({
                      [testutilStyles['active-drawer-close-button']]: activeDrawerId,
                    })}
                    formAction="none"
                    iconName={isMobile ? 'close' : 'angle-left'}
                    onClick={() => onActiveAiDrawerChange?.(null, { initiatedByUserAction: true })}
                    ref={aiDrawerFocusControl?.refs.close}
                    variant="icon"
                    analyticsAction="close"
                  />
                </div>
              </div>
            </div>
            {!isMobile && isExpanded && activeAiDrawer?.ariaLabels?.exitExpandedModeButton && (
              <div className={styles['drawer-back-to-console-slot']}>
                <div className={styles['drawer-back-to-console-button-wrapper']}>
                  <button
                    className={clsx(
                      testutilStyles['active-ai-drawer-leave-expanded-mode-custom-button'],
                      styles['drawer-back-to-console-button']
                    )}
                    formAction="none"
                    onClick={() => setExpandedDrawerId(null)}
                  >
                    {activeAiDrawer?.ariaLabels?.exitExpandedModeButton}
                  </button>
                </div>
              </div>
            )}
          </header>
          {activeAiDrawer?.content}
        </div>
      </div>
    </aside>
  );
}
