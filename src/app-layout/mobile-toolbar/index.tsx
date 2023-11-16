// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { ButtonProps } from '../../button/interfaces';
import { AppLayoutProps } from '../interfaces';
import { ToggleButton, togglesConfig } from '../toggles';
import OverflowMenu from '../drawer/overflow-menu';
import styles from './styles.css.js';
import sharedStyles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { splitItems } from '../drawer/drawers-helpers';
import { TOOLS_DRAWER_ID } from '../utils/use-drawers';

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
  anyPanelOpen: boolean;
  unfocusable: boolean | undefined;
  toggleRefs: {
    navigation: React.Ref<ButtonProps.Ref>;
    tools: React.Ref<ButtonProps.Ref>;
  };
  navigationHide: boolean | undefined;
  toolsHide: boolean | undefined;
  topOffset?: number;
  ariaLabels: AppLayoutProps.Labels | undefined;
  mobileBarRef: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
  onNavigationOpen: () => void;
  onToolsOpen: () => void;
  drawers: Array<AppLayoutProps.Drawer> | undefined;
  activeDrawerId: string | null;
  onDrawerChange: (newDrawerId: string | null) => void;
}

export function MobileToolbar({
  ariaLabels,
  toggleRefs,
  topOffset,
  navigationHide,
  toolsHide,
  anyPanelOpen,
  unfocusable,
  drawers,
  activeDrawerId,
  children,
  onNavigationOpen,
  onToolsOpen,
  onDrawerChange,
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

  const { overflowItems, visibleItems } = splitItems(drawers, 2, activeDrawerId);
  const overflowMenuHasBadge = !!overflowItems.find(item => item.badge);

  return (
    <div
      ref={mobileBarRef}
      className={clsx(styles['mobile-bar'], testutilStyles['mobile-bar'], unfocusable && sharedStyles.unfocusable)}
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
        <aside aria-label={ariaLabels?.drawers} role="region">
          <div className={clsx(styles['drawers-container'])} role="toolbar" aria-orientation="horizontal">
            {visibleItems.map((item, index) => (
              <div
                className={clsx(styles['mobile-toggle'], styles['mobile-toggle-type-drawer'])}
                key={index}
                onClick={() => onDrawerChange(item.id)}
              >
                <ToggleButton
                  className={clsx(
                    testutilStyles['drawers-trigger'],
                    item.id === TOOLS_DRAWER_ID && testutilStyles['tools-toggle']
                  )}
                  iconName={item.trigger.iconName}
                  iconSvg={item.trigger.iconSvg}
                  badge={item.badge}
                  ariaLabel={item.ariaLabels?.triggerButton}
                  ariaExpanded={activeDrawerId === item.id}
                  testId={`awsui-app-layout-trigger-${item.id}`}
                />
              </div>
            ))}
            {overflowItems.length > 0 && (
              <div className={clsx(styles['mobile-toggle'], styles['mobile-toggle-type-drawer'])}>
                <OverflowMenu
                  ariaLabel={overflowMenuHasBadge ? ariaLabels?.drawersOverflowWithBadge : ariaLabels?.drawersOverflow}
                  items={overflowItems}
                  onItemClick={({ detail }) => onDrawerChange(detail.id)}
                />
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
