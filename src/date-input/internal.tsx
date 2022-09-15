// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import clsx from 'clsx';
import { getDaysInMonth } from 'date-fns';
import React, { Ref } from 'react';
import { fireNonCancelableEvent } from '../internal/events';
import { displayToIso, isoToDisplay, parseDate } from '../internal/utils/date-time';

import MaskedInput from '../internal/components/masked-input';
import { MaskArgs } from '../internal/components/masked-input/utils/mask-format';

import styles from './styles.css.js';
import { DateInputProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

type InternalDateInputProps = DateInputProps & InternalBaseComponentProps;

function daysMax(value: string): number {
  // force to first day in month, as new Date('2018-02-30') -> March 2nd 2018
  const baseDate = displayToIso(value).substring(0, 7);
  return getDaysInMonth(parseDate(baseDate));
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

const InternalDateInput = React.forwardRef(
  (
    { value, onChange, disableBrowserAutocorrect = true, __internalRootRef = null, ...props }: InternalDateInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <MaskedInput
        ref={ref}
        {...props}
        value={isoToDisplay(value || '')}
        onChange={event => fireNonCancelableEvent(onChange, { value: displayToIso(event.detail.value) })}
        className={clsx(styles.root, props.className)}
        mask={maskArgs}
        autofix={true}
        autoComplete={false}
        disableAutocompleteOnBlur={false}
        disableBrowserAutocorrect={disableBrowserAutocorrect}
        __internalRootRef={__internalRootRef}
      />
    );
  }
);

export default InternalDateInput;
