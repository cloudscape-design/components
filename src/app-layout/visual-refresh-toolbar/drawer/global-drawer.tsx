// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import { NonCancelableEventHandler } from '../../../internal/events';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { AppLayoutProps } from '../../interfaces';
import { AppLayoutInternals } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutGlobalDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  show: boolean;
  activeGlobalDrawer:
    | (AppLayoutProps.Drawer & { onShow?: NonCancelableEventHandler; onHide?: NonCancelableEventHandler })
    | undefined;
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
    verticalOffsets,
    drawersOpenQueue,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeGlobalDrawer?.id ?? '';

  const computedAriaLabels = {
    closeButton: activeGlobalDrawer ? activeGlobalDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeGlobalDrawer ? activeGlobalDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const drawersTopOffset = verticalOffsets.drawers ?? placement.insetBlockStart;
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

  return (
    <aside
      id={activeDrawerId}
      aria-hidden={!show}
      aria-label={computedAriaLabels.content}
      className={clsx(styles.drawer, styles['drawer-global'], sharedStyles['with-motion'], {
        [styles['drawer-hidden']]: !show,
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
        blockSize: `calc(100vh - ${drawersTopOffset}px - ${placement.insetBlockEnd}px)`,
        insetBlockStart: drawersTopOffset,
        ...(!isMobile && { [customCssProps.drawerSize]: `${size}px` }),
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
          />
        </div>
      )}
      <div className={clsx(styles['drawer-content-container'], sharedStyles['with-motion'])}>
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

export const createWidgetizedAppLayoutGlobalDrawer = createWidgetizedComponent(AppLayoutGlobalDrawerImplementation);
