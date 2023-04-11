// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import DismissButton from './dismiss-button';
import styles from './styles.css.js';

interface TokenProps {
  children: React.ReactNode;
  ariaLabel?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  disabled?: boolean;
}

export function Token({ ariaLabel, disabled, dismissLabel, onDismiss, children }: TokenProps) {
  return (
    <div
      className={clsx(styles.token, disabled && styles['token-disabled'])}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
      {onDismiss && <DismissButton disabled={disabled} dismissLabel={dismissLabel} onDismiss={onDismiss} />}
    </div>
  );
}
