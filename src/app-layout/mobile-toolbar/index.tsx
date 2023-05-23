// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { ButtonProps } from '../../button/interfaces';
import { AppLayoutProps } from '../interfaces';
import { DrawerItem } from '../drawer/interfaces';
import { AppLayoutButton, togglesConfig } from '../toggles';
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
        className={clsx(styles['mobile-toggle'])}
        aria-hidden={disabled}
        aria-label={mainLabel}
        onClick={e => e.target === e.currentTarget && onClick()}
      >
        <AppLayoutButton
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
          className={clsx(
            styles['mobile-toggle'],
            styles['mobile-toggle-with-drawers'],
            testutilStyles['drawers-mobile-triggers-container']
          )}
        >
          {drawers.items.map((item: DrawerItem, index: number) => (
            <AppLayoutButton
              className={clsx(styles['mobile-trigger-with-drawers'], testutilStyles['drawers-trigger'])}
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
  );
}
