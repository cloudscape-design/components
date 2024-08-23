// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { useMobile } from '../../../internal/hooks/use-mobile';
import { splitItems } from '../../drawer/drawers-helpers';
import OverflowMenu from '../../drawer/overflow-menu';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../../interfaces';
import { TOOLS_DRAWER_ID } from '../../utils/use-drawers';
import { Focusable } from '../../utils/use-focus-control';
import TriggerButton from './trigger-button';

import splitPanelTestUtilStyles from '../../../split-panel/test-classes/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

export interface SplitPanelToggleProps {
  displayed: boolean;
  ariaLabel: string | undefined;
  controlId: string | undefined;
  active: boolean;
  position: AppLayoutProps.SplitPanelPosition;
}

interface DrawerTriggersProps {
  ariaLabels: AppLayoutPropsWithDefaults['ariaLabels'];
  activeDrawerId: string | null;
  activeDrawerCloseRef: React.RefObject<Focusable> | undefined;
  activeDrawerSliderRef: React.RefObject<Focusable> | undefined;
  drawerToggleRef: React.RefObject<Focusable> | undefined;
  drawers: ReadonlyArray<AppLayoutProps.Drawer>;
  onActiveDrawerChange: ((drawerId: string | null) => void) | undefined;
  splitPanelToggleProps: SplitPanelToggleProps | undefined;
  splitPanelFocusRef: React.Ref<Focusable> | undefined;
  onSplitPanelToggle: (() => void) | undefined;
}

export function DrawerTriggers({
  ariaLabels,
  activeDrawerId,
  activeDrawerCloseRef,
  activeDrawerSliderRef,
  drawers,
  drawerToggleRef,
  onActiveDrawerChange,
  splitPanelFocusRef,
  splitPanelToggleProps,
  onSplitPanelToggle,
}: DrawerTriggersProps) {
  const isMobile = useMobile();
  const hasMultipleTriggers = drawers.length > 1;
  const previousActiveDrawerId = useRef(activeDrawerId);
  const [containerWidth, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxWidth);

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
      if (splitPanelToggleProps) {
        splitPanelItem = 1;
      }
      return index - splitPanelItem;
    }
    return 0;
  };

  const { visibleItems, overflowItems } = splitItems(drawers, getIndexOfOverflowItem(), activeDrawerId ?? null);
  const overflowMenuHasBadge = !!overflowItems.find(item => item.badge);
  const toolsOnlyMode = drawers.length === 1 && drawers[0].id === TOOLS_DRAWER_ID;

  useEffect(() => {
    const activeDrawer = drawers.filter(item => item?.id === activeDrawerId)[0];
    console.log(activeDrawer);

    const focusDrawerToggle = () => {
      console.log('FDTogle fired', {
        activeDrawerId,
        previousActiveDrawerId,
        drawerToggleRef,
        activeDrawerSliderRef,
        activeDrawerCloseRef,
      });
      if (activeDrawerId !== null) {
        if (activeDrawer?.resizable && activeDrawerSliderRef?.current) {
          console.log(`should be focusing on resize slider ${activeDrawer.id}`);
          activeDrawerSliderRef.current.focus();
        } else if (activeDrawerCloseRef?.current) {
          console.log(`should be focusing on close ${activeDrawer.id}`);
          activeDrawerCloseRef.current.focus();
        }
      } else if (previousActiveDrawerId?.current && drawerToggleRef?.current) {
        //larger sized drawers will not have a toggle ref until drawer is fully closed
        drawerToggleRef.current.focus();
      }
    };

    focusDrawerToggle();
  }, [drawers, activeDrawerId, activeDrawerSliderRef, activeDrawerCloseRef, previousActiveDrawerId, drawerToggleRef]);

  if (!drawers && !splitPanelToggleProps) {
    return null;
  }

  return (
    <aside
      className={styles['drawers-desktop-triggers-container']}
      aria-label={ariaLabels?.drawers}
      ref={triggersContainerRef}
      role="region"
    >
      <div
        className={clsx(styles['drawers-trigger-content'], {
          [styles['has-multiple-triggers']]: hasMultipleTriggers,
          [styles['has-open-drawer']]: activeDrawerId,
        })}
        role="toolbar"
        aria-orientation="horizontal"
      >
        {splitPanelToggleProps && (
          <TriggerButton
            ariaLabel={splitPanelToggleProps.ariaLabel}
            ariaControls={splitPanelToggleProps.controlId}
            ariaExpanded={splitPanelToggleProps.active}
            className={clsx(styles['drawers-trigger'], splitPanelTestUtilStyles['open-button'])}
            iconName={splitPanelToggleProps.position === 'side' ? 'view-vertical' : 'view-horizontal'}
            onClick={() => onSplitPanelToggle?.()}
            selected={splitPanelToggleProps.active}
            ref={splitPanelFocusRef}
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
                !toolsOnlyMode && testutilStyles['drawers-trigger'],
                item.id === TOOLS_DRAWER_ID && testutilStyles['tools-toggle']
              )}
              iconName={item.trigger.iconName}
              iconSvg={item.trigger.iconSvg}
              key={item.id}
              onClick={event => {
                console.log({ ...event });
                onActiveDrawerChange?.(activeDrawerId !== item.id ? item.id : null);
              }}
              ref={item.id === previousActiveDrawerId?.current ? drawerToggleRef : undefined}
              selected={item.id === activeDrawerId}
              badge={item.badge}
              testId={`awsui-app-layout-trigger-${item.id}`}
            />
          );
        })}
        {overflowItems.length > 0 && (
          <OverflowMenu
            items={overflowItems}
            ariaLabel={overflowMenuHasBadge ? ariaLabels?.drawersOverflowWithBadge : ariaLabels?.drawersOverflow}
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
            onItemClick={event => onActiveDrawerChange?.(event.detail.id)}
          />
        )}
      </div>
    </aside>
  );
}
