// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';

interface WizardFormHeaderProps {
  children: React.ReactNode;
  isMobile: boolean;
  isVisualRefresh: boolean;
}

export default function WizardFormHeader({ children, isVisualRefresh }: WizardFormHeaderProps) {
  return (
    <div className={clsx(styles['form-header'], isVisualRefresh && styles['form-header-refresh'])}>
      <div className={styles['form-header-content']}>{children}</div>
    </div>
  );
}
