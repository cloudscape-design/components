// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import { Granularity } from '../../interfaces';

import testutilStyles from '../../test-classes/styles.css.js';

interface HeaderButtonProps {
  ariaLabel?: string;
  onChangePage: (n: number) => void;
  granularity?: Granularity;
}

export function PrevPageButton({ ariaLabel, onChangePage, granularity = 'day' }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-left"
      ariaLabel={ariaLabel}
      variant={'icon'}
      onClick={() => onChangePage(-1)}
      formAction="none"
      className={clsx(
        testutilStyles[`calendar-prev-page-btn`],
        granularity === 'day' && testutilStyles[`calendar-prev-month-btn`]
      )}
    />
  );
}

export function NextPageButton({ ariaLabel, onChangePage, granularity = 'day' }: HeaderButtonProps) {
  return (
    <InternalButton
      iconName="angle-right"
      ariaLabel={ariaLabel}
      variant={'icon'}
      onClick={() => onChangePage(1)}
      formAction="none"
      className={clsx(
        testutilStyles[`calendar-next-page-btn`],
        granularity === 'day' && testutilStyles[`calendar-next-month-btn`]
      )}
    />
  );
}
