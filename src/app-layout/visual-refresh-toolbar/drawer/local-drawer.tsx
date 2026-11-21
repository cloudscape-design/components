// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { TOOLS_DRAWER_ID } from '../../utils/use-drawers';
import { getDrawerStyles } from '../compute-layout';
import { AppLayoutInternals, InternalDrawer } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  bottomDrawerReportedSize?: number;
  drawer: InternalDrawer;
}

export function AppLayoutDrawerImplementation({
  appLayoutInternals,
  bottomDrawerReportedSize,
  drawer,
}: AppLayoutDrawerImplementationProps) {
  const {
    activeDrawer,
    minDrawerSize,
    activeDrawerSize,
    maxDrawerSize,
    drawers,
    drawersFocusControl,
    isMobile,
    placement,
    verticalOffsets,
    drawersOpenQueue,
    onActiveDrawerChange,
    onActiveDrawerResize,
    drawerAnimationDisabled,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerId = drawer.id;
  const show = activeDrawer?.id === drawerId;

  const { drawerTopOffset, drawerHeight } = getDrawerStyles(
    verticalOffsets,
    isMobile,
    placement,
    isMobile ? 0 : (bottomDrawerReportedSize ?? 0)
  );
  const toolsOnlyMode = drawers.length === 1 && drawers[0].id === TOOLS_DRAWER_ID;
  const isToolsDrawer = (show && drawerId === TOOLS_DRAWER_ID) || toolsOnlyMode;
  const resizeProps = useResize({
    currentWidth: activeDrawerSize,
    minWidth: minDrawerSize,
    maxWidth: maxDrawerSize,
    panelRef: drawerRef,
    handleRef: drawersFocusControl.refs.slider,
    onResize: size => onActiveDrawerResize({ id: drawerId, size }),
  });
  // temporary handle a situation when app-layout is old, but this component come as a widget
  const isLegacyDrawer = drawersOpenQueue === undefined;
  const size = getLimitedValue(minDrawerSize, activeDrawerSize, maxDrawerSize);
  const lastOpenedDrawerId = drawersOpenQueue?.length ? drawersOpenQueue[0] : activeDrawer?.id;
  const animationDisabled = drawerAnimationDisabled || (drawer.defaultActive && !drawersOpenQueue.includes(drawerId));

  return (
    <Transition nodeRef={drawerRef} in={show} appear={true} timeout={0}>
      {state => (
        <aside
          id={drawerId}
          aria-hidden={!show}
          aria-label={drawer.ariaLabels?.drawerName}
          className={clsx(styles.drawer, {
            [sharedStyles['with-motion-horizontal']]: !animationDisabled,
            [styles['last-opened']]: show && lastOpenedDrawerId === drawerId,
            [styles.legacy]: isLegacyDrawer,
            [testutilStyles['active-drawer']]: !toolsOnlyMode && show,
            [testutilStyles.tools]: isToolsDrawer,
            [styles['drawer-hidden']]: !show,
            [testutilStyles['drawer-closed']]: !show,
          })}
          ref={drawerRef}
          onBlur={e => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              drawersFocusControl.loseFocus();
            }
          }}
          style={{
            blockSize: drawerHeight,
            insetBlockStart: drawerTopOffset,
            ...(!isMobile &&
              !isLegacyDrawer && {
                [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? size : 0}px`,
              }),
          }}
          data-testid={show ? `awsui-app-layout-drawer-${drawerId}` : undefined}
        >
          {!isMobile && drawer.resizable && (
            <div className={styles['drawer-slider']}>
              <PanelResizeHandle
                ref={show ? drawersFocusControl.refs.slider : undefined}
                position="side"
                className={testutilStyles['drawers-slider']}
                ariaLabel={drawer.ariaLabels?.resizeHandle}
                tooltipText={drawer.ariaLabels?.resizeHandleTooltipText}
                ariaValuenow={resizeProps.relativeSize}
                onKeyDown={resizeProps.onKeyDown}
                onPointerDown={resizeProps.onPointerDown}
                onDirectionClick={resizeProps.onDirectionClick}
              />
            </div>
          )}
          <div className={clsx(styles['drawer-content-container'], sharedStyles['with-motion-horizontal'])}>
            <div className={clsx(styles['drawer-close-button'])}>
              <InternalButton
                ariaLabel={drawer.ariaLabels?.closeButton}
                className={clsx({
                  [testutilStyles['active-drawer-close-button']]: !isToolsDrawer && show,
                  [testutilStyles['tools-close']]: isToolsDrawer,
                })}
                formAction="none"
                iconName={isMobile ? 'close' : 'angle-right'}
                onClick={() => onActiveDrawerChange(null, { initiatedByUserAction: true })}
                ref={show ? drawersFocusControl.refs.close : undefined}
                variant="icon"
                analyticsAction="close"
              />
            </div>
            <div className={styles['drawer-content']} style={{ blockSize: drawerHeight }}>
              {drawer.content}
            </div>
          </div>
        </aside>
      )}
    </Transition>
  );
}
