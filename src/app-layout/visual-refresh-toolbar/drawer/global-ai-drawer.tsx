// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalItemOrGroup } from '../../../button-group/interfaces';
import ButtonGroup from '../../../button-group/internal';
import { AppLayoutBuiltInErrorBoundary } from '../../../error-boundary/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { usePrevious } from '../../../internal/hooks/use-previous';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { AppLayoutProps } from '../../interfaces';
import { FocusControlState } from '../../utils/use-focus-control';
import { AppLayoutInternals, InternalDrawer } from '../interfaces';
import { OnChangeParams } from '../state/use-ai-drawer';
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
  activeAiDrawer:
    | (InternalDrawer & {
        exitExpandedModeTrigger?: {
          customIcon?: React.ReactNode;
        };
      })
    | null;
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
  let drawerActions: ReadonlyArray<InternalItemOrGroup> = [
    {
      type: 'icon-button',
      id: 'close',
      iconName: isMobile ? 'close' : 'angle-left',
      text: computedAriaLabels.closeButton,
      analyticsAction: 'close',
    },
  ];
  if (!isMobile && activeAiDrawer?.isExpandable) {
    drawerActions = [
      {
        type: 'icon-button',
        id: 'expand',
        iconName: isExpanded ? 'shrink' : 'expand',
        text: activeAiDrawer?.ariaLabels?.expandedModeButton ?? '',
        analyticsAction: isExpanded ? 'expand' : 'collapse',
      },
      ...drawerActions,
    ];
  }
  if (activeAiDrawer?.headerActions) {
    drawerActions = [
      {
        type: 'group',
        text: 'Actions',
        items: activeAiDrawer.headerActions!,
      },
      ...drawerActions,
    ];
  }

  return (
    <Transition nodeRef={drawerRef} in={show} appear={show} mountOnEnter={true} timeout={250}>
      {drawerTransitionState => {
        return (
          <Transition nodeRef={drawerRef} in={isExpanded} timeout={250}>
            {expandedTransitionState => {
              return (
                <AppLayoutBuiltInErrorBoundary>
                  <aside
                    id={activeAiDrawer?.id}
                    aria-hidden={!activeAiDrawer}
                    aria-label={computedAriaLabels.content}
                    className={clsx(
                      styles.drawer,
                      styles['ai-drawer'],
                      !animationDisabled && isExpanded && styles['with-expanded-motion'],
                      {
                        [sharedStyles['with-motion-horizontal']]: !animationDisabled,
                        [testutilStyles['active-drawer']]: show,
                        [styles['drawer-hidden']]: !show && drawerTransitionState === 'exited',
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
                        [customCssProps.drawerMinSize]: `${size}px`,
                        [customCssProps.drawerSize]: `${['entering', 'entered'].includes(drawerTransitionState) ? size : 0}px`,
                      }),
                    }}
                    data-testid={activeDrawerId && `awsui-app-layout-drawer-${activeDrawerId}`}
                  >
                    {!isMobile &&
                      activeAiDrawer?.resizable &&
                      (!isExpanded || expandedTransitionState !== 'entered') && (
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
                              <ButtonGroup
                                dropdownExpandToViewport={false}
                                variant="icon"
                                onItemClick={event => {
                                  switch (event.detail.id) {
                                    case 'close':
                                      onActiveAiDrawerChange?.(null, { initiatedByUserAction: true });
                                      break;
                                    case 'expand':
                                      setExpandedDrawerId(isExpanded ? null : activeDrawerId!);
                                      break;
                                    default:
                                      activeAiDrawer?.onHeaderActionClick?.(event);
                                  }
                                }}
                                ariaLabel="Left panel actions"
                                items={drawerActions}
                              />
                            </div>
                          </div>
                          {!isMobile && isExpanded && activeAiDrawer?.ariaLabels?.exitExpandedModeButton && (
                            <div className={styles['drawer-back-to-console-slot']}>
                              <div className={styles['drawer-back-to-console-button-wrapper']}>
                                {activeAiDrawer?.exitExpandedModeTrigger?.customIcon ? (
                                  <button
                                    className={clsx(
                                      testutilStyles['active-ai-drawer-leave-expanded-mode-custom-button'],
                                      styles['drawer-back-to-console-custom-button']
                                    )}
                                    formAction="none"
                                    onClick={() => setExpandedDrawerId(null)}
                                    aria-label={activeAiDrawer?.ariaLabels?.exitExpandedModeButton}
                                  >
                                    {activeAiDrawer?.exitExpandedModeTrigger?.customIcon}
                                  </button>
                                ) : (
                                  <button
                                    className={clsx(
                                      testutilStyles['active-ai-drawer-leave-expanded-mode-custom-button'],
                                      styles['drawer-back-to-console-button']
                                    )}
                                    formAction="none"
                                    onClick={() => setExpandedDrawerId(null)}
                                    aria-label={activeAiDrawer?.ariaLabels?.exitExpandedModeButton}
                                  >
                                    {activeAiDrawer?.ariaLabels?.exitExpandedModeButton}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </header>
                        <div className={styles['drawer-content-content']}>{activeAiDrawer?.content}</div>
                      </div>
                    </div>
                  </aside>
                </AppLayoutBuiltInErrorBoundary>
              );
            }}
          </Transition>
        );
      }}
    </Transition>
  );
}
