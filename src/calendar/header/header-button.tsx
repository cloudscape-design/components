// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { InternalButton } from '../../button/internal';
import styles from '../styles.css.js';
import { addMonths, addYears } from 'date-fns';

interface HeaderButtonProps {
  ariaLabel?: string;
  baseDate: Date;
  onChange: (date: Date) => void;
  granularity?: 'month' | 'day';
}

export function HeaderPrevButton({ ariaLabel, baseDate, onChange, granularity }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-left"
      ariaLabel={ariaLabel}
      variant="icon"
      onClick={() => onChange((granularity === 'month' ? addYears : addMonths)(baseDate, -1))}
      formAction="none"
      className={styles['calendar-prev-btn']}
    />
  );
}

export function HeaderNextButton({ ariaLabel, baseDate, onChange, granularity }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-right"
      ariaLabel={ariaLabel}
      variant="icon"
      onClick={() => onChange((granularity === 'month' ? addYears : addMonths)(baseDate, 1))}
      formAction="none"
      className={styles['calendar-next-btn']}
    />
  );
}
