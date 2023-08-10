// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import customCssProps from '../../internal/generated/custom-css-properties';
import { InternalButton } from '../../button/internal';
import SplitPanel from './split-panel';
import TriggerButton from './trigger-button';
import { useAppLayoutInternals } from './context';
import splitPanelStyles from '../../split-panel/styles.css.js';
import styles from './styles.css.js';
import sharedStyles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import OverflowMenu from '../drawer/overflow-menu';
import { DrawerItem } from '../drawer/interfaces';
import { splitItems } from '../drawer/drawers-helpers';

/**
 * The Drawers root component is mounted in the AppLayout index file. It will only
 * render if the drawers are defined, and it will take over the mounting of and
 * rendering of the Tools and SplitPanel (side position) if they exist. If drawers
 * do not exist then the Tools and SplitPanel will be handled by the Tools component.
 */
export default function Drawers() {
  const { disableBodyScroll, drawers, hasDrawerViewportOverlay, hasOpenDrawer, isNavigationOpen, navigationHide } =
    useAppLayoutInternals();

  const isUnfocusable = hasDrawerViewportOverlay && isNavigationOpen && !navigationHide;

  if (!drawers) {
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
      <SplitPanel.Side />
      <ActiveDrawer />
      <DesktopTriggers />
    </div>
  );
}

