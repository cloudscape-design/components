// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import { ToggleButton, CloseButton, togglesConfig } from '../toggles';

import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';
import { DesktopDrawerProps, DrawerTriggersBarProps, DrawerItem } from './interfaces';
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
    const { mainLabel, closeLabel, openLabel } = drawersAriaLabels ?? getLabels(ariaLabels);
    const drawerContentWidthOpen = isMobile ? undefined : width;
    const drawerContentWidth = isOpen ? drawerContentWidthOpen : undefined;

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
        id={drawers?.activeDrawerId}
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
          <TagName aria-label={mainLabel} aria-hidden={!isOpen}>
            <CloseButton
              ref={toggleRefs.close}
              className={closeClassName}
              ariaLabel={closeLabel}
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

interface DrawerTriggerProps {
  testUtilsClassName?: string;
  ariaLabel: string | undefined;
  ariaExpanded: boolean;
  ariaControls: string | undefined;
  badge: boolean | undefined;
  itemId?: string;
  isActive: boolean;
  trigger: DrawerItem['trigger'];
  onClick: () => void;
}

const DrawerTrigger = React.forwardRef(
  (
    {
      testUtilsClassName,
      ariaLabel,
      ariaExpanded,
      ariaControls,
      badge,
      itemId,
      isActive,
      trigger,
      onClick,
    }: DrawerTriggerProps,
    ref: React.Ref<{ focus: () => void }>
  ) => (
    <div className={clsx(styles['drawer-trigger'], isActive && styles['drawer-trigger-active'])} onClick={onClick}>
      <ToggleButton
        ref={ref}
        className={testUtilsClassName}
        iconName={trigger.iconName}
        iconSvg={trigger.iconSvg}
        ariaLabel={ariaLabel}
        ariaExpanded={ariaExpanded}
        ariaControls={ariaControls}
        badge={badge}
        testId={itemId && `awsui-app-layout-trigger-${itemId}`}
      />
    </div>
  )
);

export const DrawerTriggersBar = ({ isMobile, topOffset, bottomOffset, drawers }: DrawerTriggersBarProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxHeight);
  const isCompactMode = useDensityMode(containerRef) === 'compact';

  const getIndexOfOverflowItem = () => {
    if (containerHeight) {
      const ITEM_HEIGHT = isCompactMode ? 34 : 38;
      const overflowSpot = containerHeight / 1.5;

      const index = Math.floor(overflowSpot / ITEM_HEIGHT);

      return index;
    }
    return 0;
  };

  const { visibleItems, overflowItems } = splitItems(drawers?.items, getIndexOfOverflowItem(), drawers?.activeDrawerId);

  return (
    <div
      className={clsx(styles.drawer, styles['drawer-closed'], testutilStyles['drawer-closed'], {
        [styles['drawer-mobile']]: isMobile,
      })}
      ref={containerRef}
    >
      <div
        ref={triggersContainerRef}
        style={{ top: topOffset, bottom: bottomOffset }}
        className={clsx(styles['drawer-content'])}
        role="toolbar"
      >
        {!isMobile && (
          <aside
            aria-label={drawers?.ariaLabel}
            className={clsx(styles['drawer-triggers-wrapper'], testutilStyles['drawers-desktop-triggers-container'])}
          >
            <>
              {visibleItems.map((item, index) => {
                return (
                  <DrawerTrigger
                    key={index}
                    testUtilsClassName={testutilStyles['drawers-trigger']}
                    ariaExpanded={drawers?.activeDrawerId === item.id}
                    ariaLabel={item.ariaLabels?.triggerButton}
                    ariaControls={item.id}
                    trigger={item.trigger}
                    badge={item.badge}
                    itemId={item.id}
                    isActive={drawers?.activeDrawerId === item.id}
                    onClick={() => {
                      drawers?.onChange({
                        activeDrawerId: item.id !== drawers.activeDrawerId ? item.id : undefined,
                      });
                    }}
                  />
                );
              })}
              {overflowItems.length > 0 && (
                <div className={clsx(styles['drawer-trigger'])}>
                  <OverflowMenu
                    ariaLabel={drawers?.overflowAriaLabel}
                    items={overflowItems}
                    onItemClick={({ detail }) => {
                      drawers?.onChange({
                        activeDrawerId: detail.id !== drawers.activeDrawerId ? detail.id : undefined,
                      });
                    }}
                  />
                </div>
              )}
            </>
          </aside>
        )}
      </div>
    </div>
  );
};
