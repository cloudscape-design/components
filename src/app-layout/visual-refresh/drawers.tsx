// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import customCssProps from '../../internal/generated/custom-css-properties';
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
  const { drawers, hasDrawerViewportOverlay, hasOpenDrawer, isNavigationOpen, navigationHide } =
    useAppLayoutInternals();

  if (!drawers) {
    return null;
  }

  const isUnfocusable = hasDrawerViewportOverlay && isNavigationOpen && !navigationHide;

  return (
    <div
      className={clsx(styles['drawers-container'], {
        [styles['has-open-drawer']]: hasOpenDrawer,
        [styles.unfocusable]: isUnfocusable,
      })}
    >
      <SplitPanel.Side />
      <ActiveDrawer />
      <DesktopTriggers />
    </div>
  );
}

/**
 *
 */
function ActiveDrawer() {
  const {
    activeDrawerId,
    activeDrawerWidth,
    ariaLabels,
    drawers,
    handleDrawersClick,
    handleToolsClick,
    isMobile,
    isToolsOpen,
    tools,
    toolsRefs,
  } = useAppLayoutInternals();

  const activeDrawer = drawers?.items.find((item: any) => item.id === activeDrawerId) ?? null;

  return (
    <aside
      aria-hidden={!activeDrawerId && !isToolsOpen ? true : false}
      aria-label={isToolsOpen ? ariaLabels?.tools : undefined}
      className={clsx(styles.drawer, {
        [styles['is-drawer-open']]: activeDrawerId || isToolsOpen,
        [testutilStyles.tools]: isToolsOpen,
      })}
      style={{
        ...(!isMobile && activeDrawerWidth && { [customCssProps.activeDrawerWidth]: `${activeDrawerWidth}px` }),
      }}
    >
      <div className={clsx(styles['drawer-close-button'])}>
        <InternalButton
          ariaLabel={isToolsOpen ? ariaLabels?.toolsClose : undefined}
          className={isToolsOpen ? testutilStyles['tools-close'] : undefined}
          formAction="none"
          iconName={isMobile ? 'close' : 'angle-right'}
          onClick={() => (activeDrawerId ? handleDrawersClick(activeDrawerId ?? null) : handleToolsClick(false))}
          ref={isToolsOpen ? toolsRefs.close : undefined}
          variant="icon"
        />
      </div>

      <div className={styles['drawer-content']}>
        {activeDrawerId && activeDrawer?.content}
        {isToolsOpen && tools}
      </div>
    </aside>
  );
}

/**
 *
 */
function DesktopTriggers() {
  const {
    activeDrawerId,
    ariaLabels,
    drawers,
    drawersTriggerCount,
    handleDrawersClick,
    handleSplitPanelClick,
    handleToolsClick,
    hasOpenDrawer,
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

  if (isMobile) {
    return null;
  }

  const hasMultipleTriggers = drawersTriggerCount > 1;
  const hasSplitPanel = splitPanel && splitPanelDisplayed && splitPanelPosition === 'side' ? true : false;

  return (
    <aside
      className={clsx(styles['drawers-trigger-container'], {
        [styles['has-multiple-triggers']]: hasMultipleTriggers,
        [styles['has-open-drawer']]: hasOpenDrawer,
      })}
    >
      <div
        className={clsx(styles['drawers-trigger-content'], {
          [styles['has-multiple-triggers']]: hasMultipleTriggers,
          [styles['has-open-drawer']]: hasOpenDrawer,
        })}
      >
        {!toolsHide && tools && (
          <TriggerButton
            ariaLabel={ariaLabels?.toolsToggle}
            className={clsx(styles['drawers-trigger'], testutilStyles['tools-toggle'])}
            iconName="status-info"
            onClick={() => {
              activeDrawerId && handleDrawersClick(null);
              handleToolsClick(!isToolsOpen);
            }}
            ref={toolsRefs.toggle}
            selected={isToolsOpen}
          />
        )}

        {drawers.items.map((item: DrawersProps.Drawer) => (
          <TriggerButton
            ariaLabel={item.trigger.ariaLabel}
            className={clsx(styles['drawers-trigger'])}
            iconName={item.trigger.iconName}
            iconSvg={item.trigger.iconSvg}
            key={item.id}
            onClick={() => {
              isToolsOpen && handleToolsClick(!isToolsOpen);
              handleDrawersClick(item.id);
            }}
            selected={item.id === activeDrawerId}
          />
        ))}

        {hasSplitPanel && splitPanelToggle.displayed && (
          <TriggerButton
            ariaLabel={splitPanelToggle.ariaLabel}
            className={clsx(styles['drawers-trigger'], splitPanelStyles['open-button'])}
            iconName="view-vertical"
            onClick={() => handleSplitPanelClick()}
            selected={hasSplitPanel && isSplitPanelOpen}
            ref={splitPanelRefs.toggle}
          />
        )}
      </div>
    </aside>
  );
}

/**
 *
 */
export function MobileTriggers() {
  const {
    activeDrawerId,
    ariaLabels,
    drawers,
    handleDrawersClick,
    handleToolsClick,
    hasDrawerViewportOverlay,
    isMobile,
    isToolsOpen,
    tools,
    toolsHide,
    toolsRefs,
  } = useAppLayoutInternals();

  if (!isMobile || !drawers) {
    return null;
  }

  return (
    <>
      {!toolsHide && tools && (
        <InternalButton
          ariaLabel={ariaLabels?.toolsToggle ?? undefined}
          ariaExpanded={isToolsOpen}
          className={testutilStyles['tools-toggle']}
          disabled={hasDrawerViewportOverlay}
          formAction="none"
          iconName="status-info"
          onClick={() => handleToolsClick(true)}
          ref={toolsRefs.toggle}
          variant="icon"
          __nativeAttributes={{ 'aria-haspopup': true }}
        />
      )}

      {drawers.items.map((item: any) => (
        <InternalButton
          ariaExpanded={item.id === activeDrawerId}
          ariaLabel={item.trigger.ariaLabel}
          disabled={hasDrawerViewportOverlay}
          formAction="none"
          iconName={item.trigger.iconName}
          iconSvg={item.trigger.iconSvg}
          key={item.id}
          onClick={() => handleDrawersClick(item.id)}
          variant="icon"
          __nativeAttributes={{ 'aria-haspopup': true }}
        />
      ))}
    </>
  );
}
