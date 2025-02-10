// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

interface WizardFormHeaderProps {
  children: React.ReactNode;
}

export default function WizardFormHeader({ children }: WizardFormHeaderProps) {
  return (
    <div className={clsx(styles['form-header'], styles['form-header-refresh'])}>
      <div className={styles['form-header-content']}>{children}</div>
    </div>
  );
}
