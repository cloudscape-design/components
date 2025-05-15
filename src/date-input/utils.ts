// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getDaysInMonth } from 'date-fns';

import { CalendarProps } from '../calendar/interfaces';
import { MaskArgs } from '../internal/components/masked-input/utils/mask-format';
import { displayToIso, parseDate } from '../internal/utils/date-time';

function daysMax(value: string): number {
  // force to first day in month, as new Date('2018-02-30') -> March 2nd 2018
  const baseDate = displayToIso(value).substring(0, 7);
  return getDaysInMonth(parseDate(baseDate));
}

const yearMask = { min: 0, max: 9999, default: 2000, length: 4 };
const monthMask = { min: 1, max: 12, length: 2 };
const dayMask = { min: 1, max: daysMax, length: 2 };

export interface GenerateMaskArgsProps extends Pick<CalendarProps, 'granularity'> {
  isIso?: boolean;
}

export const generateMaskArgs = ({
  granularity = 'day',
  /**
   * There are only two options, 'iso' and 'slashed' which is our current default format. If more formats are entered
   * we should take the formatting type rather than teh boolean when we make an update
   */
  isIso = false,
}: GenerateMaskArgsProps = {}): MaskArgs => {
  return {
    separator: isIso ? '-' : '/',
    inputSeparators: [...(isIso ? ['/'] : ['-']), '.', ' '],
    segments: granularity === 'month' ? [yearMask, monthMask] : [yearMask, monthMask, dayMask],
  };
};
