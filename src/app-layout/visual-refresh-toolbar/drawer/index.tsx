// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { AppLayoutProps } from '../../interfaces';
import { TOOLS_DRAWER_ID } from '../../utils/use-drawers';
import { AppLayoutInternals } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
}

export function AppLayoutDrawerImplementation({ appLayoutInternals }: AppLayoutDrawerImplementationProps) {
  const {
    activeDrawer,
    minDrawerSize,
    activeDrawerSize,
    maxDrawerSize,
    ariaLabels,
    drawers,
    drawersFocusControl,
    isMobile,
    placement,
    drawersOpenQueue,
    onActiveDrawerChange,
    onActiveDrawerResize,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeDrawer?.id;

  const computedAriaLabels = {
    closeButton: activeDrawer ? activeDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeDrawer ? activeDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const isToolsDrawer = activeDrawer?.id === TOOLS_DRAWER_ID;
  const toolsOnlyMode = drawers.length === 1 && drawers[0].id === TOOLS_DRAWER_ID;
  const toolsContent = drawers?.find(drawer => drawer.id === TOOLS_DRAWER_ID)?.content;
  const resizeProps = useResize({
    currentWidth: activeDrawerSize,
    minWidth: minDrawerSize,
    maxWidth: maxDrawerSize,
    panelRef: drawerRef,
    handleRef: drawersFocusControl.refs.slider,
    onResize: size => onActiveDrawerResize({ id: activeDrawerId!, size }),
  });
  const lastOpenedDrawerId = drawersOpenQueue.length ? drawersOpenQueue[0] : null;

  return (
    <aside
      id={activeDrawerId}
      aria-hidden={!activeDrawer}
      aria-label={computedAriaLabels.content}
      className={clsx(styles.drawer, sharedStyles['with-motion'], {
        [styles['last-opened']]: lastOpenedDrawerId === activeDrawerId,
        [testutilStyles['active-drawer']]: !toolsOnlyMode && activeDrawerId,
        [testutilStyles.tools]: isToolsDrawer,
      })}
      ref={drawerRef}
      onBlur={e => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
          drawersFocusControl.loseFocus();
        }
      }}
      style={{
        blockSize: `calc(100vh - ${placement.insetBlockStart}px - ${placement.insetBlockEnd}px)`,
        insetBlockStart: placement.insetBlockStart,
      }}
      data-testid={`awsui-app-layout-drawer-${activeDrawerId}`}
    >
      {!isMobile && activeDrawer?.resizable && (
        <div className={styles['drawer-slider']}>
          <PanelResizeHandle
            ref={drawersFocusControl.refs.slider}
            position="side"
            className={testutilStyles['drawers-slider']}
            ariaLabel={activeDrawer?.ariaLabels?.resizeHandle}
            ariaValuenow={resizeProps.relativeSize}
            onKeyDown={resizeProps.onKeyDown}
            onPointerDown={resizeProps.onPointerDown}
          />
        </div>
      )}
      <div className={styles['drawer-content-container']}>
        <div className={clsx(styles['drawer-close-button'])}>
          <InternalButton
            ariaLabel={computedAriaLabels.closeButton}
            className={clsx({
              [testutilStyles['active-drawer-close-button']]: !isToolsDrawer && activeDrawerId,
              [testutilStyles['tools-close']]: isToolsDrawer,
            })}
            formAction="none"
            iconName={isMobile ? 'close' : 'angle-right'}
            onClick={() => onActiveDrawerChange(null)}
            ref={drawersFocusControl.refs.close}
            variant="icon"
          />
        </div>
        {toolsContent && (
          <div
            className={clsx(
              styles['drawer-content'],
              activeDrawerId !== TOOLS_DRAWER_ID && styles['drawer-content-hidden']
            )}
          >
            {toolsContent}
          </div>
        )}
        {activeDrawerId !== TOOLS_DRAWER_ID && <div className={styles['drawer-content']}>{activeDrawer?.content}</div>}
      </div>
    </aside>
  );
}

interface AppLayoutGlobalDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  show: boolean;
  activeGlobalDrawer: AppLayoutProps.Drawer | undefined;
}

export function AppLayoutGlobalDrawerImplementation({
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
    drawersOpenQueue,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeGlobalDrawer?.id ?? '';

  const computedAriaLabels = {
    closeButton: activeGlobalDrawer ? activeGlobalDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeGlobalDrawer ? activeGlobalDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const activeDrawerSize = activeGlobalDrawersSizes[activeDrawerId ?? ''] ?? 0;
  const minDrawerSize = minGlobalDrawersSizes[activeDrawerId ?? ''] ?? 0;
  const maxDrawerSize = maxGlobalDrawersSizes[activeDrawerId ?? ''] ?? 0;
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

  return (
    <aside
      id={activeDrawerId}
      aria-hidden={!show}
      aria-label={computedAriaLabels.content}
      className={clsx(styles.drawer, sharedStyles['with-motion'], {
        [styles['drawer-global']]: show,
        [styles['last-opened']]: lastOpenedDrawerId === activeDrawerId,
        [testutilStyles['active-drawer']]: show,
      })}
      ref={drawerRef}
      onBlur={e => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
          globalDrawersFocusControl.loseFocus();
        }
      }}
      style={{
        blockSize: show ? `calc(100vh - ${placement.insetBlockStart}px - ${placement.insetBlockEnd}px)` : 0,
        insetBlockStart: placement.insetBlockStart,
        ...(!isMobile && { [customCssProps.drawerSize]: `${show ? size : 0}px` }),
      }}
      data-testid={`awsui-app-layout-drawer-${activeDrawerId}`}
    >
      {!isMobile && activeGlobalDrawer?.resizable && (
        <div className={styles['drawer-slider']}>
          <PanelResizeHandle
            ref={refs?.slider}
            position="side"
            className={testutilStyles['drawers-slider']}
            ariaLabel={activeGlobalDrawer?.ariaLabels?.resizeHandle}
            ariaValuenow={resizeProps.relativeSize}
            onKeyDown={resizeProps.onKeyDown}
            onPointerDown={resizeProps.onPointerDown}
            compact={true}
          />
        </div>
      )}
      <div className={styles['drawer-content-container']}>
        <div className={clsx(styles['drawer-close-button'])}>
          <InternalButton
            ariaLabel={computedAriaLabels.closeButton}
            className={clsx({
              [testutilStyles['active-drawer-close-button']]: activeDrawerId,
            })}
            formAction="none"
            iconName={isMobile ? 'close' : 'angle-right'}
            onClick={() => onActiveGlobalDrawersChange(activeDrawerId)}
            ref={refs?.close}
            variant="icon"
          />
        </div>
        <div className={styles['drawer-content']}>{activeGlobalDrawer?.content}</div>
      </div>
    </aside>
  );
}

export const createWidgetizedAppLayoutDrawer = createWidgetizedComponent(AppLayoutDrawerImplementation);

export const createWidgetizedAppLayoutGlobalDrawer = createWidgetizedComponent(AppLayoutGlobalDrawerImplementation);
