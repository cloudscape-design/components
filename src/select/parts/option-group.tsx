// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

interface OptionGroupProps {
  children: React.ReactNode;
  virtual: boolean;
  ariaLabelledby: string;
  ariaDisabled?: boolean;
}

export default function OptionGroup({ children, virtual, ariaLabelledby, ariaDisabled }: OptionGroupProps) {
  return (
    <div
      role="group"
      className={clsx(styles['option-group'], virtual && styles.virtual)}
      aria-labelledby={ariaLabelledby}
      aria-disabled={ariaDisabled}
    >
      {children}
    </div>
  );
}
