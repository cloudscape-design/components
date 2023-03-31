// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { InternalButton } from '../../button/internal';
import { NonCancelableEventHandler } from '../../internal/events';
import SplitPanel from './split-panel';
import TriggerButton, { TriggerButtonProps } from './trigger-button';
import { useAppLayoutInternals } from './context';
import splitPanelStyles from '../../split-panel/styles.css.js';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export interface DrawersProps {
  activeDrawerId?: string;
  items: ReadonlyArray<DrawersProps.Drawer>;
  onChange?: NonCancelableEventHandler<DrawersProps.ChangeDetail>;
}

export namespace DrawersProps {
  export interface Drawer {
    content: React.ReactNode;
    id: string;
    trigger: TriggerButtonProps;
  }

  export interface ChangeDetail {
    activeDrawerId: string | null;
  }
}

/**
 *
 */
export default function Drawers() {
  const { drawers } = useAppLayoutInternals();

  if (!drawers) {
    return null;
  }

  return (
    <div className={styles['drawers-container']}>
      <SplitPanel.Side />
      <ActiveDrawer />
      <Tools />
      <Triggers />
    </div>
  );
}

/**
 *
 */
function ActiveDrawer() {
  const { activeDrawer, handleDrawersClick, isMobile } = useAppLayoutInternals();

  if (!activeDrawer) {
    return null;
  }

  return (
    <aside className={clsx(styles.drawer)}>
      <div className={clsx(styles['drawer-close-button'])}>
        <InternalButton
          formAction="none"
          iconName={isMobile ? 'close' : 'angle-right'}
          onClick={() => handleDrawersClick(activeDrawer.id)}
          variant="icon"
        />
      </div>

      {activeDrawer.content}
    </aside>
  );
}

/**
 *
 */
function Tools() {
  const { ariaLabels, handleToolsClick, isMobile, isToolsOpen, tools, toolsHide, toolsRefs } = useAppLayoutInternals();

  if (!tools || toolsHide || !isToolsOpen) {
    return null;
  }

  return (
    <aside
      aria-hidden={!isToolsOpen ? true : false}
      aria-label={ariaLabels?.tools ?? undefined}
      className={clsx(styles.drawer, testutilStyles.tools)}
    >
      <div className={clsx(styles['animated-content'])}>
        <div className={clsx(styles['hide-tools'])}>
          <InternalButton
            ariaLabel={ariaLabels?.toolsClose ?? undefined}
            className={testutilStyles['tools-close']}
            formAction="none"
            iconName={isMobile ? 'close' : 'angle-right'}
            onClick={() => handleToolsClick(false)}
            ref={toolsRefs.close}
            variant="icon"
          />
        </div>

        {tools}
      </div>
    </aside>
  );
}

/**
 *
 */
function Triggers() {
  const {
    activeDrawer,
    ariaLabels,
    drawers,
    handleDrawersClick,
    handleSplitPanelClick,
    handleToolsClick,
    isMobile,
    isSplitPanelOpen,
    isToolsOpen,
    splitPanel,
    splitPanelDisplayed,
    splitPanelPosition,
    splitPanelRefs,
    splitPanelToggle,
    tools,
    toolsHide,
    toolsRefs,
  } = useAppLayoutInternals();

  const hasSplitPanel = splitPanel && splitPanelDisplayed && splitPanelPosition === 'side' ? true : false;
  const hasOpenDrawer = activeDrawer || isToolsOpen || (hasSplitPanel && isSplitPanelOpen);
  const triggerCount = drawers.items.length + (hasSplitPanel ? 1 : 0) + (!toolsHide ? 1 : 0);

  if (isMobile || (hasOpenDrawer && triggerCount <= 1)) {
    return null;
  }

  return (
    <aside
      className={clsx(styles['drawers-triggers'], {
        [styles['has-open-drawer']]: hasOpenDrawer,
      })}
    >
      {!toolsHide && tools && (
        <TriggerButton
          ariaLabel={ariaLabels?.toolsToggle}
          className={testutilStyles['tools-toggle']}
          iconName="status-info"
          onClick={() => {
            activeDrawer && handleDrawersClick(null);
            handleToolsClick(!isToolsOpen);
          }}
          ref={toolsRefs.toggle}
          selected={isToolsOpen}
        />
      )}

      {drawers.items.map((item: any) => (
        <TriggerButton
          ariaLabel={item.trigger.ariaLabel}
          iconName={item.trigger.iconName}
          iconSvg={item.trigger.iconSvg}
          key={item.id}
          onClick={() => {
            isToolsOpen && handleToolsClick(!isToolsOpen);
            handleDrawersClick(item.id);
          }}
          selected={item === activeDrawer}
        />
      ))}

      {hasSplitPanel && splitPanelToggle.displayed && (
        <TriggerButton
          ariaLabel={splitPanelToggle.ariaLabel}
          className={splitPanelStyles['open-button']}
          iconName="view-vertical"
          onClick={() => handleSplitPanelClick()}
          selected={hasSplitPanel && isSplitPanelOpen}
          ref={splitPanelRefs.toggle}
        />
      )}
    </aside>
  );
}
