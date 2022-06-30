// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { ButtonProps } from '../../button/interfaces';
import { AppLayoutProps } from '../interfaces';
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
        onClick={onClick}
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
  children: React.ReactNode;
  onNavigationOpen: () => void;
  onToolsOpen: () => void;
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
    <div className={clsx(styles['mobile-bar'], unfocusable && sharedStyles.unfocusable)} style={{ top: topOffset }}>
      {!navigationHide && (
        <MobileToggle
          ref={toggleRefs.navigation}
          type="navigation"
          className={clsx(sharedStyles['navigation-toggle'], testutilStyles['navigation-toggle'])}
          ariaLabels={ariaLabels}
          disabled={anyPanelOpen}
          onClick={onNavigationOpen}
        />
      )}
      <div className={styles['mobile-bar-breadcrumbs']}>
        {children && <div className={clsx(sharedStyles.breadcrumbs, testutilStyles.breadcrumbs)}>{children}</div>}
      </div>
      {!toolsHide && (
        <MobileToggle
          ref={toggleRefs.tools}
          type="tools"
          className={clsx(sharedStyles['tools-toggle'], testutilStyles['tools-toggle'])}
          ariaLabels={ariaLabels}
          disabled={anyPanelOpen}
          onClick={onToolsOpen}
        />
      )}
    </div>
  );
}
