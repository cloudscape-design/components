// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import customCssProps from '../../internal/generated/custom-css-properties';
import { InternalButton } from '../../button/internal';
import splitPanelStyles from '../../split-panel/styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { Transition } from '../../internal/components/transition';
import TriggerButton, { TriggerButtonProps } from './trigger-button';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';

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
    handleSplitPanelClick,
    handleToolsClick,
    hasDefaultToolsWidth,
    isAnyPanelOpen,
    isNavigationOpen,
    isMobile,
    isSplitPanelOpen,
    isToolsOpen,
    navigationHide,
    splitPanelDisplayed,
    splitPanelPosition,
    splitPanelToggle,
    tools,
    toolsFocusControl,
    toolsHide,
    toolsTriggers,
    toolsWidth,
  } = useAppLayoutInternals();

  const hasSplitPanel = getSplitPanelStatus(splitPanelDisplayed, splitPanelPosition);
  const toolsTriggerCount = getToolsTriggerCount(hasSplitPanel, toolsTriggers, toolsHide);
  const hasToolsForm = getToolsFormStatus(
    hasSplitPanel,
    toolsTriggerCount,
    isMobile,
    isSplitPanelOpen,
    isToolsOpen,
    toolsHide
  );
  const hasToolsFormPersistence = getToolsFormPersistence(
    hasSplitPanel,
    toolsTriggerCount,
    isSplitPanelOpen,
    isToolsOpen
  );
  const { refs: focusRefs } = toolsFocusControl;
  const isUnfocusable = isMobile && isAnyPanelOpen && isNavigationOpen && !navigationHide;

  if (toolsHide && !hasSplitPanel) {
    return null;
  }

  return (
    <Transition in={isToolsOpen ?? false}>
      {(state, transitionEventsRef) => (
        <div
          className={clsx(styles['tools-container'], {
            [testutilStyles['drawer-closed']]: !isToolsOpen,
            [styles.unfocusable]: isUnfocusable,
          })}
          style={{
            [customCssProps.toolsAnimationStartingOpacity]: `${hasSplitPanel && isSplitPanelOpen ? 1 : 0}`,
            // Overwrite the default tools width (depends on breakpoints) only when the `toolsWidth` property has been set.
            [customCssProps.toolsWidth]: hasDefaultToolsWidth ? '' : `${toolsWidth}px`,
          }}
          onBlur={e => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              toolsFocusControl.loseFocus();
            }
          }}
        >
          {children}

          {!toolsHide && (
            <aside
              aria-hidden={!isToolsOpen ? true : false}
              aria-label={ariaLabels?.tools ?? undefined}
              className={clsx(
                styles.tools,
                {
                  [styles.animating]: state === 'entering',
                  [styles['has-tools-form-persistence']]: hasToolsFormPersistence,
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
                    ref={focusRefs.close}
                  />
                </div>

                {tools}
              </div>
            </aside>
          )}

          {!isMobile && (
            <aside
              aria-hidden={!hasToolsForm ? true : false}
              aria-label={ariaLabels?.tools ?? undefined}
              className={clsx(styles['show-tools'], {
                [styles.animating]: state === 'exiting',
                [styles['has-tools-form']]: hasToolsForm,
                [styles['has-tools-form-persistence']]: hasToolsFormPersistence,
              })}
              ref={state === 'exiting' ? transitionEventsRef : undefined}
            >
              {!toolsHide && (
                <>
                  {!toolsTriggers && (
                    <TriggerButton
                      ariaLabel={ariaLabels?.toolsToggle}
                      className={testutilStyles['tools-toggle']}
                      iconName="status-info"
                      onClick={() => handleToolsClick(!isToolsOpen)}
                      ref={focusRefs.toggle}
                      selected={hasSplitPanel && isToolsOpen}
                    />
                  )}

                  {toolsTriggers &&
                    toolsTriggers.map((trigger: TriggerButtonProps, key) => (
                      <TriggerButton
                        ariaLabel={trigger.ariaLabel}
                        iconName={trigger.iconName}
                        iconSvg={trigger.iconSvg}
                        key={key}
                        onClick={trigger.onClick}
                        selected={trigger.selected}
                      />
                    ))}
                </>
              )}

              {hasSplitPanel && splitPanelToggle.displayed && (
                <TriggerButton
                  ariaLabel={splitPanelToggle.ariaLabel}
                  iconName="view-vertical"
                  onClick={() => handleSplitPanelClick()}
                  selected={hasSplitPanel && isSplitPanelOpen}
                  className={splitPanelStyles['open-button']}
                  // TODO should this button also get focus handling? (i.e. when the split panel is toggled)
                />
              )}
            </aside>
          )}
        </div>
      )}
    </Transition>
  );
}

