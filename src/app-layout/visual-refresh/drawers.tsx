// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import customCssProps from '../../internal/generated/custom-css-properties';
import { InternalButton } from '../../button/internal';
import TriggerButton from './trigger-button';
import { useAppLayoutInternals } from './context';
import splitPanelStyles from '../../split-panel/styles.css.js';
import styles from './styles.css.js';
import sharedStyles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import OverflowMenu from '../drawer/overflow-menu';
import { splitItems } from '../drawer/drawers-helpers';
import { TOOLS_DRAWER_ID } from '../utils/use-drawers';
import { getLimitedValue } from '../../split-panel/utils/size-utils';

/**
 * The Drawers root component is mounted in the AppLayout index file. It will only
 * render if the drawers are defined, and it will take over the mounting of and
 * rendering of the Tools and SplitPanel (side position) if they exist. If drawers
 * do not exist then the Tools and SplitPanel will be handled by the Tools component.
 */
export default function Drawers() {
  const {
    disableBodyScroll,
    drawers,
    drawersTriggerCount,
    hasDrawerViewportOverlay,
    hasOpenDrawer,
    navigationOpen,
    navigationHide,
  } = useAppLayoutInternals();

  const isUnfocusable = hasDrawerViewportOverlay && navigationOpen && !navigationHide;

  if (!drawers || drawersTriggerCount === 0) {
    return null;
  }

  return (
    <div
      className={clsx(styles['drawers-container'], {
        [styles['disable-body-scroll']]: disableBodyScroll,
        [styles['has-open-drawer']]: hasOpenDrawer,
        [styles.unfocusable]: isUnfocusable,
      })}
    >
      <ActiveDrawer />
    </div>
  );
}

function ActiveDrawer() {
  const {
    activeDrawerId,
    ariaLabels,
    drawers,
    drawersRefs,
    handleDrawersClick,
    handleToolsClick,
    hasDrawerViewportOverlay,
    isMobile,
    navigationOpen,
    navigationHide,
    loseDrawersFocus,
    resizeHandle,
    drawerSize,
    drawersMinWidth,
    drawersMaxWidth,
    drawerRef,
  } = useAppLayoutInternals();

  const activeDrawer = drawers?.find(item => item.id === activeDrawerId) ?? null;

  const computedAriaLabels = {
    closeButton: activeDrawerId ? activeDrawer?.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeDrawerId ? activeDrawer?.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const isHidden = !activeDrawerId;
  const isUnfocusable = isHidden || (hasDrawerViewportOverlay && navigationOpen && !navigationHide);
  const isToolsDrawer = activeDrawerId === TOOLS_DRAWER_ID;
  const toolsContent = drawers?.find(drawer => drawer.id === TOOLS_DRAWER_ID)?.content;

  const size = getLimitedValue(drawersMinWidth, drawerSize, drawersMaxWidth);

  return (
    <aside
      id={activeDrawerId ?? undefined}
      aria-hidden={isHidden}
      aria-label={computedAriaLabels.content}
      className={clsx(styles.drawer, sharedStyles['with-motion'], {
        [styles['is-drawer-open']]: activeDrawerId,
        [styles.unfocusable]: isUnfocusable,
        [testutilStyles['active-drawer']]: activeDrawerId,
        [testutilStyles.tools]: isToolsDrawer,
      })}
      style={{
        ...(!isMobile && drawerSize && { [customCssProps.drawerSize]: `${size}px` }),
      }}
      ref={drawerRef}
      onBlur={e => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
          loseDrawersFocus();
        }
      }}
    >
      {!isMobile && activeDrawer?.resizable && resizeHandle}
      <div className={styles['drawer-content-container']}>
        <div className={clsx(styles['drawer-close-button'])}>
          <InternalButton
            ariaLabel={computedAriaLabels.closeButton}
            className={clsx({
              [testutilStyles['active-drawer-close-button']]: activeDrawerId,
              [testutilStyles['tools-close']]: isToolsDrawer,
            })}
            formAction="none"
            iconName={isMobile ? 'close' : 'angle-right'}
            onClick={() => {
              handleDrawersClick(activeDrawerId);
              handleToolsClick(false);
            }}
            ref={drawersRefs.close}
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
        {activeDrawerId !== TOOLS_DRAWER_ID && (
          <div className={styles['drawer-content']}>{activeDrawerId && activeDrawer?.content}</div>
        )}
      </div>
    </aside>
  );
}

/**
 * The DesktopTriggers will render the trigger buttons for Tools, Drawers, and the
 * SplitPanel in non mobile viewports. Changes to the activeDrawerId need to be
 * tracked by the previousActiveDrawerId property in order to appropriately apply
 * the ref required to manage focus control.
 */
