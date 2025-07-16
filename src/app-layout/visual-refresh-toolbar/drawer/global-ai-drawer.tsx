// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { getDrawerStyles } from '../compute-layout';
import { AppLayoutInternals } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutGlobalAiDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
}

export function AppLayoutGlobalAiDrawerImplementation({
  appLayoutInternals,
}: AppLayoutGlobalAiDrawerImplementationProps) {
  const {
    activeAiDrawer,
    activeAiDrawerSize,
    minAiDrawerSize,
    maxAiDrawerSize,
    ariaLabels,
    aiDrawerFocusControl,
    isMobile,
    placement,
    verticalOffsets,
    drawersOpenQueue,
    onActiveAiDrawerChange,
    onActiveDrawerResize,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeAiDrawer?.id;

  const computedAriaLabels = {
    closeButton: activeAiDrawer ? activeAiDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeAiDrawer ? activeAiDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const { drawerHeight, drawerTopOffset } = getDrawerStyles(verticalOffsets, isMobile, placement);
  const resizeProps = useResize({
    currentWidth: activeAiDrawerSize,
    minWidth: minAiDrawerSize,
    maxWidth: maxAiDrawerSize,
    panelRef: drawerRef,
    handleRef: aiDrawerFocusControl.refs.slider,
    onResize: size => onActiveDrawerResize({ id: activeDrawerId!, size }),
  });
  const size = getLimitedValue(minAiDrawerSize, activeAiDrawerSize, maxAiDrawerSize);
  const lastOpenedDrawerId = drawersOpenQueue?.length ? drawersOpenQueue[0] : activeDrawerId;
  const animationDisabled = activeAiDrawer?.defaultActive && !drawersOpenQueue.includes(activeAiDrawer.id);

  return (
    <Transition nodeRef={drawerRef} in={!!activeAiDrawer} appear={true} timeout={0}>
      {state => (
        <aside
          id={activeAiDrawer?.id}
          aria-hidden={!activeAiDrawer}
          aria-label={computedAriaLabels.content}
          className={clsx(styles.drawer, styles['ai-drawer'], {
            [sharedStyles['with-motion-horizontal']]: !animationDisabled,
            [styles['last-opened']]: lastOpenedDrawerId === activeDrawerId,
            [testutilStyles['active-drawer']]: activeDrawerId,
            [styles['drawer-hidden']]: !activeAiDrawer,
            [testutilStyles['drawer-closed']]: !activeAiDrawer,
          })}
          ref={drawerRef}
          onBlur={e => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              aiDrawerFocusControl.loseFocus();
            }
          }}
          style={{
            blockSize: drawerHeight,
            insetBlockStart: drawerTopOffset,
            ...(!isMobile && {
              [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? size : 0}px`,
            }),
          }}
          data-testid={activeDrawerId && `awsui-app-layout-drawer-${activeDrawerId}`}
        >
          <div className={clsx(styles['drawer-content-container'], sharedStyles['with-motion-horizontal'])}>
            <div className={clsx(styles['drawer-close-button'])}>
              <InternalButton
                ariaLabel={computedAriaLabels.closeButton}
                className={clsx({
                  [testutilStyles['active-drawer-close-button']]: activeDrawerId,
                })}
                formAction="none"
                iconName={isMobile ? 'close' : 'angle-right'}
                onClick={() => onActiveAiDrawerChange(null, { initiatedByUserAction: true })}
                ref={aiDrawerFocusControl.refs.close}
                variant="icon"
                analyticsAction="close"
              />
            </div>
            <div className={styles['drawer-content']} style={{ blockSize: drawerHeight }}>
              {activeAiDrawer?.content}
            </div>
          </div>
          {!isMobile && activeAiDrawer?.resizable && (
            <div className={styles['drawer-slider']}>
              <PanelResizeHandle
                ref={aiDrawerFocusControl.refs.slider}
                position="side"
                className={testutilStyles['drawers-slider']}
                ariaLabel={activeAiDrawer?.ariaLabels?.resizeHandle}
                tooltipText={activeAiDrawer?.ariaLabels?.resizeHandleTooltipText}
                ariaValuenow={resizeProps.relativeSize}
                onKeyDown={resizeProps.onKeyDown}
                onPointerDown={resizeProps.onPointerDown}
                onDirectionClick={resizeProps.onDirectionClick}
              />
            </div>
          )}
        </aside>
      )}
    </Transition>
  );
}

export const createWidgetizedGlobalAppLayoutAiDrawer = createWidgetizedComponent(AppLayoutGlobalAiDrawerImplementation);
