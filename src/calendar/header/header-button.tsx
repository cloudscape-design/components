// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { InternalButton } from '../../button/internal';
import styles from '../styles.css.js';

interface HeaderButtonProps {
  ariaLabel?: string;
  onChange: (n: number) => void;
}

export function HeaderPrevButton({ ariaLabel, onChange }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-left"
      ariaLabel={ariaLabel}
      variant="icon"
      onClick={() => onChange(-1)}
      formAction="none"
      className={styles['calendar-prev-btn']}
    />
  );
}

export function HeaderNextButton({ ariaLabel, onChange }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-right"
      ariaLabel={ariaLabel}
      variant="icon"
      onClick={() => onChange(1)}
      formAction="none"
      className={styles['calendar-next-btn']}
    />
  );
}
