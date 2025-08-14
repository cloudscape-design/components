// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { useMobile } from '../../../internal/hooks/use-mobile';
import { splitItems } from '../../drawer/drawers-helpers';
import OverflowMenu from '../../drawer/overflow-menu';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../../interfaces';
import { OnChangeParams, TOOLS_DRAWER_ID } from '../../utils/use-drawers';
import { Focusable, FocusControlMultipleStates } from '../../utils/use-focus-control';
import TriggerButton from './trigger-button';

import splitPanelTestUtilStyles from '../../../split-panel/test-classes/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

export interface SplitPanelToggleProps {
  displayed: boolean | undefined;
  ariaLabel: string | undefined;
  controlId: string | undefined;
  active: boolean | undefined;
  position: AppLayoutProps.SplitPanelPosition;
}

interface DrawerTriggersProps {
  ariaLabels: AppLayoutPropsWithDefaults['ariaLabels'];

  activeDrawerId: string | null;
  drawersFocusRef: React.Ref<Focusable> | undefined;
  drawers: ReadonlyArray<AppLayoutProps.Drawer>;
  onActiveDrawerChange: ((drawerId: string | null, params: OnChangeParams) => void) | undefined;

  activeGlobalDrawersIds: ReadonlyArray<string>;
  globalDrawersFocusControl?: FocusControlMultipleStates;
  globalDrawers: ReadonlyArray<AppLayoutProps.Drawer>;
  onActiveGlobalDrawersChange?: (newDrawerId: string, params: OnChangeParams) => void;
  expandedDrawerId?: string | null;
  setExpandedDrawerId: (value: string | null) => void;

  splitPanelOpen?: boolean;
  splitPanelPosition?: AppLayoutProps.SplitPanelPreferences['position'];
  splitPanelToggleProps: SplitPanelToggleProps | undefined;
  splitPanelFocusRef: React.Ref<Focusable> | undefined;
  onSplitPanelToggle: (() => void) | undefined;
  disabled: boolean;
}

