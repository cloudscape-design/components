// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalItemOrGroup } from '../../../button-group/interfaces';
import ButtonGroup from '../../../button-group/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { usePrevious } from '../../../internal/hooks/use-previous';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { Focusable } from '../../utils/use-focus-control';
import { getDrawerStyles } from '../compute-layout';
import { AppLayoutInternals, InternalDrawer } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

export function AppLayoutBottomDrawerWrapper({ appLayoutInternals }: { appLayoutInternals: AppLayoutInternals }) {
  const { activeGlobalBottomDrawerId, globalDrawers } = appLayoutInternals;
  const openBottomDrawersHistory = useRef<Set<string>>(new Set());
  const bottomDrawers = globalDrawers.filter(drawer => drawer.position === 'bottom');
  useEffect(() => {
    if (activeGlobalBottomDrawerId) {
      openBottomDrawersHistory.current.add(activeGlobalBottomDrawerId);
    }
  }, [activeGlobalBottomDrawerId]);

  return (
    <>
      {bottomDrawers.map(drawer => {
        return (
          <AppLayoutGlobalBottomDrawerImplementation
            key={drawer.id}
            activeDrawer={
              activeGlobalBottomDrawerId === drawer.id ||
              (drawer.preserveInactiveContent && openBottomDrawersHistory.current.has(drawer.id))
                ? drawer
                : undefined
            }
            show={activeGlobalBottomDrawerId === drawer.id}
            appLayoutInternals={appLayoutInternals}
          />
        );
      })}
    </>
  );
}

interface AppLayoutGlobalDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  show: boolean;
  activeDrawer: InternalDrawer | undefined;
}

const GAP_HEIGHT = 10;
const RESIZE_HANDLER_HEIGHT = 18;

