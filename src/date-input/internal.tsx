// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { CalendarProps } from '../calendar/interfaces';
import MaskedInput from '../internal/components/masked-input';
import { fireNonCancelableEvent } from '../internal/events';
import { NonCancelableCustomEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { displayToIso, formatDateIso, formatDateLocalized, isoToDisplay } from '../internal/utils/date-time';
import { DateInputProps } from './interfaces';
import { generateMaskArgs, normalizeIsoDateString } from './utils';

import styles from './styles.css.js';

type InternalDateInputProps = DateInputProps &
  InternalBaseComponentProps & {
    granularity?: CalendarProps.Granularity;
  };

const InternalDateInput = React.forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      onFocus,
      granularity = 'day',
      locale,
      format = 'slashed',
      inputFormat = 'slashed',
      readOnly,
      __internalRootRef = null,
      disabled,
      ...props
    }: InternalDateInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState('');
    const containerRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs(__internalRootRef, containerRef);
    const isIso = format === 'iso' || (format === 'long-localized' && inputFormat === 'iso');

    useForwardFocus(ref, inputRef);

    const onInputFocus = (event: NonCancelableCustomEvent<null>) => {
      if (!disabled && !readOnly) {
        setIsFocused(true);
        onFocus?.(event);
      }
    };

    const onInputBlur = (event: NonCancelableCustomEvent<null>) => {
      if (!disabled && !readOnly) {
        setIsFocused(false);
        onBlur?.(event);
      }
    };

    const onInputChange = (event: NonCancelableCustomEvent<{ value: string }>) => {
      const isNonFocusedLongLocalized = format === 'long-localized' && !isFocused;
      if (!readOnly && !disabled && !isNonFocusedLongLocalized) {
        fireNonCancelableEvent(onChange, {
          value: isIso ? event.detail.value : displayToIso(event.detail.value),
        });
        console.log('onchange');
      }
    };

    useEffect(() => {
      if (!disabled && isFocused && !!inputRef && inputRef.current) {
        inputRef.current?.focus();
      }
    }, [isFocused, inputRef, disabled]);

    useEffect(() => {
      if (value) {
        const isoVal = displayToIso(value);
        if (format === 'long-localized' && !isFocused) {
          const normalizedDate = normalizeIsoDateString(isoVal, granularity);
          if (normalizedDate) {
            setDisplayValue(
              formatDateLocalized({
                date: normalizedDate,
                hideTimeOffset: true,
                isDateOnly: true,
                isMonthOnly: granularity === 'month',
                locale,
              })
            );
          }
        } else {
          const isoDate = formatDateIso({
            date: isoVal,
            hideTimeOffset: true,
            isDateOnly: true,
            isMonthOnly: granularity === 'month',
          });
          setDisplayValue(isIso ? isoDate : isoToDisplay(isoVal));
        }
      } else {
        setDisplayValue('');
      }
    }, [isIso, format, value, locale, inputFormat, granularity, isFocused]);

    const sharedProps = {
      ...props,
      ref: inputRef,
      autoComplete: false,
      disabled,
      disableBrowserAutocorrect: true,
      className: clsx(styles.root, props.className, {
        [styles['long-localized-focused']]: format === 'long-localized' && isFocused,
      }),
      onFocus: onInputFocus,
      ['__internalRootRef']: __internalRootRef,
      ['data-format']: format,
      ['data-editable-format']: format === 'long-localized' ? inputFormat : format,
    };

    return (
      <div ref={mergedRef}>
        <MaskedInput
          {...sharedProps}
          staticValue={(!isFocused || readOnly) && format === 'long-localized' ? displayValue : ''}
          value={isIso ? value || '' : isoToDisplay(value || '')}
          onChange={onInputChange}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          mask={generateMaskArgs({ granularity, isIso })}
          autofix={format !== 'long-localized' || (format === 'long-localized' && isFocused)}
          disableAutocompleteOnBlur={false}
          readOnly={readOnly}
        />
      </div>
    );
  }
);

export default InternalDateInput;
