// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { ButtonProps } from '../../button/interfaces';
import { InternalButton } from '../../button/internal';
import InternalIcon from '../../icon/internal';
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

export const ToggleButton = React.forwardRef(
  (
    { className, ariaLabel, ariaExpanded, iconName, iconSvg, disabled, testId, onClick }: AppLayoutButtonProps,
    ref: React.Ref<{ focus(): void }>
  ) => {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={clsx(className, styles['toggle-button'])}
        aria-label={ariaLabel}
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-expanded={ariaExpanded ? undefined : false}
        aria-haspopup={ariaExpanded ? undefined : true}
        data-testid={testId}
      >
        <InternalIcon svg={iconSvg} name={iconName} />
      </button>
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
        <InternalButton
          ref={ref}
          className={className}
          ariaLabel={ariaLabel}
          variant="icon"
          formAction="none"
          iconName="close"
          onClick={onClick}
        />
      </span>
    );
  }
);