/**
 * Determine the default state of the Tools component. Mobile viewports should be
 * closed by default under all circumstances. If the toolsOpen prop has not been
 * set then it should be closed as well. Otherwise, default to the toolsOpen prop.
 */
export function getToolsDefaultState(isMobile: boolean, stateFromProps?: boolean) {
  let isToolsOpen;

  if (isMobile || stateFromProps === undefined) {
    isToolsOpen = false;
  } else {
    isToolsOpen = stateFromProps;
  }

  return isToolsOpen;
}

/**
 * This simple function returns the presence of the split panel as a child of the
 * Tools component. It must exist and be in side position.
 */
function getSplitPanelStatus(splitPanelDisplayed: boolean, splitPanelPosition: string) {
  return splitPanelDisplayed && splitPanelPosition === 'side' ? true : false;
}

/**
 * By default the Tools form is styled as display: none. This behavior should
 * be unchanged in mobile viewports where the Tools form is always suppressed.
 * In large viewports, however the Tools form and its corresponding buttons
 * should be present in the UI under the below circumstances.
 */
function getToolsFormStatus(
  hasSplitPanel: boolean,
  toolsTriggerCount: number,
  isMobile: boolean,
  isSplitPanelOpen?: boolean,
  isToolsOpen?: boolean,
  toolsHide?: boolean
) {
  let hasToolsForm = false;

  if (!isMobile) {
    // Both the Split Panel and Tools button are needed
    if (hasSplitPanel && !toolsHide) {
      hasToolsForm = true;
    }

    // The Split Panel button is needed
    if (hasSplitPanel && !isSplitPanelOpen && toolsHide) {
      hasToolsForm = true;
    }

    // The Tools button is needed
    if (!hasSplitPanel && !toolsHide && !isToolsOpen) {
      hasToolsForm = true;
    }

    // The Form is required any time there are 2 or more buttons
    if (toolsTriggerCount > 1) {
      hasToolsForm = true;
    }
  }

  return hasToolsForm;
}

/**
 * Under two scenarios the Tools form that contains the triggers
 * for the Tools content and the Split Panel may be persistent
 * in the UI (as opposed to disappearing when one of the drawers
 * is open). This will also add a white background as opposed to the
 * default transparent background. The buttons will present and in a
 * selected / not selected state.
 */
function getToolsFormPersistence(
  hasSplitPanel: boolean,
  toolsTriggerCount: number,
  isSplitPanelOpen?: boolean,
  isToolsOpen?: boolean
) {
  let hasToolsFormPersistence = false;

  // Both Tools and Split Panel exist and one or both is open
  if (toolsTriggerCount > 1 && ((hasSplitPanel && isSplitPanelOpen) || isToolsOpen)) {
    hasToolsFormPersistence = true;
  }

  return hasToolsFormPersistence;
}

/**
 * Compute the number of triggers that are rendered next to the Tools drawer.
 * This number will vary based on the suppression of the drawer, the use of a
 * SplitPanel in the side position, and the existence of custom trigger buttons.
 */
function getToolsTriggerCount(hasSplitPanel: boolean, toolsTriggers: Array<TriggerButtonProps>, toolsHide?: boolean) {
  let toolsTriggerCount = 0;

  if (hasSplitPanel) {
    toolsTriggerCount++;
  }

  if (!toolsHide && !toolsTriggers) {
    toolsTriggerCount++;
  }

  if (!toolsHide && toolsTriggers) {
    toolsTriggerCount += toolsTriggers.length;
  }

  return toolsTriggerCount;
}
