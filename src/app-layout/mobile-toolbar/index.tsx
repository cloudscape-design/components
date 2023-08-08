// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { ButtonProps } from '../../button/interfaces';
import { AppLayoutProps } from '../interfaces';
import { DrawerItem } from '../drawer/interfaces';
import { ToggleButton, togglesConfig } from '../toggles';
import OverflowMenu from '../drawer/overflow-menu';
import styles from './styles.css.js';
import sharedStyles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

interface MobileToggleProps {
  className?: string;
  ariaLabels?: AppLayoutProps.Labels;
  type: keyof typeof togglesConfig;
  disabled?: boolean;
  onClick: () => void;
}
const MobileToggle = React.forwardRef(
  ({ className, ariaLabels, type, disabled, onClick }: MobileToggleProps, ref: React.Ref<ButtonProps.Ref>) => {
    const { TagName, iconName, getLabels } = togglesConfig[type];
    const { mainLabel, openLabel } = getLabels(ariaLabels);

    return (
      <TagName
        className={clsx(styles['mobile-toggle'], styles[`mobile-toggle-type-${type}`])}
        aria-hidden={disabled}
        aria-label={mainLabel}
        onClick={e => e.target === e.currentTarget && onClick()}
      >
        <ToggleButton
          ref={ref}
          className={className}
          iconName={iconName}
          onClick={onClick}
          ariaLabel={openLabel}
          disabled={disabled}
          ariaExpanded={disabled}
        />
      </TagName>
    );
  }
);
interface MobileToolbarProps {
  anyPanelOpen: boolean | undefined;
  unfocusable: boolean | undefined;
  toggleRefs: {
    navigation: React.Ref<ButtonProps.Ref>;
    tools: React.Ref<ButtonProps.Ref>;
  };
  navigationHide: boolean | undefined;
  toolsHide: boolean | undefined;
  topOffset?: number;
  ariaLabels?: AppLayoutProps.Labels;
  mobileBarRef: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
  onNavigationOpen: () => void;
  onToolsOpen: () => void;
  drawers?: {
    items: Array<DrawerItem>;
    activeDrawerId: string | undefined;
    onChange: (changeDetail: { activeDrawerId: string | undefined }) => void;
    ariaLabel?: string;
  };
}

export function MobileToolbar({
  ariaLabels = {},
  toggleRefs,
  topOffset,
  navigationHide,
  toolsHide,
  anyPanelOpen = false,
  unfocusable,
  children,
  onNavigationOpen,
  onToolsOpen,
  drawers,
  mobileBarRef,
}: MobileToolbarProps) {
  useEffect(() => {
    if (anyPanelOpen) {
      document.body.classList.add(styles['block-body-scroll']);
      return () => {
        document.body.classList.remove(styles['block-body-scroll']);
      };
    } else {
      document.body.classList.remove(styles['block-body-scroll']);
    }
  }, [anyPanelOpen]);

  const overflowItemHasBadge = () => {
    const overflowItems = drawers?.items.slice(1, drawers.items.length);
    return overflowItems ? overflowItems.filter(item => item.badge).length > 0 : false;
  };

  return (
    <div
      ref={mobileBarRef}
      className={clsx(styles['mobile-bar'], unfocusable && sharedStyles.unfocusable)}
      style={{ top: topOffset }}
    >
      {!navigationHide && (
        <MobileToggle
          ref={toggleRefs.navigation}
          type="navigation"
          className={testutilStyles['navigation-toggle']}
          ariaLabels={ariaLabels}
          disabled={anyPanelOpen}
          onClick={onNavigationOpen}
        />
      )}
      <div className={styles['mobile-bar-breadcrumbs']}>
        {children && <div className={testutilStyles.breadcrumbs}>{children}</div>}
      </div>
      {!toolsHide && !drawers && (
        <MobileToggle
          ref={toggleRefs.tools}
          type="tools"
          className={testutilStyles['tools-toggle']}
          ariaLabels={ariaLabels}
          disabled={anyPanelOpen}
          onClick={onToolsOpen}
        />
      )}
      {drawers && (
        <aside
          aria-label={drawers.ariaLabel}
          className={clsx(styles['drawers-container'], testutilStyles['drawers-mobile-triggers-container'])}
        >
          {drawers.items.slice(0, 2).map((item: DrawerItem, index: number) => (
            <span className={clsx(styles['mobile-toggle'], styles['mobile-toggle-type-drawer'])} key={index}>
              <ToggleButton
                className={testutilStyles['drawers-trigger']}
                iconName={item.trigger.iconName}
                iconSvg={item.trigger.iconSvg}
                badge={item.badge}
                ariaLabel={item.ariaLabels?.triggerButton}
                onClick={() => drawers.onChange({ activeDrawerId: item.id })}
                ariaExpanded={drawers.activeDrawerId !== undefined}
                testId={`awsui-app-layout-trigger-${item.id}`}
              />
            </span>
          ))}
          {drawers?.items?.length && drawers?.items?.length > 2 && (
            <span className={clsx(styles['mobile-toggle'], styles['mobile-toggle-type-drawer'])}>
              <OverflowMenu
                overflowItems={drawers.items.slice(2, drawers.items.length)}
                onItemClick={({ detail }) => {
                  drawers.onChange({
                    activeDrawerId: detail.id !== drawers.activeDrawerId ? detail.id : undefined,
                  });
                }}
                hasOverflowBadge={overflowItemHasBadge()}
              />
            </span>
          )}
        </aside>
      )}
    </div>
  );
}
