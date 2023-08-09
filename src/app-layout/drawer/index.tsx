// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import { ToggleButton, CloseButton, togglesConfig } from '../toggles';

import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';
import { DesktopDrawerProps, DrawerTriggersBarProps, DrawerItem, DrawerItemAriaLabels } from './interfaces';
import OverflowMenu from './overflow-menu';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useDensityMode } from '@cloudscape-design/component-toolkit/internal';
import { splitItems } from './drawers-helpers';

// We are using two landmarks per drawer, i.e. two NAVs and two ASIDEs, because of several
// known bugs in NVDA that cause focus changes within a container to sometimes not be
// announced. As a result, we use one region for the open button and one region for the
// actual drawer content, always hiding the other one when it's not visible.
// An alternative solution to follow a more classic implementation here to only have one
// button that triggers the opening/closing of the drawer also did not work due to another
// series of bugs in NVDA (together with Firefox) which prevent the changed expanded state
// from being announced.
// Even with this workaround in place, the announcement of the close button when opening a
// panel in NVDA is not working correctly. The suspected root cause is one of the bugs below
// as well.
// Relevant tickets:
// * https://github.com/nvaccess/nvda/issues/6606
// * https://github.com/nvaccess/nvda/issues/5825
// * https://github.com/nvaccess/nvda/issues/5247
// * https://github.com/nvaccess/nvda/pull/8869 (reverted PR that was going to fix it)
export const Drawer = React.forwardRef(
  (
    {
      contentClassName,
      toggleClassName,
      closeClassName,
      width,
      type,
      toggleRefs,
      topOffset,
      bottomOffset,
      ariaLabels,
      drawersAriaLabels,
      children,
      isOpen,
      isMobile,
      onToggle,
      onClick,
      onLoseFocus,
      drawers,
      resizeHandle,
    }: DesktopDrawerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const openButtonWrapperRef = useRef<HTMLElement | null>(null);
    const { TagName, iconName, getLabels } = togglesConfig[type];
    const { mainLabel, closeLabel, openLabel } = getLabels(ariaLabels);
    const drawerContentWidthOpen = isMobile ? undefined : width;
    const drawerContentWidth = isOpen ? drawerContentWidthOpen : undefined;

    const getDrawersLabels = (labels: DrawerItemAriaLabels = {}) => ({
      drawerMainLabel: labels?.content,
      drawerOpenLabel: labels?.triggerButton,
      drawerCloseLabel: labels?.closeButton,
    });
    const { drawerMainLabel, drawerCloseLabel } = getDrawersLabels(drawersAriaLabels);

    const regularOpenButton = (
      <TagName ref={openButtonWrapperRef} aria-label={mainLabel} className={styles.toggle} aria-hidden={isOpen}>
        <ToggleButton
          ref={toggleRefs.toggle}
          className={toggleClassName}
          iconName={iconName}
          ariaLabel={openLabel}
          onClick={() => onToggle(true)}
          ariaExpanded={false}
        />
      </TagName>
    );

    return (
      <div
        ref={ref}
        className={clsx(styles.drawer, {
          [styles['drawer-closed']]: !isOpen,
          [testutilStyles['drawer-closed']]: !isOpen,
          [styles['drawer-mobile']]: isMobile,
        })}
        style={{ width: drawerContentWidth }}
        onBlur={
          onLoseFocus
            ? e => {
                if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                  onLoseFocus(e);
                }
              }
            : undefined
        }
        onClick={event => {
          if (onClick) {
            onClick(event);
          }
          if (!isOpen) {
            // to prevent calling onToggle from the drawer when it's called from the toggle button
            if (
              openButtonWrapperRef.current === event.target ||
              !openButtonWrapperRef.current?.contains(event.target as Node)
            ) {
              onToggle(true);
            }
          }
        }}
      >
        <div
          style={{ width: drawerContentWidth, top: topOffset, bottom: bottomOffset }}
          className={clsx(styles['drawer-content'], styles['drawer-content-clickable'], contentClassName)}
        >
          {!isMobile && regularOpenButton}
          {resizeHandle}
          <TagName aria-label={drawers ? drawerMainLabel : mainLabel} aria-hidden={!isOpen}>
            <CloseButton
              ref={toggleRefs.close}
              className={closeClassName}
              ariaLabel={drawers ? drawerCloseLabel : closeLabel}
              onClick={() => {
                onToggle(false);
                drawers?.onChange({ activeDrawerId: undefined });
              }}
            />
            {children}
          </TagName>
        </div>
      </div>
    );
  }
);

