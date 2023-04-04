// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import { ButtonProps } from '../../button/interfaces';
import { AppLayoutButton, CloseButton, togglesConfig } from '../toggles';
import { AppLayoutProps } from '../interfaces';
import { IconProps } from '../../icon/interfaces';
import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

export interface DesktopDrawerProps {
  contentClassName: string;
  toggleClassName: string;
  closeClassName: string;
  toggleRefs: {
    toggle: React.Ref<ButtonProps.Ref>;
    close: React.Ref<ButtonProps.Ref>;
  };
  width: number;
  topOffset: number | undefined;
  bottomOffset: number | undefined;
  ariaLabels: AppLayoutProps.Labels | undefined;
  children: React.ReactNode;
  type: keyof typeof togglesConfig;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onClick?: (event: React.MouseEvent) => void;
  onLoseFocus?: (event: React.FocusEvent) => void;
  drawers?: {
    items: Array<DrawerItem>;
    activeDrawerId: string | undefined;
    onChange: (changeDetail: { activeDrawerId: string | undefined }) => void;
  };
}

export interface DrawerTriggersBar {
  contentClassName: string;
  topOffset: number | undefined;
  bottomOffset: number | undefined;
  isMobile: boolean;
  drawers?: {
    items: Array<DrawerItem>;
    activeDrawerId: string | undefined;
    onChange: (changeDetail: { activeDrawerId: string | undefined }) => void;
  };
}

export interface DrawerItem {
  id: string;
  content: React.ReactNode;
  trigger: {
    iconName?: IconProps.Name;
    iconSvg?: React.ReactNode;
  };
  ariaLabels: {
    content: string;
    closeButton: string;
    triggerButton: string;
  };
}

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

export function Drawer({
  contentClassName,
  toggleClassName,
  closeClassName,
  width,
  type,
  toggleRefs,
  topOffset,
  bottomOffset,
  ariaLabels,
  children,
  isOpen,
  isMobile,
  onToggle,
  onClick,
  onLoseFocus,
  drawers,
}: DesktopDrawerProps) {
  const { TagName, iconName, getLabels } = togglesConfig[type];
  const { mainLabel, closeLabel, openLabel } = getLabels(ariaLabels);
  const drawerContentWidthOpen = isMobile ? undefined : width;
  const drawerContentWidth = isOpen ? drawerContentWidthOpen : undefined;
  const openButtonWrapperRef = useRef<HTMLElement | null>(null);

  const regularOpenButton = (
    <TagName ref={openButtonWrapperRef} aria-label={mainLabel} className={styles.toggle} aria-hidden={isOpen}>
      <AppLayoutButton
        ref={toggleRefs.toggle}
        className={clsx(styles.trigger, toggleClassName)}
        iconName={iconName}
        ariaLabel={openLabel}
        onClick={() => onToggle(true)}
        ariaExpanded={false}
      />
    </TagName>
  );
  const activeDrawer = drawers?.items.find(item => item.id === drawers.activeDrawerId);

  return (
    <div
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
        className={clsx(styles['drawer-content'], contentClassName)}
      >
        {!isMobile && regularOpenButton}
        <TagName aria-label={activeDrawer?.ariaLabels.content || mainLabel} aria-hidden={!isOpen}>
          <CloseButton
            ref={toggleRefs.close}
            className={closeClassName}
            ariaLabel={activeDrawer?.ariaLabels.closeButton || closeLabel}
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

export function DrawerTriggersBar({ isMobile, topOffset, bottomOffset, drawers, contentClassName }: DrawerTriggersBar) {
  return (
    <div
      className={clsx(styles.drawer, styles['drawer-closed'], testutilStyles['drawer-closed'], {
        [styles['drawer-mobile']]: isMobile,
      })}
    >
      <div
        style={{ top: topOffset, bottom: bottomOffset }}
        className={clsx(styles['drawer-content'], styles['non-interactive'], contentClassName)}
      >
        {!isMobile && (
          <aside aria-label="Drawers" className={styles.toggle}>
            {drawers?.items?.map((item: DrawerItem, index: number) => (
              <AppLayoutButton
                className={clsx(
                  styles.trigger,
                  styles['trigger-drawer'],
                  drawers.activeDrawerId === item.id && styles.selected
                )}
                key={`drawer-trigger-${index}`}
                iconName={item.trigger.iconName}
                iconSvg={item.trigger.iconSvg}
                ariaLabel={item.ariaLabels?.triggerButton}
                onClick={() => drawers.onChange({ activeDrawerId: item.id })}
                ariaExpanded={drawers.activeDrawerId !== undefined}
              />
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}
