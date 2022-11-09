// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { ButtonProps } from '../button/interfaces';
import { AppLayoutButton, CloseButton, togglesConfig } from './toggles';
import { AppLayoutProps } from './interfaces';
import styles from './styles.css.js';

// This matches the design token awsui.$border-divider-section-width in Visual Refresh
const BORDER_WIDTH = 2;

export interface DesktopDrawerProps {
  contentClassName?: string;
  toggleClassName?: string;
  closeClassName?: string;
  toggleRefs: {
    toggle: React.Ref<ButtonProps.Ref>;
    close: React.Ref<ButtonProps.Ref>;
  };
  externalizedToggle?: boolean;
  width: number;
  topOffset?: number;
  bottomOffset?: number;
  ariaLabels?: AppLayoutProps.Labels;
  children: React.ReactNode;
  type: keyof typeof togglesConfig;
  isMobile?: boolean;
  isOpen?: boolean;
  isHidden?: boolean;
  hasDividerWithSplitPanel?: boolean;
  onToggle: (isOpen: boolean) => void;
  onClick?: (event: React.MouseEvent) => void;
  onLoseFocus?: (event: React.FocusEvent) => void;
  extendRight?: number;
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
  isHidden,
  isMobile,
  hasDividerWithSplitPanel,
  onToggle,
  onClick,
  onLoseFocus,
  extendRight = 0,
}: DesktopDrawerProps) {
  const { TagName, iconName, getLabels } = togglesConfig[type];
  const { mainLabel, closeLabel, openLabel } = getLabels(ariaLabels);
  const hasDividerWithButtonBar = isOpen && extendRight !== 0;

  const drawerContentWidthOpen = isMobile ? undefined : width;
  const drawerContentWidth = isOpen ? drawerContentWidthOpen : undefined;

  const drawerWidth =
    hasDividerWithButtonBar && drawerContentWidth ? drawerContentWidth + BORDER_WIDTH : drawerContentWidth;

  const closeIconName = 'close';

  const regularOpenButton = (
    <TagName aria-label={mainLabel} className={styles.toggle} aria-hidden={isOpen}>
      <AppLayoutButton
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
      className={clsx(styles.drawer, {
        [styles['drawer-closed']]: !isOpen,
        [styles['drawer-hidden']]: isHidden,
        [styles['drawer-mobile']]: isMobile,
        [styles['has-divider-with-splitpanel']]: hasDividerWithSplitPanel,
        [styles['opaque-background']]: hasDividerWithButtonBar,
      })}
      style={{
        width: drawerWidth,
        marginRight: isOpen ? -1 * extendRight : 0,
        paddingRight: isOpen ? extendRight : 0,
      }}
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
          if ((event.target as Element).tagName !== 'BUTTON') {
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
        <TagName aria-label={mainLabel} aria-hidden={!isOpen}>
          <CloseButton
            ref={toggleRefs.close}
            className={closeClassName}
            ariaLabel={closeLabel}
            onClick={() => onToggle(false)}
            iconName={closeIconName}
          />
          {children}
        </TagName>
      </div>
    </div>
  );
}
