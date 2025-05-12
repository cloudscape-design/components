// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { getDaysInMonth } from 'date-fns';

import InternalInput from '../input/internal';
import MaskedInput from '../internal/components/masked-input';
import { MaskArgs } from '../internal/components/masked-input/utils/mask-format';
import { fireNonCancelableEvent, NonCancelableCustomEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { displayToIso, formatDateIso, formatDateLocalized, isoToDisplay, parseDate } from '../internal/utils/date-time';
import { DateInputProps } from './interfaces';

import styles from './styles.css.js';

type InternalDateInputProps = DateInputProps & InternalBaseComponentProps;

function daysMax(value: string): number {
  // force to first day in month, as new Date('2018-02-30') -> March 2nd 2018
  const baseDate = displayToIso(value).substring(0, 7);
  return getDaysInMonth(parseDate(baseDate));
}

const yearMask = { min: 0, max: 9999, default: 2000, length: 4 };
const monthMask = { min: 1, max: 12, length: 2 };
const dayMask = { min: 1, max: daysMax, length: 2 };

const InternalDateInput = React.forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      onFocus,
      granularity,
      locale,
      format = 'default',
      displayFormat = 'default',
      __internalRootRef = null,
      ...props
    }: InternalDateInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState('');
    const containerRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs(__internalRootRef, containerRef);
    const inputFormat = displayFormat === 'long-localized' ? format : displayFormat;
    const inputValue = inputFormat === 'iso' ? value : isoToDisplay(value);

    useForwardFocus(ref, inputRef);

    const maskArgs: MaskArgs = {
      separator: inputFormat === 'iso' ? '-' : '/',
      inputSeparators: [...(inputFormat === 'iso' ? ['/'] : ['-']), '.', ' '],
      segments: granularity === 'month' ? [yearMask, monthMask] : [yearMask, monthMask, dayMask],
    };

    const onInputFocus = (event: NonCancelableCustomEvent<null>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const onInputBlur = (event: NonCancelableCustomEvent<null>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    useEffect(() => {
      if (isFocused && !!inputRef && inputRef.current) {
        inputRef.current?.focus();
      }
    }, [isFocused, inputRef]);

    useEffect(() => {
      if (displayFormat === 'long-localized' && value && !isFocused) {
        if (!isFocused) {
          setDisplayValue(
            formatDateLocalized({
              date: value,
              hideTimeOffset: true,
              isDateOnly: true,
              isMonthOnly: granularity === 'month',
              locale,
            })
          );
        } else {
          setDisplayValue(
            formatDateIso({ date: value, hideTimeOffset: true, isDateOnly: true, isMonthOnly: granularity === 'month' })
          );
        }
      }
    }, [value, locale, displayFormat, granularity, isFocused]);

    const sharedProps = {
      ...props,
      ref: inputRef,
      className: clsx(styles.root, props.className),
      autoComplete: false,
      disableBrowserAutocorrect: true,
      onFocus: onInputFocus,
      // ['__internalRootRef']: __internalRootRef,
    };

    return (
      <div ref={mergedRef}>
        {!isFocused && displayFormat === 'long-localized' ? (
          <InternalInput {...sharedProps} value={displayValue || ''} onChange={() => {}} />
        ) : (
          <MaskedInput
            {...sharedProps}
            value={inputValue || ''}
            onChange={event =>
              fireNonCancelableEvent(onChange, {
                value: format === 'iso' ? event.detail.value : displayToIso(event.detail.value),
              })
            }
            onBlur={onInputBlur}
            mask={maskArgs}
            autofix={true}
            disableAutocompleteOnBlur={false}
          />
        )}
        {/* {JSON.stringify({ value, isFocused, inputValue, displayValue, format, displayFormat})} */}
      </div>
    );
  }
);

export default InternalDateInput;
