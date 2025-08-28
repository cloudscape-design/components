// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { usePrevious } from '../../../internal/hooks/use-previous';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
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
  const [state, setState] = useState<'entered' | undefined>();

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => {
        setState('entered');
      });
    }
    return () => {
      setState(undefined);
    };
  }, [show]);

  return (
    <aside
      id={activeDrawerId}
      aria-hidden={!show}
      aria-label={computedAriaLabels.content}
      className={clsx(
        styles.drawer,
        styles['drawer-global'],
        !animationDisabled && sharedStyles['with-motion-horizontal'],
        !animationDisabled && isExpanded && styles['with-expanded-motion'],
        {
          [styles['drawer-hidden']]: !show,
          [styles['last-opened']]: lastOpenedDrawerId === activeDrawerId || isExpanded,
          [testutilStyles['active-drawer']]: show,
          [styles['drawer-expanded']]: isExpanded,
          [styles['has-next-siblings']]:
            activeGlobalDrawers.findIndex(drawer => drawer.id === activeDrawerId) + 1 < activeGlobalDrawers.length,
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
          [customCssProps.drawerSize]: `${state === 'entered' ? (isExpanded ? '100%' : `${size}px`) : '0px'}`,
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
            {!isMobile && activeGlobalDrawer?.isExpandable && (
              <div className={styles['drawer-expanded-mode-button']}>
                <InternalButton
                  ariaLabel={activeGlobalDrawer?.ariaLabels?.expandedModeButton}
                  className={testutilStyles['active-drawer-expanded-mode-button']}
                  formAction="none"
                  ariaExpanded={isExpanded}
                  iconName={isExpanded ? 'shrink' : 'expand'}
                  onClick={() => setExpandedDrawerId(isExpanded ? null : activeDrawerId)}
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
                iconName={isMobile ? 'close' : 'angle-right'}
                onClick={() => onActiveGlobalDrawersChange(activeDrawerId, { initiatedByUserAction: true })}
                ref={refs?.close}
                variant="icon"
                analyticsAction="close"
              />
            </div>
          </div>
          <div className={styles['drawer-content']} style={{ blockSize: drawerHeight }}>
            {activeGlobalDrawer?.content}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AppLayoutGlobalDrawerImplementation;