/**
 * The ActiveDrawer component will render either the drawer content that corresponds
 * to the activeDrawerId or the Tools content if it exists and isToolsOpen is true.
 * The aria labels, click handling, and focus handling will be updated dynamically
 * based on the active drawer or tools content.
 */
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
    isNavigationOpen,
    isToolsOpen,
    navigationHide,
    tools,
    toolsRefs,
    loseDrawersFocus,
    resizeHandle,
    drawerSize,
    drawersMaxWidth,
    drawerRef,
  } = useAppLayoutInternals();

  const activeDrawer = drawers?.items.find((item: DrawerItem) => item.id === activeDrawerId) ?? null;

  const computedAriaLabels = {
    closeButton: activeDrawerId ? activeDrawer?.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeDrawerId ? activeDrawer?.ariaLabels?.content : ariaLabels?.tools,
  };

  const isHidden = !activeDrawerId && !isToolsOpen;
  const isUnfocusable = isHidden || (hasDrawerViewportOverlay && isNavigationOpen && !navigationHide);

  const size = Math.min(drawersMaxWidth, drawerSize);

  return (
    <aside
      aria-hidden={isHidden}
      aria-label={computedAriaLabels.content}
      className={clsx(styles.drawer, sharedStyles['with-motion'], {
        [styles['is-drawer-open']]: activeDrawerId || isToolsOpen,
        [styles.unfocusable]: isUnfocusable,
        [testutilStyles['active-drawer']]: activeDrawerId,
        [testutilStyles.tools]: isToolsOpen,
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
      <div className={clsx(styles['drawer-close-button'])}>
        <InternalButton
          ariaLabel={computedAriaLabels.closeButton}
          className={clsx({
            [testutilStyles['active-drawer-close-button']]: activeDrawerId,
            [testutilStyles['tools-close']]: isToolsOpen,
          })}
          formAction="none"
          iconName={isMobile ? 'close' : 'angle-right'}
          onClick={() => (activeDrawerId ? handleDrawersClick(activeDrawerId ?? null) : handleToolsClick(false))}
          ref={isToolsOpen ? toolsRefs.close : drawersRefs.close}
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
 * The DesktopTriggers will render the trigger buttons for Tools, Drawers, and the
 * SplitPanel in non mobile viewports. Changes to the activeDrawerId need to be
 * tracked by the previousActiveDrawerId property in order to appropriately apply
 * the ref required to manage focus control.
 */
function DesktopTriggers() {
  const {
    activeDrawerId,
    ariaLabels,
    drawers,
    drawersRefs,
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
    splitPanelReportedHeaderHeight,
    splitPanelReportedSize,
    tools,
    toolsHide,
    toolsRefs,
  } = useAppLayoutInternals();

  const hasMultipleTriggers = drawersTriggerCount > 1;
  const hasSplitPanel = splitPanel && splitPanelDisplayed && splitPanelPosition === 'side' ? true : false;
  const previousActiveDrawerId = useRef(activeDrawerId);

  const splitPanelHeight =
    isSplitPanelOpen && splitPanelPosition === 'bottom' ? splitPanelReportedSize : splitPanelReportedHeaderHeight;

  const [containerHeight, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxHeight);

  const getIndexOfOverflowItem = () => {
    if (containerHeight) {
      const ITEM_HEIGHT = 48;
      const overflowSpot =
        activeDrawerId && isSplitPanelOpen
          ? (containerHeight - splitPanelReportedHeaderHeight) / 1.5
          : (containerHeight - splitPanelHeight) / 1.5;

      const index = Math.floor(overflowSpot / ITEM_HEIGHT);

      let toolsItem = 0;
      let splitPanelItem = 0;
      if (!toolsHide && tools) {
        toolsItem = 1;
      }
      if (hasSplitPanel && splitPanelToggle.displayed) {
        splitPanelItem = 1;
      }
      return index - toolsItem - splitPanelItem;
    }

    return -1;
  };

  const overflowItemIsActive = () => {
    const { overflowItems } = splitItems(drawers?.items, getIndexOfOverflowItem());

    if (drawers && drawers.activeDrawerId && getIndexOfOverflowItem() > -1) {
      return overflowItems?.map(item => item.id).indexOf(drawers.activeDrawerId) !== -1;
    }
  };

  const getDrawerItems = () => {
    if (drawers && drawers.items) {
      const activeIndex = activeDrawerId
        ? drawers.items.map((item: DrawerItem) => item.id).indexOf(activeDrawerId)
        : -1;
      const lastMainItemIndex = getIndexOfOverflowItem() - 1;

      if (activeIndex && activeIndex > 0 && overflowItemIsActive()) {
        [drawers.items[lastMainItemIndex], drawers.items[activeIndex]] = [
          drawers.items[activeIndex],
          drawers.items[lastMainItemIndex],
        ];
      }
      return drawers.items;
    }
    return [];
  };

  if (activeDrawerId) {
    previousActiveDrawerId.current = activeDrawerId;
  }

  if (isMobile) {
    return null;
  }

  const { visibleItems, overflowItems } = splitItems(getDrawerItems(), getIndexOfOverflowItem());
  const overflowItemHasBadge = !!overflowItems?.find(item => item.badge);

  return (
    <aside
      className={clsx(
        styles['drawers-desktop-triggers-container'],
        testutilStyles['drawers-desktop-triggers-container'],
        {
          [styles['has-multiple-triggers']]: hasMultipleTriggers,
          [styles['has-open-drawer']]: hasOpenDrawer,
        }
      )}
      aria-label={drawers?.ariaLabel}
      ref={triggersContainerRef}
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
              activeDrawerId && handleDrawersClick(null, true);
              handleToolsClick(!isToolsOpen);
            }}
            ref={toolsRefs.toggle}
            selected={isToolsOpen}
          />
        )}

        {visibleItems?.map(item => {
          return (
            <TriggerButton
              ariaLabel={item.ariaLabels?.triggerButton}
              className={clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'])}
              iconName={item.trigger.iconName}
              iconSvg={item.trigger.iconSvg}
              key={item.id}
              onClick={() => {
                isToolsOpen && handleToolsClick(!isToolsOpen, true);
                handleDrawersClick(item.id);
              }}
              ref={item.id === previousActiveDrawerId.current ? drawersRefs.toggle : undefined}
              selected={item.id === activeDrawerId}
              badge={item.badge}
              testId={`awsui-app-layout-trigger-${item.id}`}
            />
          );
        })}

        {overflowItems && overflowItems.length > 0 && (
          <OverflowMenu
            drawersRefs={drawersRefs}
            className={clsx(
              styles['drawers-trigger'],
              styles.trigger,
              styles['drawers-trigger-overflow'],
              overflowItemHasBadge && styles.badge
            )}
            overflowItems={overflowItems}
            onItemClick={({ detail }) => {
              handleDrawersClick(detail.id);
            }}
            hasActiveStyles={true}
            ariaLabel={drawers.overflowAriaLabel}
          />
        )}
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
 * The MobileTriggers will be mounted inside of the AppBar component and
 * only rendered when Drawers are defined in mobile viewports. The same logic
 * will in the AppBar component will suppress the rendering of the legacy
 * trigger button for the Tools drawer.
 */
export function MobileTriggers() {
  const {
    activeDrawerId,
    ariaLabels,
    drawers,
    drawersRefs,
    handleDrawersClick,
    handleToolsClick,
    hasDrawerViewportOverlay,
    isMobile,
    isToolsOpen,
    tools,
    toolsHide,
    toolsRefs,
  } = useAppLayoutInternals();

  const previousActiveDrawerId = useRef(activeDrawerId);
  const hasTools = !toolsHide && tools;

  if (activeDrawerId) {
    previousActiveDrawerId.current = activeDrawerId;
  }

  if (!isMobile || !drawers) {
    return null;
  }

  const splitIndex = hasTools ? 1 : 2;

  const { visibleItems, overflowItems } = splitItems(drawers?.items, splitIndex);
  const overflowItemHasBadge = !!overflowItems?.find(item => item.badge);

  return (
    <aside
      aria-hidden={hasDrawerViewportOverlay}
      className={clsx(
        styles['drawers-mobile-triggers-container'],
        testutilStyles['drawers-mobile-triggers-container'],
        {
          [styles.unfocusable]: hasDrawerViewportOverlay,
        }
      )}
      aria-label={drawers.ariaLabel}
    >
      {hasTools && (
        <InternalButton
          ariaLabel={ariaLabels?.toolsToggle ?? undefined}
          ariaExpanded={isToolsOpen}
          className={clsx(styles['drawers-trigger'], testutilStyles['tools-toggle'])}
          disabled={hasDrawerViewportOverlay}
          formAction="none"
          iconName="status-info"
          onClick={() => handleToolsClick(true)}
          ref={toolsRefs.toggle}
          variant="icon"
          __nativeAttributes={{ 'aria-haspopup': true }}
        />
      )}

      {visibleItems?.map(item => (
        <InternalButton
          ariaExpanded={item.id === activeDrawerId}
          ariaLabel={item.ariaLabels?.triggerButton}
          className={clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'])}
          disabled={hasDrawerViewportOverlay}
          formAction="none"
          iconName={item.trigger.iconName}
          iconSvg={item.trigger.iconSvg}
          badge={item.badge}
          badgeColor="red"
          key={item.id}
          onClick={() => handleDrawersClick(item.id)}
          ref={item.id === previousActiveDrawerId.current ? drawersRefs.toggle : undefined}
          variant="icon"
          __nativeAttributes={{ 'aria-haspopup': true, 'data-testid': `awsui-app-layout-trigger-${item.id}` }}
        />
      ))}
      {overflowItems && overflowItems.length > 0 && (
        <OverflowMenu
          drawersRefs={drawersRefs}
          className={clsx(styles['drawers-trigger'], overflowItemHasBadge && styles.badge)}
          overflowItems={overflowItems}
          onItemClick={({ detail }) => {
            handleDrawersClick(detail.id);
          }}
          hasOverflowBadge={overflowItemHasBadge}
          ariaLabel={drawers.overflowAriaLabel}
        />
      )}
    </aside>
  );
}
