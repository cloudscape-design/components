// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import buttonStyles from '../../button/styles.css.js';
import styles from './styles.css.js';
import clsx from 'clsx';
import { ButtonIconProps, LeftIcon } from '../../button/icon-helper';

interface TriggerLeftProps {
  disabled: boolean;
  variant: 'primary' | 'normal';
  onClick: () => void;
  children: React.ReactNode;
}

export function TriggerLeft({ disabled, variant, onClick, children }: TriggerLeftProps) {
  return (
    <button
      type="button"
      className={clsx(
        buttonStyles.button,
        buttonStyles[`variant-${variant}`],
        styles.segment,
        styles[`variant-${variant}`],
        disabled && buttonStyles.disabled
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface TriggerRightProps {
  loading: boolean;
  variant: 'primary' | 'normal';
  isOpen: boolean;
  onClick: (event: React.MouseEvent) => void;
  dropdownRef: React.Ref<HTMLButtonElement>;
}

export function TriggerRight({ loading, variant, isOpen, onClick, dropdownRef }: TriggerRightProps) {
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
    <button
      type="button"
      ref={dropdownRef}
      className={clsx(
        buttonStyles.button,
        buttonStyles[`variant-${variant}`],
        styles['dropdown-trigger'],
        styles[`variant-${variant}`],
        loading && buttonStyles.disabled
      )}
      onClick={onClick}
      aria-haspopup={true}
      aria-expanded={isOpen}
      aria-label="All actions"
      disabled={loading}
    >
      {loading ? <LeftIcon {...loadingIconProps} /> : <LeftIcon {...dropdownIconProps} />}
    </button>
  );
}
