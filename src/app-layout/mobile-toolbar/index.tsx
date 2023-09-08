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
import { splitItems } from '../drawer/drawers-helpers';

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
    items: Array<DrawerItem | AppLayoutProps.Drawer>;
    activeDrawerId: string | null;
    onChange: (changeDetail: { activeDrawerId: string | null }) => void;
    ariaLabel?: string;
    overflowAriaLabel?: string;
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

  const { overflowItems, visibleItems } = splitItems(drawers?.items, 2, drawers?.activeDrawerId, true);

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
          {visibleItems.map((item, index) => (
            <div
              className={clsx(styles['mobile-toggle'], styles['mobile-toggle-type-drawer'])}
              key={index}
              onClick={() => drawers.onChange({ activeDrawerId: item.id })}
            >
              <ToggleButton
                className={testutilStyles['drawers-trigger']}
                iconName={'iconName' in item.trigger ? item.trigger.iconName : undefined}
                iconSvg={'iconSvg' in item.trigger ? item.trigger.iconSvg : undefined}
                badge={item.badge}
                ariaLabel={item.ariaLabels?.triggerButton}
                ariaExpanded={drawers.activeDrawerId === item.id}
                testId={`awsui-app-layout-trigger-${item.id}`}
              />
            </div>
          ))}
          {overflowItems.length > 0 && (
            <div className={clsx(styles['mobile-toggle'], styles['mobile-toggle-type-drawer'])}>
              <OverflowMenu
                ariaLabel={drawers.overflowAriaLabel}
                items={overflowItems}
                onItemClick={({ detail }) => {
                  drawers.onChange({
                    activeDrawerId: detail.id !== drawers.activeDrawerId ? detail.id : null,
                  });
                }}
              />
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
