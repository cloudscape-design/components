// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
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
    verticalOffsets,
    drawersOpenQueue,
    expandedDrawerId,
    setExpandedDrawerId,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const originalLeftPositionRef = useRef<number | null>(null);
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
  const animationDisabled = activeGlobalDrawer?.defaultActive && !drawersOpenQueue.includes(activeGlobalDrawer.id);
  const isExpanded = activeGlobalDrawer?.isExpandable && expandedDrawerId === activeDrawerId;

  React.useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) {
      return;
    }

    // Define transition end handler that will be used in both effect and cleanup
    const onTransitionEnd = () => {
      console.log('Transition ended');

      if (drawer) {
        drawer.removeEventListener('transitionend', onTransitionEnd);
        drawer.classList.remove(styles['drawer-expanded']);
        drawer.style.position = '';
        drawer.style.left = '';
        originalLeftPositionRef.current = null;
      }
    };

    if (isExpanded) {
      const rect = drawer.getBoundingClientRect();
      originalLeftPositionRef.current = rect.left;
      drawer.style.position = 'absolute';
      drawer.style.left = `${rect.left}px`;
      drawer.style.transition = `0.6s cubic-bezier(0.84, 0.00, 0.16, 1.00)`;

      console.log('1. Left position set to:', rect.left);

      // Use requestAnimationFrame to ensure position is set before adding expanded class
      requestAnimationFrame(() => {
        if (drawer) {
          drawer.classList.add(styles['drawer-expanded']);
          drawer.style.left = `0px`;
          drawer.style.inlineSize = `100%`;
        }
      });
    } else {
      // First set the left position back to original position
      if (originalLeftPositionRef.current !== null) {
        console.log('Setting left position back to original');
        drawer.style.left = `${originalLeftPositionRef.current}px`;

        const rect = drawer.getBoundingClientRect();
        console.log('2. Left position set to:', rect.left);

        // Wait for transition to complete before removing class
        drawer.addEventListener('transitionend', onTransitionEnd);
      }
    }

    // Cleanup event listener if component unmounts during transition
    return () => {
      drawer.removeEventListener('transitionend', onTransitionEnd);
    };
  }, [isExpanded]); // styles is not needed as a dependency since it's a module import

  return (
    <Transition
      nodeRef={drawerRef}
      //in={show}
      in={show}
      appear={show}
      timeout={0}
    >
      {state => {
        console.log('Transition state:', state);
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
              {
                [styles['drawer-hidden']]: !show,
                [styles['last-opened']]: lastOpenedDrawerId === activeDrawerId || isExpanded,
                [testutilStyles['active-drawer']]: show,
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
                [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? size : 0}px`,
              }),
            }}
            data-testid={`awsui-app-layout-drawer-${activeDrawerId}`}
          >
            {!isMobile && activeGlobalDrawer?.resizable && !isExpanded && (
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
            <div
              className={clsx(styles['drawer-content-container'], sharedStyles['with-motion-horizontal'])}
              data-testid={`awsui-app-layout-drawer-content-${activeDrawerId}`}
            >
              {!isMobile && activeGlobalDrawer?.isExpandable && (
                <div className={styles['drawer-expanded-mode-button']}>
                  <InternalButton
                    ariaLabel={activeGlobalDrawer?.ariaLabels?.expandedModeButton}
                    className={testutilStyles['active-drawer-expanded-mode-button']}
                    formAction="none"
                    ariaExpanded={isExpanded}
                    iconName={isExpanded ? 'shrink' : 'expand'}
                    onClick={() => setExpandedDrawerId(isExpanded ? undefined : activeDrawerId)}
                    variant="icon"
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
                />
              </div>
              <div className={styles['drawer-content']} style={{ blockSize: drawerHeight }}>
                {activeGlobalDrawer?.content}
              </div>
            </div>
          </aside>
        );
      }}
    </Transition>
  );
}

export default AppLayoutGlobalDrawerImplementation;
