// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { usePrevious } from '../../../internal/hooks/use-previous';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import Toggle from '../../../toggle/internal';
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
    verticalOffsets,
    drawersOpenQueue,
    onActiveAiDrawerChange,
    onActiveDrawerResize,
    expandedDrawerId,
    setExpandedDrawerId,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeAiDrawer?.id;
  const [isWhiteHeader, setIsWhiteHeader] = useState(false);

  const computedAriaLabels = {
    closeButton: activeAiDrawer ? activeAiDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeAiDrawer ? activeAiDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const resizeProps = useResize({
    currentWidth: activeAiDrawerSize,
    minWidth: minAiDrawerSize,
    maxWidth: maxAiDrawerSize,
    panelRef: drawerRef,
    handleRef: aiDrawerFocusControl.refs.slider,
    onResize: size => onActiveDrawerResize({ id: activeDrawerId!, size }),
    position: 'side-start',
  });
  const size = getLimitedValue(minAiDrawerSize, activeAiDrawerSize, maxAiDrawerSize);
  const lastOpenedDrawerId = drawersOpenQueue?.length ? drawersOpenQueue[0] : activeDrawerId;
  const isExpanded = activeAiDrawer?.isExpandable && expandedDrawerId === activeDrawerId;
  const wasExpanded = usePrevious(isExpanded);
  const animationDisabled =
    (activeAiDrawer?.defaultActive && !drawersOpenQueue.includes(activeAiDrawer.id)) || (wasExpanded && !isExpanded);
  const drawerHeight = `calc(100vh - ${verticalOffsets.toolbar}}px)`;

  return (
    <Transition nodeRef={drawerRef} in={!!activeAiDrawer || isExpanded} appear={true} timeout={0}>
      {state => (
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
              [styles['last-opened']]: lastOpenedDrawerId === activeDrawerId || isExpanded,
              [testutilStyles['active-drawer']]: activeDrawerId,
              [styles['drawer-hidden']]: !activeAiDrawer,
              [testutilStyles['drawer-closed']]: !activeAiDrawer,
              [styles['drawer-expanded']]: isExpanded,
            }
          )}
          ref={drawerRef}
          onBlur={e => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              aiDrawerFocusControl.loseFocus();
            }
          }}
          style={{
            blockSize: drawerHeight,
            insetBlockStart: verticalOffsets.toolbar,
            ...(!isMobile && {
              [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? size : 0}px`,
            }),
          }}
          data-testid={activeDrawerId && `awsui-app-layout-drawer-${activeDrawerId}`}
        >
          {!isMobile && activeAiDrawer?.resizable && (
            <div className={styles['drawer-slider']}>
              <PanelResizeHandle
                ref={aiDrawerFocusControl.refs.slider}
                position="side-start"
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
          <div className={clsx(styles['drawer-content-container'], sharedStyles['with-motion-horizontal'])}>
            <div className={styles['drawer-content']}>
              <header className={clsx(styles['drawer-content-header'], isWhiteHeader && styles['white-header'])}>
                <div>
                  <Toggle checked={isWhiteHeader} onChange={({ detail }) => setIsWhiteHeader(detail.checked)}>
                    White header
                  </Toggle>
                </div>
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
                      onClick={() => onActiveAiDrawerChange(null, { initiatedByUserAction: true })}
                      ref={aiDrawerFocusControl.refs.close}
                      variant="icon"
                      analyticsAction="close"
                    />
                  </div>
                </div>
              </header>
              {activeAiDrawer?.content}
            </div>
          </div>
          {!isMobile && <div className={styles['drawer-gap']} />}
        </aside>
      )}
    </Transition>
  );
}

export const createWidgetizedGlobalAppLayoutAiDrawer = createWidgetizedComponent(AppLayoutGlobalAiDrawerImplementation);