export const DrawerTriggersBar = ({
  isMobile,
  topOffset,
  bottomOffset,
  drawers,
  contentClassName,
  toggleClassName,
}: DrawerTriggersBarProps) => {
  const [containerHeight, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxHeight);
  const isCompactMode = useDensityMode(triggersContainerRef) === 'compact';

  const getIndexOfOverflowItem = () => {
    if (containerHeight) {
      const ITEM_HEIGHT = isCompactMode ? 34 : 38;
      const overflowSpot = containerHeight / 1.5;

      const index = Math.floor(overflowSpot / ITEM_HEIGHT);

      return index;
    }
    return 0;
  };

  const overflowItemIsActive = () => {
    const { overflowItems } = splitItems(drawers?.items, getIndexOfOverflowItem());

    if (drawers && drawers.activeDrawerId) {
      return overflowItems?.map(item => item.id).indexOf(drawers.activeDrawerId) !== -1;
    }
    return false;
  };

  const getDrawerItems = () => {
    if (drawers && drawers.items) {
      const activeIndex = drawers.activeDrawerId && drawers.items.map(item => item.id).indexOf(drawers.activeDrawerId);
      const lastMainItemIndex = getIndexOfOverflowItem() - 1;

      const activeDrawerItem = drawers.items.find(item => item.id === drawers.activeDrawerId);
      const lastMainItem = drawers.items.find((item, index) => index === lastMainItemIndex);

      if (activeIndex && overflowItemIsActive() && activeDrawerItem && lastMainItem) {
        [drawers.items[lastMainItemIndex], drawers.items[activeIndex]] = [
          drawers.items[activeIndex],
          drawers.items[lastMainItemIndex],
        ];
      }

      return drawers.items;
    }
    return [];
  };

  const { visibleItems, overflowItems } = splitItems(getDrawerItems(), getIndexOfOverflowItem());
  const overflowItemHasBadge = !!overflowItems?.find(item => item.badge);

  return (
    <div
      className={clsx(styles.drawer, styles['drawer-closed'], testutilStyles['drawer-closed'], {
        [styles['drawer-mobile']]: isMobile,
      })}
    >
      <div
        ref={triggersContainerRef}
        style={{ top: topOffset, bottom: bottomOffset }}
        className={clsx(styles['drawer-content'])}
      >
        {!isMobile && (
          <aside aria-label={drawers?.ariaLabel} className={clsx(styles['drawer-triggers-wrapper'], contentClassName)}>
            <>
              {visibleItems?.map((item: DrawerItem, index: number) => {
                return (
                  <span
                    key={index}
                    className={clsx(
                      styles['drawer-trigger'],
                      drawers?.activeDrawerId === item.id && styles['drawer-trigger-active']
                    )}
                    onClick={() =>
                      drawers?.onChange({
                        activeDrawerId: item.id !== drawers.activeDrawerId ? item.id : undefined,
                      })
                    }
                  >
                    <ToggleButton
                      className={toggleClassName}
                      key={`drawer-trigger-${index}`}
                      iconName={item.trigger.iconName}
                      iconSvg={item.trigger.iconSvg}
                      ariaLabel={item.ariaLabels?.triggerButton}
                      ariaExpanded={drawers?.activeDrawerId !== undefined}
                      badge={item.badge}
                      testId={`awsui-app-layout-trigger-${item.id}`}
                    />
                  </span>
                );
              })}
              {drawers?.items?.length && drawers?.items?.length > getIndexOfOverflowItem() && (
                <span
                  className={clsx(styles['drawer-trigger'], overflowItemIsActive() && styles['drawer-trigger-active'])}
                >
                  <OverflowMenu
                    overflowItems={overflowItems}
                    onItemClick={({ detail }) => {
                      drawers.onChange({
                        activeDrawerId: detail.id !== drawers.activeDrawerId ? detail.id : undefined,
                      });
                    }}
                    hasOverflowBadge={overflowItemHasBadge}
                    hasActiveStyles={overflowItemIsActive()}
                  />
                </span>
              )}
            </>
          </aside>
        )}
      </div>
    </div>
  );
};
