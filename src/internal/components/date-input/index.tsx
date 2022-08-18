// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref } from 'react';
import { fireNonCancelableEvent } from '../../events';

import MaskedInput from '../masked-input';
import { MaskArgs } from '../masked-input/utils/mask-format';

import { DateInputProps } from './interfaces';

import { daysInMonth, parseDate, displayToIso, isoToDisplay } from './utils/date';

export { DateInputProps };

function daysMax(value: string): number {
  // force to first day in month, as new Date('2018-02-30') -> March 2nd 2018
  const baseDate = displayToIso(value).substring(0, 7);
  return daysInMonth(parseDate(baseDate));
}

const maskArgs: MaskArgs = {
  separator: '/',
  inputSeparators: ['-', '.', ' '],
  segments: [
    { min: 0, max: 9999, default: 2000, length: 4 },
    { min: 1, max: 12, length: 2 },
    { min: 1, max: daysMax, length: 2 },
  ],
};

const DateInput = React.forwardRef(
  ({ __internalRootRef = null, value, onChange, ...props }: DateInputProps, ref: Ref<DateInputProps.Ref>) => {
    return (
      <MaskedInput
        value={isoToDisplay(value)}
        onChange={event => fireNonCancelableEvent(onChange, { value: displayToIso(event.detail.value) })}
        {...props}
        ref={ref}
        disableBrowserAutocorrect={true}
        mask={maskArgs}
        autofix={true}
        __internalRootRef={__internalRootRef}
      />
    );
  }
);

export default DateInput;
