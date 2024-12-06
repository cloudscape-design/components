// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalButton } from '../../../button/internal';

import styles from '../../styles.css.js';

interface HeaderButtonProps {
  ariaLabel?: string;
  onChangePage: (n: number) => void;
}

export function PrevPageButton({ ariaLabel, onChangePage }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-left"
      ariaLabel={ariaLabel}
      variant={'icon'}
      onClick={() => onChangePage(-1)}
      formAction="none"
      className={styles[`calendar-prev-page-btn`]}
    />
  );
}

export function NextPageButton({ ariaLabel, onChangePage }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-right"
      ariaLabel={ariaLabel}
      variant={'icon'}
      onClick={() => onChangePage(1)}
      formAction="none"
      className={styles[`calendar-next-page-btn`]}
    />
  );
}
