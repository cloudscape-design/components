// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { addMonths, addYears } from 'date-fns';

import { InternalButton } from '../../../button/internal';
import { CalendarProps } from '../../../calendar/interfaces';

import styles from '../../styles.css.js';

interface HeaderButtonProps {
  ariaLabel?: string;
  baseDate: Date;
  granularity?: CalendarProps.Granularity;
  onChangePage: (date: Date) => void;
}

export function PrevPageButton({ ariaLabel, baseDate, granularity, onChangePage }: HeaderButtonProps) {
  const addPage = granularity === 'day' ? addMonths : addYears;
  return (
    <InternalButton
      iconName="angle-left"
      ariaLabel={ariaLabel}
      variant={'icon'}
      onClick={() => onChangePage(addPage(baseDate, -1))}
      formAction="none"
      className={styles['calendar-prev-month-btn']}
    />
  );
}

export function NextPageButton({ ariaLabel, baseDate, granularity, onChangePage }: HeaderButtonProps) {
  const addPage = granularity === 'day' ? addMonths : addYears;
  return (
    <InternalButton
      iconName="angle-right"
      ariaLabel={ariaLabel}
      variant={'icon'}
      onClick={() => onChangePage(addPage(baseDate, 1))}
      formAction="none"
      className={styles['calendar-next-month-btn']}
    />
  );
}
