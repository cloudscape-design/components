// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';
import DismissButton from './dismiss-button';

import styles from './styles.css.js';

interface ItemAttributes {
  children: React.ReactNode;
  dismissLabel?: string;
  onDismiss?: () => void;
  disabled?: boolean;
}

interface TokenProps extends ItemAttributes {
  children: React.ReactNode;
}

export function Token({ disabled, dismissLabel, onDismiss, children }: TokenProps) {
  return (
    <div
      className={clsx(styles.token, disabled && styles['token-disabled'])}
      aria-disabled={disabled ? 'true' : undefined}
    >
      {children}
      {onDismiss && <DismissButton disabled={disabled} dismissLabel={dismissLabel} onDismiss={onDismiss} />}
    </div>
  );
}
