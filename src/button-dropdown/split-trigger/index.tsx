// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import buttonDropdownStyles from '../styles.css.js';
import buttonStyles from '../../button/styles.css.js';
import styles from './styles.css.js';
import clsx from 'clsx';
import { ButtonIconProps, LeftIcon } from '../../button/icon-helper.js';

interface SplitTriggerProps {
  variant: 'primary' | 'normal';
  isOpen: boolean;
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function SplitTrigger({ variant, isOpen, onClick, children }: SplitTriggerProps) {
  const iconProps: ButtonIconProps = {
    loading: false,
    iconName: 'caret-down-filled',
    variant: 'icon',
    iconClass: isOpen ? buttonDropdownStyles['rotate-up'] : buttonDropdownStyles['rotate-down'],
    iconSize: 'normal',
    iconAlign: 'left',
  };
  return (
    <div>
      <button
        className={clsx(
          buttonStyles.button,
          buttonStyles[`variant-${variant}`],
          styles['main-action'],
          styles[`variant-${variant}`]
        )}
      >
        {children}
      </button>
      <button
        className={clsx(
          buttonStyles.button,
          buttonStyles[`variant-${variant}`],
          styles['more-actions'],
          styles[`variant-${variant}`]
        )}
        onClick={onClick}
      >
        <LeftIcon {...iconProps} />
      </button>
    </div>
  );
}
