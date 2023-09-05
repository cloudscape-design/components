// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useCallback, useRef, useState } from 'react';
import styles from './styles.css.js';
import { DatePickerProps } from './interfaces';
import InternalCalendar from '../calendar/internal';
import { normalizeLocale } from '../internal/utils/locale';
import { getDateLabel, renderMonthAndYear } from '../calendar/utils/intl';
import { InputProps } from '../input/interfaces';
import { KeyCode } from '../internal/keycode';
import { fireNonCancelableEvent } from '../internal/events';
import Dropdown from '../internal/components/dropdown';
import InternalDateInput from '../date-input/internal';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import checkControlled from '../internal/hooks/check-controlled';
import { useFocusTracker } from '../internal/hooks/use-focus-tracker.js';
import useForwardFocus from '../internal/hooks/forward-focus';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import FocusLock from '../internal/components/focus-lock';
import { parseDate } from '../internal/utils/date-time';
import LiveRegion from '../internal/components/live-region';
import { useFormFieldContext } from '../contexts/form-field.js';
import { useLocale } from '../i18n/context.js';

export { DatePickerProps };

const DatePicker = React.forwardRef(
  (
    {
      locale = '',
      startOfWeek,
      isDateEnabled,
      nextMonthAriaLabel,
      previousMonthAriaLabel,
      todayAriaLabel,
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
      openCalendarAriaLabel,
      expandToViewport,
      ...restProps
    }: DatePickerProps,
    ref: Ref<DatePickerProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('DatePicker');
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

    const trigger = (
      <div className={styles['date-picker-trigger']}>
        <div className={styles['date-picker-input']}>
          <InternalDateInput
            name={name}
            invalid={invalid}
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
          />
        </div>
        <div>
          <InternalButton
            iconName="calendar"
            className={styles['open-calendar-button']}
            onClick={onButtonClickHandler}
            ref={buttonRef}
            ariaLabel={
              openCalendarAriaLabel &&
              openCalendarAriaLabel(value.length === 10 ? getDateLabel(normalizedLocale, parsedValue!) : null)
            }
            disabled={disabled || readOnly}
            formAction="none"
          />
        </div>
      </div>
    );

    baseProps.className = clsx(baseProps.className, styles.root, styles['date-picker-container']);

    const handleMouseDown = (event: React.MouseEvent) => {
      // prevent currently focused element from losing it
      event.preventDefault();
    };

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
            onMouseDown={handleMouseDown}
            trigger={trigger}
            expandToViewport={expandToViewport}
            scrollable={false}
            dropdownId={dropdownId}
          >
            {isDropDownOpen && (
              <FocusLock className={styles['focus-lock']} autoFocus={true}>
                <div tabIndex={0} className={styles.calendar} role="dialog" aria-modal="true">
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
                    isDateEnabled={isDateEnabled}
                    todayAriaLabel={todayAriaLabel}
                    nextMonthAriaLabel={nextMonthAriaLabel}
                    previousMonthAriaLabel={previousMonthAriaLabel}
                  />
                  <LiveRegion id={calendarDescriptionId}>{renderMonthAndYear(normalizedLocale, baseDate)}</LiveRegion>
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
