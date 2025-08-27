// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import MaskedInput from '../internal/components/masked-input';
import { fireNonCancelableEvent, NonCancelableCustomEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { displayToIso, isoToDisplay } from '../internal/utils/date-time';
import formatDateIso from '../internal/utils/date-time/format-date-iso';
import formatDateLocalized from '../internal/utils/date-time/format-date-localized';
import { GeneratedAnalyticsMetadataDateInputComponent } from './analytics-metadata/interfaces';
import { DateInputProps } from './interfaces';
import { generateMaskArgs, normalizeIsoDateString } from './utils';

import styles from './styles.css.js';

type InternalDateInputProps = DateInputProps &
  InternalBaseComponentProps & {
    __injectAnalyticsComponentMetadata?: boolean;
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
      __internalRootRef,
      __injectAnalyticsComponentMetadata = false,
      ...props
    }: InternalDateInputProps,
    ref: Ref<DateInputProps.Ref>
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isIso = format === 'iso' || (format === 'long-localized' && inputFormat === 'iso');

    useForwardFocus(ref, inputRef);

    const onInputFocus = (event: NonCancelableCustomEvent<null>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const onInputBlur = (event: NonCancelableCustomEvent<null>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const onInputChange = (event: NonCancelableCustomEvent<{ value: string }>) => {
      const isNonFocusedLongLocalized = format === 'long-localized' && !(isFocused || props.readOnly);
      if (!isNonFocusedLongLocalized) {
        fireNonCancelableEvent(onChange, { value: displayToIso(event.detail.value) });
      }
    };

    const usesLongLocalizedValue = format === 'long-localized' && !(isFocused && !props.readOnly);
    const displayedValue = useMemo(() => {
      if (!value) {
        return '';
      }
      const isoValue = displayToIso(value);
      const formatProps = { hideTimeOffset: true, isDateOnly: true, isMonthOnly: granularity === 'month', locale };
      const normalizedValue = normalizeIsoDateString(isoValue, granularity);
      return usesLongLocalizedValue && normalizedValue
        ? formatDateLocalized({ date: normalizedValue, ...formatProps })
        : isIso
          ? formatDateIso({ date: isoValue, ...formatProps })
          : isoToDisplay(isoValue);
    }, [value, isIso, granularity, locale, usesLongLocalizedValue]);

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataDateInputComponent = {
      name: 'awsui.DateInput',
      label: 'input',
      properties: {
        value: value || '',
      },
    };

    return (
      <MaskedInput
        ref={inputRef}
        {...props}
        value={displayedValue}
        onChange={onInputChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        className={clsx(styles.root, props.className)}
        mask={generateMaskArgs({ granularity, isIso })}
        autofix={!usesLongLocalizedValue}
        disableAutocompleteOnBlur={false}
        disableBrowserAutocorrect={true}
        showUnmaskedValue={usesLongLocalizedValue}
        autoComplete={false}
        __internalRootRef={__internalRootRef}
        {...(__injectAnalyticsComponentMetadata
          ? getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })
          : {})}
      />
    );
  }
);

export default InternalDateInput;
