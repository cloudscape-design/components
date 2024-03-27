// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { InternalButton } from '../../button/internal';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { Transition } from '../../internal/components/transition';
import customCssProps from '../../internal/generated/custom-css-properties';

interface ToolsProps {
  children: React.ReactNode;
}

/**
 * The Tools component consists of the following elements:
 * the container, or root element, that sits as a direct child to the Layout grid definition;
 * the split panel, which exists only if there is a split panel in side position;
 * the tools, or drawer, that contains the hide tools form and the children passed through the API;
 * the show tools form that contains the triggers for both the drawer and the
 * split panel in large viewports;
 */
export default function Tools({ children }: ToolsProps) {
  const {
    ariaLabels,
    disableBodyScroll,
    drawers,
    handleToolsClick,
    hasDrawerViewportOverlay,
    isMobile,
    isSplitPanelOpen,
    isToolsOpen,
    loseToolsFocus,
    splitPanel,
    splitPanelDisplayed,
    tools,
    toolsControlId,
    toolsHide,
    toolsRefs,
    toolsWidth,
  } = useAppLayoutInternals();

  const hasSplitPanel = !!splitPanel && splitPanelDisplayed;
  const isUnfocusable = hasDrawerViewportOverlay && !isToolsOpen;

  /**
   * If the drawers property is defined the SplitPanel will be mounted and rendered
   * by the Drawers component.
   */
  if ((toolsHide && !hasSplitPanel) || drawers) {
    return null;
  }

  return (
    <Transition in={isToolsOpen ?? false}>
      {(state, transitionEventsRef) => (
        <div
          className={clsx(styles['tools-container'], {
            [styles['disable-body-scroll']]: disableBodyScroll,
            [styles.unfocusable]: isUnfocusable,
            [testutilStyles['drawer-closed']]: !isToolsOpen,
          })}
          style={{
            [customCssProps.toolsAnimationStartingOpacity]: `${hasSplitPanel && isSplitPanelOpen ? 1 : 0}`,
            [customCssProps.toolsWidth]: `${toolsWidth}px`,
          }}
          onBlur={e => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              loseToolsFocus();
            }
          }}
        >
          {children}

          {!toolsHide && (
            <aside
              id={toolsControlId}
              aria-hidden={!isToolsOpen ? true : false}
              aria-label={ariaLabels?.tools ?? undefined}
              className={clsx(
                styles.tools,
                {
                  [styles.animating]: state === 'entering',
                  [styles['is-tools-open']]: isToolsOpen,
                },
                testutilStyles.tools
              )}
              ref={state !== 'exiting' ? transitionEventsRef : undefined}
            >
              <div className={clsx(styles['animated-content'])}>
                <div className={clsx(styles['hide-tools'])}>
                  <InternalButton
                    ariaLabel={ariaLabels?.toolsClose ?? undefined}
                    iconName={isMobile ? 'close' : 'angle-right'}
                    onClick={() => handleToolsClick(false)}
                    variant="icon"
                    formAction="none"
                    className={testutilStyles['tools-close']}
                    ref={toolsRefs.close}
                  />
                </div>

                {tools}
              </div>
            </aside>
          )}
        </div>
      )}
    </Transition>
  );
}