export function DrawerTriggers({
  ariaLabels,
  activeDrawerId,
  drawers,
  drawersFocusRef,
  onActiveDrawerChange,
  splitPanelOpen,
  splitPanelPosition = 'bottom',
  splitPanelFocusRef,
  splitPanelToggleProps,
  onSplitPanelToggle,
  disabled,
  activeGlobalDrawersIds,
  globalDrawers,
  globalDrawersFocusControl,
  onActiveGlobalDrawersChange,
  expandedDrawerId,
  setExpandedDrawerId,
}: DrawerTriggersProps) {
  const isMobile = useMobile();
  const hasMultipleTriggers = drawers.length > 1;
  const previousActiveLocalDrawerId = useRef(activeDrawerId);
  const previousActiveGlobalDrawersIds = useRef(activeGlobalDrawersIds);
  const [containerWidth, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxWidth);
  if (!drawers.length && !globalDrawers.length && !splitPanelToggleProps) {
    return null;
  }

  if (activeDrawerId) {
    previousActiveLocalDrawerId.current = activeDrawerId;
  }

  if (activeGlobalDrawersIds.length) {
    previousActiveGlobalDrawersIds.current = activeGlobalDrawersIds;
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

  const indexOfOverflowItem = getIndexOfOverflowItem();

  const { visibleItems, overflowItems } = splitItems(
    [...drawers, ...globalDrawers],
    indexOfOverflowItem,
    activeDrawerId ?? null
  );
  const overflowMenuHasBadge = !!overflowItems.find(item => item.badge);
  const toolsOnlyMode = drawers.length === 1 && drawers[0].id === TOOLS_DRAWER_ID;
  const globalDrawersStartIndex = drawers.length;
  const hasOpenDrawer = !!activeDrawerId || (splitPanelPosition === 'side' && splitPanelOpen);
  const splitPanelResolvedPosition = splitPanelToggleProps?.position;

  const exitExpandedMode = () => {
    if (setExpandedDrawerId) {
      setExpandedDrawerId(null);
    }
  };

  return (
    <aside
      className={styles[`drawers-${isMobile ? 'mobile' : 'desktop'}-triggers-container`]}
      aria-label={ariaLabels?.drawers}
      ref={triggersContainerRef}
      role="region"
    >
      <div
        className={styles['drawers-trigger-content']}
        aria-label={ariaLabels?.drawers}
        role="toolbar"
        aria-orientation="horizontal"
      >
        {splitPanelToggleProps && (
          <>
            <TriggerButton
              ariaLabel={splitPanelToggleProps.ariaLabel}
              ariaControls={splitPanelToggleProps.controlId}
              ariaExpanded={!expandedDrawerId && splitPanelToggleProps.active}
              className={clsx(
                styles['drawers-trigger'],
                testutilStyles['drawers-trigger'],
                splitPanelTestUtilStyles['open-button']
              )}
              iconName={splitPanelResolvedPosition === 'side' ? 'view-vertical' : 'view-horizontal'}
              onClick={() => {
                exitExpandedMode();
                if (!!expandedDrawerId && splitPanelToggleProps.active) {
                  return;
                }
                onSplitPanelToggle?.();
              }}
              selected={!expandedDrawerId && splitPanelToggleProps.active}
              ref={splitPanelResolvedPosition === 'side' ? splitPanelFocusRef : undefined}
              hasTooltip={true}
              isMobile={isMobile}
              isForSplitPanel={true}
              disabled={disabled}
            />
            {hasMultipleTriggers ? <div className={styles['group-divider']}></div> : null}
          </>
        )}
        {visibleItems.slice(0, globalDrawersStartIndex).map(item => {
          const isForPreviousActiveDrawer = previousActiveLocalDrawerId?.current === item.id;
          const selected = !expandedDrawerId && item.id === activeDrawerId;
          return (
            <TriggerButton
              ariaLabel={item.ariaLabels?.triggerButton}
              ariaExpanded={selected}
              ariaControls={activeDrawerId === item.id ? item.id : undefined}
              className={clsx(
                styles['drawers-trigger'],
                !toolsOnlyMode && testutilStyles['drawers-trigger'],
                item.id === TOOLS_DRAWER_ID && testutilStyles['tools-toggle']
              )}
              iconName={item.trigger!.iconName}
              iconSvg={item.trigger!.iconSvg}
              key={item.id}
              onClick={() => {
                exitExpandedMode();
                if (!!expandedDrawerId && activeDrawerId === item.id) {
                  return;
                }
                onActiveDrawerChange?.(activeDrawerId !== item.id ? item.id : null, { initiatedByUserAction: true });
              }}
              ref={item.id === previousActiveLocalDrawerId.current ? drawersFocusRef : undefined}
              selected={selected}
              badge={item.badge}
              testId={`awsui-app-layout-trigger-${item.id}`}
              hasTooltip={true}
              hasOpenDrawer={hasOpenDrawer}
              tooltipText={item.ariaLabels?.drawerName}
              isForPreviousActiveDrawer={isForPreviousActiveDrawer}
              isMobile={isMobile}
              disabled={disabled}
            />
          );
        })}
        {globalDrawersStartIndex > 0 && visibleItems.length > globalDrawersStartIndex && (
          <div className={styles['group-divider']}></div>
        )}
        {visibleItems.slice(globalDrawersStartIndex).map(item => {
          const isForPreviousActiveDrawer = previousActiveGlobalDrawersIds?.current.includes(item.id);
          const selected =
            activeGlobalDrawersIds.includes(item.id) && (!expandedDrawerId || item.id === expandedDrawerId);
          return (
            <TriggerButton
              ariaLabel={item.ariaLabels?.triggerButton}
              ariaExpanded={selected}
              ariaControls={selected ? item.id : undefined}
              className={clsx(
                styles['drawers-trigger'],
                testutilStyles['drawers-trigger'],
                testutilStyles['drawers-trigger-global']
              )}
              iconName={item.trigger!.iconName}
              iconSvg={item.trigger!.iconSvg}
              key={item.id}
              onClick={() => {
                exitExpandedMode();
                if (!!expandedDrawerId && item.id !== expandedDrawerId && activeGlobalDrawersIds.includes(item.id)) {
                  return;
                }
                onActiveGlobalDrawersChange?.(item.id, { initiatedByUserAction: true });
              }}
              ref={globalDrawersFocusControl?.refs[item.id]?.toggle}
              selected={selected}
              badge={item.badge}
              testId={`awsui-app-layout-trigger-${item.id}`}
              hasTooltip={true}
              hasOpenDrawer={hasOpenDrawer}
              tooltipText={item.ariaLabels?.drawerName}
              isForPreviousActiveDrawer={isForPreviousActiveDrawer}
              isMobile={isMobile}
              disabled={disabled}
            />
          );
        })}
        {overflowItems.length > 0 && (
          <OverflowMenu
            items={overflowItems.map(item => ({
              ...item,
              active: activeGlobalDrawersIds.includes(item.id) && (!expandedDrawerId || item.id === expandedDrawerId),
            }))}
            ariaLabel={overflowMenuHasBadge ? ariaLabels?.drawersOverflowWithBadge : ariaLabels?.drawersOverflow}
            customTriggerBuilder={({ onClick, triggerRef, ariaLabel, ariaExpanded, testUtilsClass }) => {
              return (
                <TriggerButton
                  ref={triggerRef}
                  ariaLabel={ariaLabel}
                  ariaExpanded={ariaExpanded}
                  badge={overflowMenuHasBadge}
                  className={clsx(
                    styles['drawers-trigger'],
                    testutilStyles['drawers-trigger'],
                    testutilStyles['drawers-trigger-global'],
                    testUtilsClass
                  )}
                  iconName="ellipsis"
                  onClick={onClick}
                  disabled={disabled}
                />
              );
            }}
            onItemClick={event => {
              const id = event.detail.id;
              exitExpandedMode();
              if (globalDrawers.find(drawer => drawer.id === id)) {
                if (!!expandedDrawerId && id !== expandedDrawerId && activeGlobalDrawersIds.includes(id)) {
                  return;
                }
                onActiveGlobalDrawersChange?.(id, { initiatedByUserAction: true });
              } else {
                onActiveDrawerChange?.(event.detail.id, { initiatedByUserAction: true });
              }
            }}
            globalDrawersStartIndex={globalDrawersStartIndex - indexOfOverflowItem}
          />
        )}
      </div>
    </aside>
  );
}
