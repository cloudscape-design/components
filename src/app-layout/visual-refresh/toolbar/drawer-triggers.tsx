// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { useAppLayoutInternals } from '../context';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { splitItems } from '../../drawer/drawers-helpers';
import clsx from 'clsx';
import styles from './styles.css.js';
import { TOOLS_DRAWER_ID } from '../../utils/use-drawers';
import OverflowMenu from '../../drawer/overflow-menu';
import TriggerButton from './trigger-button';
import testutilStyles from '../../test-classes/styles.css.js';
import splitPanelTestUtilStyles from '../../split-panel/test-classes/styles.css.js';

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
    splitPanelControlId,
    splitPanelDisplayed,
    splitPanelPosition,
    splitPanelRefs,
    splitPanelToggle,
    headerVariant,
  } = useAppLayoutInternals();

  const hasMultipleTriggers = drawersTriggerCount > 1;
  const splitPanelIcon = splitPanelPosition === 'side' ? 'view-vertical' : 'view-horizontal';

  const previousActiveDrawerId = useRef(activeDrawerId);
  const [containerWidth, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxWidth);
  if (!drawers && !splitPanelDisplayed) {
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
      if (splitPanelDisplayed) {
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
        {splitPanelDisplayed && (
          <TriggerButton
            ariaLabel={splitPanelToggle.ariaLabel}
            ariaControls={splitPanelControlId}
            ariaExpanded={!!isSplitPanelOpen}
            className={clsx(styles['drawers-trigger'], splitPanelTestUtilStyles['open-button'])}
            iconName={splitPanelIcon}
            onClick={() => handleSplitPanelClick()}
            selected={isSplitPanelOpen}
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
              highContrastHeader={headerVariant === 'high-contrast'}
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
                highContrastHeader={headerVariant === 'high-contrast'}
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
