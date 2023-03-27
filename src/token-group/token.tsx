// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';
import DismissButton from './dismiss-button';

import styles from './styles.css.js';

export interface TokenProps {
  children: React.ReactNode;
  dismiss?: {
    label?: string;
    onDismiss: () => void;
  };
  disabled?: boolean;
}

export function Token({ children, dismiss, disabled }: TokenProps) {
  return (
    <div className={clsx(styles.token, disabled && styles['token-disabled'])}>
      <div className={styles['token-content']}>{children}</div>
      {dismiss && <DismissButton disabled={disabled} dismissLabel={dismiss.label} onDismiss={dismiss.onDismiss} />}
    </div>
  );
}