function AppLayoutGlobalBottomDrawerImplementation({
  appLayoutInternals,
  show,
  activeDrawer,
}: AppLayoutGlobalDrawerImplementationProps) {
  const {
    ariaLabels,
    isMobile,
    onActiveGlobalBottomDrawerChange,
    onActiveDrawerResize,
    minGlobalBottomDrawerSize,
    activeGlobalBottomDrawerSize,
    drawersOpenQueue,
    expandedDrawerId,
    setExpandedDrawerId,
    activeAiDrawer,
    bottomDrawersFocusControl,
    getMaxGlobalBottomDrawerHeight,
    reportBottomDrawerSize,
    verticalOffsets,
    placement,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeDrawer?.id ?? '';

  const computedAriaLabels = {
    closeButton: activeDrawer ? activeDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeDrawer ? activeDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const { drawerTopOffset: mobileDrawerTopOffset, drawerHeight: drawerFullScreenHeight } = getDrawerStyles(
    verticalOffsets,
    isMobile,
    placement
  );
  const activeDrawerSize = activeGlobalBottomDrawerSize ?? 0;
  const minDrawerSize = minGlobalBottomDrawerSize ?? 0;
  const maxDrawerSize = getMaxGlobalBottomDrawerHeight();
  const refs = bottomDrawersFocusControl.refs;
  const resizeProps = useResize({
    currentWidth: activeDrawerSize,
    minWidth: minDrawerSize,
    maxWidth: maxDrawerSize,
    panelRef: drawerRef,
    handleRef: refs?.slider,
    onResize: size => onActiveDrawerResize({ id: activeDrawerId!, size }),
    position: 'bottom',
  });
  const size = getLimitedValue(minDrawerSize, activeDrawerSize, maxDrawerSize);
  const lastOpenedDrawerId = drawersOpenQueue.length ? drawersOpenQueue[0] : null;
  const hasTriggerButton = !!activeDrawer?.trigger;
  const isExpanded = activeDrawer?.isExpandable && expandedDrawerId === activeDrawerId;
  const wasExpanded = usePrevious(isExpanded);
  const animationDisabled =
    (activeDrawer?.defaultActive && !drawersOpenQueue.includes(activeDrawer.id)) || (wasExpanded && !isExpanded);

  // Prevent main content scroll when bottom drawer opens with animations
  useEffect(() => {
    if (!animationDisabled && show && drawerRef.current) {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const abortController = new AbortController();

      // Temporarily prevent scrolling during animation
      const preventScroll = () => {
        document.documentElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;
      };

      // Handle transition end to remove scroll prevention
      const handleTransitionEnd = (event: TransitionEvent) => {
        // Only handle transitions on the drawer element itself
        if (event.target === drawerRef.current) {
          abortController.abort();
        }
      };

      // Add scroll prevention during animation
      document.addEventListener('scroll', preventScroll, {
        passive: false,
        signal: abortController.signal,
      });

      drawerRef.current.addEventListener('transitionend', handleTransitionEnd, {
        signal: abortController.signal,
      });

      return () => {
        abortController.abort();
      };
    }
  }, [show, animationDisabled]);

  let drawerActions: ReadonlyArray<InternalItemOrGroup> = [
    {
      type: 'icon-button',
      id: 'close',
      iconName: isMobile ? 'close' : 'angle-down',
      text: computedAriaLabels.closeButton ?? '',
      analyticsAction: 'close',
    },
  ];
  if (!isMobile && activeDrawer?.isExpandable) {
    drawerActions = [
      {
        type: 'icon-button',
        id: 'expand',
        iconName: isExpanded ? 'shrink' : 'expand',
        text: activeDrawer?.ariaLabels?.expandedModeButton ?? '',
        analyticsAction: isExpanded ? 'expand' : 'collapse',
      },
      ...drawerActions,
    ];
  }
  if (activeDrawer?.headerActions) {
    drawerActions = [
      {
        type: 'group',
        text: 'Actions',
        items: activeDrawer.headerActions!,
      },
      ...drawerActions,
    ];
  }

  useEffect(() => {
    reportBottomDrawerSize(size);
  }, [reportBottomDrawerSize, size]);

  return (
    <Transition
      nodeRef={drawerRef}
      in={show || isExpanded}
      appear={show || isExpanded}
      mountOnEnter={true}
      timeout={250}
    >
      {state => {
        return (
          <aside
            id={activeDrawerId}
            aria-hidden={!show}
            aria-label={computedAriaLabels.content}
            className={clsx(
              styles.drawer,
              styles['bottom-drawer'],
              styles[state],
              !animationDisabled && sharedStyles['with-motion-vertical'],
              !animationDisabled && isExpanded && styles['with-expanded-motion'],
              {
                [styles['drawer-hidden']]: !show && state === 'exited',
                [styles['last-opened']]: (!activeAiDrawer && lastOpenedDrawerId === activeDrawerId) || isExpanded,
                [testutilStyles['active-drawer']]: show,
                [styles['drawer-expanded']]: isExpanded,
              }
            )}
            ref={drawerRef}
            onBlur={e => {
              // Drawers with trigger buttons follow this restore focus logic:
              // If a previously focused element exists, restore focus on it; otherwise, focus on the associated trigger button.
              // This function resets the previously focused element.
              // If the drawer has no trigger button and loses focus on the previously focused element, it defaults to document.body,
              // which ideally should never happen.
              if (!hasTriggerButton) {
                return;
              }

              if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                bottomDrawersFocusControl.loseFocus();
              }
            }}
            style={{
              ...(isMobile && {
                blockSize: drawerFullScreenHeight,
                insetBlockStart: mobileDrawerTopOffset,
              }),
              ...(!isMobile && {
                [customCssProps.bottomDrawerSize]: `${['entering', 'entered'].includes(state) ? (isExpanded ? drawerFullScreenHeight : size + 'px') : 0}`,
              }),
            }}
            data-testid={`awsui-app-layout-drawer-${activeDrawerId}`}
          >
            <div className={clsx(styles['global-drawer-wrapper'])}>
              {!isMobile && !isExpanded && <div className={styles['drawer-gap']} />}
              {!isMobile && activeDrawer?.resizable && !isExpanded && (
                <div className={styles['drawer-slider']}>
                  <PanelResizeHandle
                    ref={refs?.slider}
                    position="bottom"
                    className={testutilStyles['drawers-slider']}
                    ariaLabel={activeDrawer?.ariaLabels?.resizeHandle}
                    tooltipText={activeDrawer?.ariaLabels?.resizeHandleTooltipText}
                    ariaValuenow={resizeProps.relativeSize}
                    onKeyDown={resizeProps.onKeyDown}
                    onDirectionClick={resizeProps.onDirectionClick}
                    onPointerDown={resizeProps.onPointerDown}
                  />
                </div>
              )}
              <div
                className={clsx(styles['drawer-content-container'], sharedStyles['with-motion-horizontal'])}
                data-testid={`awsui-app-layout-drawer-content-${activeDrawerId}`}
              >
                <div className={styles['drawer-actions']}>
                  <ButtonGroup
                    dropdownExpandToViewport={false}
                    variant="icon"
                    onItemClick={event => {
                      switch (event.detail.id) {
                        case 'close':
                          onActiveGlobalBottomDrawerChange(null, { initiatedByUserAction: true });
                          break;
                        case 'expand':
                          setExpandedDrawerId(isExpanded ? null : activeDrawerId);
                          break;
                        default:
                          activeDrawer?.onHeaderActionClick?.(event);
                      }
                    }}
                    ariaLabel="Global panel actions"
                    items={drawerActions}
                    __internalRootRef={(root: HTMLElement) => {
                      if (!root) {
                        return;
                      }
                      refs.close = { current: root.querySelector('[data-itemid="close"]') as unknown as Focusable };
                    }}
                  />
                </div>
                <div
                  className={styles['drawer-content']}
                  style={{
                    blockSize:
                      isMobile || isExpanded
                        ? drawerFullScreenHeight
                        : `${size - GAP_HEIGHT - RESIZE_HANDLER_HEIGHT}px`,
                  }}
                >
                  {activeDrawer?.content}
                </div>
              </div>
            </div>
          </aside>
        );
      }}
    </Transition>
  );
}

export default AppLayoutGlobalBottomDrawerImplementation;
