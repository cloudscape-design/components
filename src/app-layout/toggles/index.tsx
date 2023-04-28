// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ButtonProps } from '../../button/interfaces';
import { InternalButton } from '../../button/internal';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutButtonProps } from './interfaces';
import styles from './styles.css.js';

export const togglesConfig = {
  navigation: {
    TagName: 'nav',
    iconName: 'menu',
    getLabels: (labels: AppLayoutProps.Labels = {}) => ({
      mainLabel: labels.navigation,
      openLabel: labels.navigationToggle,
      closeLabel: labels.navigationClose,
    }),
  },
  tools: {
    TagName: 'aside',
    iconName: 'status-info',
    getLabels: (labels: AppLayoutProps.Labels = {}) => ({
      mainLabel: labels.tools,
      openLabel: labels.toolsToggle,
      closeLabel: labels.toolsClose,
    }),
  },
} as const;

export const AppLayoutButton = React.forwardRef(
  (
    { className, ariaLabel, ariaExpanded, iconName, iconSvg, disabled, onClick }: AppLayoutButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    return (
      <InternalButton
        ref={ref}
        className={className}
        ariaLabel={ariaLabel}
        variant="icon"
        formAction="none"
        onClick={onClick}
        iconName={iconName}
        iconSvg={iconSvg}
        disabled={disabled}
        ariaExpanded={ariaExpanded ? undefined : false}
        __nativeAttributes={{ 'aria-haspopup': ariaExpanded ? undefined : true }}
      />
    );
  }
);

interface CloseButtonProps {
  className?: string;
  ariaLabel: string | undefined;
  onClick: () => void;
}

export const CloseButton = React.forwardRef(
  ({ className, ariaLabel, onClick }: CloseButtonProps, ref: React.Ref<ButtonProps.Ref>) => {
    return (
      <span className={styles['close-button']}>
        <AppLayoutButton
          ref={ref}
          className={className}
          ariaExpanded={true}
          ariaLabel={ariaLabel}
          iconName="close"
          onClick={onClick}
        />
      </span>
    );
  }
);
