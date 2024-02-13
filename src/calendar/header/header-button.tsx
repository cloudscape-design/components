// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { InternalButton, InternalButtonProps } from '../../button/internal';
import styles from '../styles.css.js';

interface HeaderButtonProps {
  ariaLabel?: string;
  onClick: InternalButtonProps['onClick'];
}

export function HeaderPrevButton({ ariaLabel, onClick }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-left"
      ariaLabel={ariaLabel}
      variant="icon"
      onClick={onClick}
      formAction="none"
      className={styles['calendar-prev-btn']}
    />
  );
}

export function HeaderNextButton({ ariaLabel, onClick }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-right"
      ariaLabel={ariaLabel}
      variant="icon"
      onClick={onClick}
      formAction="none"
      className={styles['calendar-next-btn']}
    />
  );
}