export function DrawerTriggers() {
  const {
    activeDrawerId,
    drawers,
    drawersAriaLabel,
    drawersOverflowAriaLabel,
    drawersOverflowWithBadgeAriaLabel,
    drawersRefs,
    drawersTriggerCount,
    handleDrawersClick,
    handleSplitPanelClick,
    hasDrawerViewportOverlay,
    hasOpenDrawer,
    isMobile,
    isSplitPanelOpen,
    splitPanel,
    splitPanelControlId,
    splitPanelDisplayed,
    splitPanelPosition,
    splitPanelRefs,
    splitPanelToggle,
  } = useAppLayoutInternals();

  const hasMultipleTriggers = drawersTriggerCount > 1;
  const hasSplitPanel = splitPanel && splitPanelDisplayed;
  const splitPanelIcon = splitPanelPosition === 'side' ? 'view-vertical' : 'view-horizontal';

  const previousActiveDrawerId = useRef(activeDrawerId);
  const [containerWidth, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxWidth);
  if (!drawers && !hasSplitPanel) {
    return null;
  }

  if (activeDrawerId) {
    previousActiveDrawerId.current = activeDrawerId;
  }

  const getIndexOfOverflowItem = () => {
    if (isMobile) {
      return 2;
    }
    if (containerWidth) {
      const ITEM_WIDTH = 50; // Roughly 34px + padding = 42px but added extra for safety
      const overflowSpot = containerWidth;

      const index = Math.floor(overflowSpot / ITEM_WIDTH);

      let splitPanelItem = 0;
      if (hasSplitPanel && splitPanelToggle.displayed) {
        splitPanelItem = 1;
      }
      return index - splitPanelItem;
    }
    return 0;
  };

  const { visibleItems, overflowItems } = splitItems(drawers ?? undefined, getIndexOfOverflowItem(), activeDrawerId);
  const overflowMenuHasBadge = !!overflowItems.find(item => item.badge);

  return (
    <aside
      className={clsx(styles['drawers-desktop-triggers-container'], {
        [styles['has-multiple-triggers']]: hasMultipleTriggers,
        [styles['has-open-drawer']]: hasOpenDrawer,
        [styles.unfocusable]: hasDrawerViewportOverlay,
      })}
      aria-label={drawersAriaLabel}
      aria-hidden={hasDrawerViewportOverlay}
      ref={triggersContainerRef}
      role="region"
    >
      <div
        className={clsx(styles['drawers-trigger-content'], {
          [styles['has-multiple-triggers']]: hasMultipleTriggers,
          [styles['has-open-drawer']]: hasOpenDrawer,
        })}
        role="toolbar"
        aria-orientation="horizontal"
      >
        {hasSplitPanel && splitPanelToggle.displayed && (
          <TriggerButton
            ariaLabel={splitPanelToggle.ariaLabel}
            ariaControls={splitPanelControlId}
            ariaExpanded={!!isSplitPanelOpen}
            className={clsx(styles['drawers-trigger'], splitPanelStyles['open-button'])}
            iconName={splitPanelIcon}
            onClick={() => handleSplitPanelClick()}
            selected={hasSplitPanel && isSplitPanelOpen}
            ref={splitPanelRefs.toggle}
          />
        )}
        {visibleItems.map(item => {
          return (
            <TriggerButton
              ariaLabel={item.ariaLabels?.triggerButton}
              ariaExpanded={item.id === activeDrawerId}
              ariaControls={activeDrawerId === item.id ? item.id : undefined}
              className={clsx(
                styles['drawers-trigger'],
                testutilStyles['drawers-trigger'],
                item.id === TOOLS_DRAWER_ID && testutilStyles['tools-toggle']
              )}
              disabled={hasDrawerViewportOverlay}
              iconName={item.trigger.iconName}
              iconSvg={item.trigger.iconSvg}
              key={item.id}
              onClick={() => handleDrawersClick(item.id)}
              ref={item.id === previousActiveDrawerId.current ? drawersRefs.toggle : undefined}
              selected={item.id === activeDrawerId}
              badge={item.badge}
              testId={`awsui-app-layout-trigger-${item.id}`}
            />
          );
        })}
        {overflowItems.length > 0 && (
          <OverflowMenu
            items={overflowItems}
            ariaLabel={overflowMenuHasBadge ? drawersOverflowWithBadgeAriaLabel : drawersOverflowAriaLabel}
            customTriggerBuilder={({ onClick, triggerRef, ariaLabel, ariaExpanded, testUtilsClass }) => (
              <TriggerButton
                ref={triggerRef}
                ariaLabel={ariaLabel}
                ariaExpanded={ariaExpanded}
                badge={overflowMenuHasBadge}
                className={clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'], testUtilsClass)}
                iconName="ellipsis"
                onClick={onClick}
              />
            )}
            onItemClick={({ detail }) => {
              handleDrawersClick(detail.id);
            }}
          />
        )}
      </div>
    </aside>
  );
}
