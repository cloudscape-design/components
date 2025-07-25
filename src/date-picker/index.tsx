// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { Ref, useCallback, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import InternalCalendar from '../calendar/internal';
import { useFormFieldContext } from '../contexts/form-field.js';
import InternalDateInput from '../date-input/internal';
import { useLocale } from '../i18n/context.js';
import { InputProps } from '../input/interfaces';
import { getBaseProps } from '../internal/base-component';
import Dropdown from '../internal/components/dropdown';
import FocusLock from '../internal/components/focus-lock';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import useForwardFocus from '../internal/hooks/forward-focus';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useFocusTracker } from '../internal/hooks/use-focus-tracker.js';
import { KeyCode } from '../internal/keycode';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { parseDate } from '../internal/utils/date-time';
import { normalizeLocale } from '../internal/utils/locale';
import InternalLiveRegion from '../live-region/internal';
import { DatePickerProps } from './interfaces';
import { getBaseDateLabel, getSelectedDateLabel, isValidFullDate } from './utils';

import styles from './styles.css.js';

export { DatePickerProps };

const DatePicker = React.forwardRef(
  (
    {
      locale = '',
      startOfWeek,
      isDateEnabled,
      dateDisabledReason,
      nextMonthAriaLabel,
      previousMonthAriaLabel,
      todayAriaLabel,
      i18nStrings,
      placeholder = '',
      value = '',
      readOnly = false,
      disabled = false,
      onBlur,
      autoFocus = false,
      onChange,
      onFocus,
      name,
      ariaLabel,
      ariaRequired,
      controlId,
      invalid,
      warning,
      openCalendarAriaLabel,
      expandToViewport,
      granularity = 'day',
      ...restProps
    }: DatePickerProps,
    ref: Ref<DatePickerProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('DatePicker', {
      props: { autoFocus, expandToViewport, granularity, readOnly },
      metadata: { hasDisabledReasons: Boolean(dateDisabledReason) },
    });
    checkControlled('DatePicker', 'value', value, 'onChange', onChange);

    const contextLocale = useLocale();
    const normalizedLocale = normalizeLocale('DatePicker', locale || contextLocale);

    const baseProps = getBaseProps(restProps);
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
    const { ariaLabelledby, ariaDescribedby } = useFormFieldContext(restProps);

    const internalInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<ButtonProps.Ref>(null);
    useForwardFocus(ref, internalInputRef);

    const rootRef = useRef<HTMLDivElement>(null);
    const dropdownId = useUniqueId('calender');
    const calendarDescriptionId = useUniqueId('calendar-description-');
    const mergedRef = useMergeRefs(rootRef, __internalRootRef);

    useFocusTracker({ rootRef, onBlur, onFocus });

    const onDropdownCloseHandler = useCallback(() => setIsDropDownOpen(false), [setIsDropDownOpen]);

    const onButtonClickHandler = () => {
      if (!isDropDownOpen) {
        setIsDropDownOpen(true);
      }
    };

    const onWrapperKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode === KeyCode.escape && isDropDownOpen) {
        event.stopPropagation();
        buttonRef.current?.focus();
        setIsDropDownOpen(false);
      }
    };

    const onInputChangeHandler: InputProps['onChange'] = event => {
      fireNonCancelableEvent(onChange, { value: event.detail.value });
    };

    const onInputBlurHandler: InputProps['onBlur'] = () => {
      if (!isDropDownOpen) {
        setIsDropDownOpen(false);
      }
    };

    // Set displayed date to value if defined or to current date otherwise.
    const parsedValue = value && value.length >= 4 ? parseDate(value) : null;
    const baseDate = parsedValue || new Date();

    const hasFullValue = isValidFullDate({ date: value, granularity });

    const buttonAriaLabel =
      openCalendarAriaLabel &&
      openCalendarAriaLabel(
        hasFullValue && parsedValue
          ? getSelectedDateLabel({ date: parsedValue, granularity, locale: normalizedLocale })
          : null
      );

    const trigger = (
      <div className={styles['date-picker-trigger']}>
        <div className={styles['date-picker-input']}>
          <InternalDateInput
            name={name}
            invalid={invalid}
            warning={warning}
            controlId={controlId}
            ariaLabelledby={ariaLabelledby}
            ariaDescribedby={ariaDescribedby}
            ariaLabel={ariaLabel}
            ariaRequired={ariaRequired}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onInputChangeHandler}
            onBlur={onInputBlurHandler}
            placeholder={placeholder}
            ref={internalInputRef}
            autoFocus={autoFocus}
            onFocus={onDropdownCloseHandler}
            granularity={granularity}
          />
        </div>
        <div>
          <InternalButton
            iconName="calendar"
            className={styles['open-calendar-button']}
            onClick={onButtonClickHandler}
            ref={buttonRef}
            ariaLabel={buttonAriaLabel}
            disabled={disabled || readOnly}
            formAction="none"
          />
        </div>
      </div>
    );

    baseProps.className = clsx(baseProps.className, styles.root, styles['date-picker-container']);

    return (
      <div {...baseProps} ref={mergedRef} onKeyDown={!disabled && !readOnly ? onWrapperKeyDownHandler : undefined}>
        {disabled || readOnly ? (
          trigger
        ) : (
          <Dropdown
            stretchWidth={true}
            stretchHeight={true}
            open={isDropDownOpen}
            onDropdownClose={onDropdownCloseHandler}
            trigger={trigger}
            expandToViewport={expandToViewport}
            scrollable={false}
            dropdownId={dropdownId}
          >
            {isDropDownOpen && (
              <FocusLock className={styles['focus-lock']} autoFocus={true}>
                <div tabIndex={0} className={styles.calendar} role="dialog">
                  <InternalCalendar
                    value={value}
                    onChange={e => {
                      fireNonCancelableEvent(onChange, e.detail);
                      buttonRef?.current?.focus();
                      setIsDropDownOpen(false);
                    }}
                    locale={normalizedLocale}
                    startOfWeek={startOfWeek}
                    ariaDescribedby={calendarDescriptionId}
                    ariaLabel={ariaLabel}
                    ariaLabelledby={ariaLabelledby}
                    granularity={granularity}
                    isDateEnabled={isDateEnabled}
                    dateDisabledReason={dateDisabledReason}
                    i18nStrings={{
                      ...i18nStrings,
                      todayAriaLabel: i18nStrings?.todayAriaLabel ?? todayAriaLabel,
                      nextMonthAriaLabel: i18nStrings?.nextMonthAriaLabel ?? nextMonthAriaLabel,
                      previousMonthAriaLabel: i18nStrings?.previousMonthAriaLabel ?? previousMonthAriaLabel,
                    }}
                  />
                  <InternalLiveRegion id={calendarDescriptionId} hidden={true} tagName="span">
                    {getBaseDateLabel({ date: baseDate, granularity, locale: normalizedLocale })}
                  </InternalLiveRegion>
                </div>
              </FocusLock>
            )}
          </Dropdown>
        )}
      </div>
    );
  }
);

applyDisplayName(DatePicker, 'DatePicker');
export default DatePicker;
