// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { ButtonGroupProps } from '../../../button-group/interfaces';
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

interface AppLayoutGlobalDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  show: boolean;
  activeGlobalDrawer: InternalDrawer | undefined;
}

function AppLayoutGlobalDrawerImplementation({
  appLayoutInternals,
  show,
  activeGlobalDrawer,
}: AppLayoutGlobalDrawerImplementationProps) {
  const {
    ariaLabels,
    globalDrawersFocusControl,
    isMobile,
    placement,
    onActiveGlobalDrawersChange,
    onActiveDrawerResize,
    minGlobalDrawersSizes,
    maxGlobalDrawersSizes,
    activeGlobalDrawersSizes,
    activeGlobalDrawers,
    verticalOffsets,
    drawersOpenQueue,
    expandedDrawerId,
    setExpandedDrawerId,
    activeAiDrawer,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeGlobalDrawer?.id ?? '';

  const computedAriaLabels = {
    closeButton: activeGlobalDrawer ? activeGlobalDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeGlobalDrawer ? activeGlobalDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const { drawerTopOffset, drawerHeight } = getDrawerStyles(verticalOffsets, isMobile, placement);
  const activeDrawerSize = (activeDrawerId ? activeGlobalDrawersSizes[activeDrawerId] : 0) ?? 0;
  const minDrawerSize = (activeDrawerId ? minGlobalDrawersSizes[activeDrawerId] : 0) ?? 0;
  const maxDrawerSize = (activeDrawerId ? maxGlobalDrawersSizes[activeDrawerId] : 0) ?? 0;
  const refs = globalDrawersFocusControl.refs[activeDrawerId];
  const resizeProps = useResize({
    currentWidth: activeDrawerSize,
    minWidth: minDrawerSize,
    maxWidth: maxDrawerSize,
    panelRef: drawerRef,
    handleRef: refs?.slider,
    onResize: size => onActiveDrawerResize({ id: activeDrawerId!, size }),
  });
  const size = getLimitedValue(minDrawerSize, activeDrawerSize, maxDrawerSize);
  const lastOpenedDrawerId = drawersOpenQueue.length ? drawersOpenQueue[0] : null;
  const hasTriggerButton = !!activeGlobalDrawer?.trigger;
  const isExpanded = activeGlobalDrawer?.isExpandable && expandedDrawerId === activeDrawerId;
  const wasExpanded = usePrevious(isExpanded);
  const animationDisabled =
    (activeGlobalDrawer?.defaultActive && !drawersOpenQueue.includes(activeGlobalDrawer.id)) ||
    (wasExpanded && !isExpanded);
  let drawerActions: ReadonlyArray<ButtonGroupProps.InternalItemOrGroup> = [
    {
      type: 'icon-button',
      id: 'close',
      iconName: isMobile ? 'close' : 'angle-right',
      text: computedAriaLabels.closeButton ?? '',
      analyticsAction: 'close',
    },
  ];
  if (!isMobile && activeGlobalDrawer?.isExpandable) {
    drawerActions = [
      {
        type: 'icon-button',
        id: 'expand',
        iconName: isExpanded ? 'shrink' : 'expand',
        text: activeGlobalDrawer?.ariaLabels?.expandedModeButton ?? '',
        analyticsAction: isExpanded ? 'expand' : 'collapse',
      },
      ...drawerActions,
    ];
  }
  if (activeGlobalDrawer?.headerActions) {
    drawerActions = [
      {
        type: 'group',
        text: 'Actions',
        items: activeGlobalDrawer.headerActions!,
      },
      ...drawerActions,
    ];
  }

  return (
    <Transition nodeRef={drawerRef} in={show || isExpanded} appear={show || isExpanded} timeout={0}>
      {state => {
        return (
          <aside
            id={activeDrawerId}
            aria-hidden={!show}
            aria-label={computedAriaLabels.content}
            className={clsx(
              styles.drawer,
              styles['drawer-global'],
              styles[state],
              !animationDisabled && sharedStyles['with-motion-horizontal'],
              !animationDisabled && isExpanded && styles['with-expanded-motion'],
              {
                [styles['drawer-hidden']]: !show,
                [styles['last-opened']]: (!activeAiDrawer && lastOpenedDrawerId === activeDrawerId) || isExpanded,
                [testutilStyles['active-drawer']]: show,
                [styles['drawer-expanded']]: isExpanded,
                [styles['has-next-siblings']]:
                  activeGlobalDrawers.findIndex(drawer => drawer.id === activeDrawerId) + 1 <
                  activeGlobalDrawers.length,
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
                globalDrawersFocusControl.loseFocus();
              }
            }}
            style={{
              blockSize: drawerHeight,
              insetBlockStart: drawerTopOffset,
              ...(!isMobile && {
                [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? (isExpanded ? '100%' : size + 'px') : 0}`,
              }),
            }}
            data-testid={`awsui-app-layout-drawer-${activeDrawerId}`}
          >
            <div className={clsx(styles['global-drawer-wrapper'])}>
              {!isMobile && <div className={styles['drawer-gap']}></div>}
              {!isMobile && activeGlobalDrawer?.resizable && !isExpanded && (
                <div className={styles['drawer-slider']}>
                  <PanelResizeHandle
                    ref={refs?.slider}
                    position="side"
                    className={testutilStyles['drawers-slider']}
                    ariaLabel={activeGlobalDrawer?.ariaLabels?.resizeHandle}
                    tooltipText={activeGlobalDrawer?.ariaLabels?.resizeHandleTooltipText}
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
                          onActiveGlobalDrawersChange(activeDrawerId, { initiatedByUserAction: true });
                          break;
                        case 'expand':
                          setExpandedDrawerId(isExpanded ? null : activeDrawerId);
                          break;
                        default:
                          activeGlobalDrawer?.onHeaderActionClick?.(event);
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
                <div className={styles['drawer-content']} style={{ blockSize: drawerHeight }}>
                  {activeGlobalDrawer?.content}
                </div>
              </div>
            </div>
          </aside>
        );
      }}
    </Transition>
  );
}

export default AppLayoutGlobalDrawerImplementation;
