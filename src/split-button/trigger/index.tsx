// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import buttonStyles from '../../button/styles.css.js';
import styles from './styles.css.js';
import clsx from 'clsx';
import { ButtonIconProps, LeftIcon } from '../../button/icon-helper';

interface SplitTriggerProps {
  loading: boolean;
  variant: 'primary' | 'normal';
  isOpen: boolean;
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function SplitTrigger({ loading, variant, isOpen, onClick, children }: SplitTriggerProps) {
  const loadingIconProps: ButtonIconProps = {
    loading: true,
  };
  const dropdownIconProps: ButtonIconProps = {
    loading: false,
    iconName: 'caret-down-filled',
    variant: 'icon',
    iconClass: isOpen ? styles['rotate-up'] : styles['rotate-down'],
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
        {loading && <LeftIcon {...loadingIconProps} />}
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
        <LeftIcon {...dropdownIconProps} />
      </button>
    </div>
  );
}
