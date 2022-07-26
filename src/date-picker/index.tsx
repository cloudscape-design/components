// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useCallback, useRef, useState } from 'react';
import styles from './styles.css.js';
import { DatePickerProps } from './interfaces';
import Calendar, { DayIndex } from './calendar';
import { normalizeLocale } from './calendar/utils/locales';
import { getDateLabel } from './calendar/utils/intl';
import { displayToIso, isoToDisplay, memoizedDate } from './calendar/utils/date';
import { InputProps } from '../input/interfaces';
import { KeyCode } from '../internal/keycode';
import { fireNonCancelableEvent } from '../internal/events';
import Dropdown from '../internal/components/dropdown';
import DateInput from '../internal/components/date-input';
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
import TabTrap from '../internal/components/tab-trap';
import { useDatePicker } from './use-date-picker.js';

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
      ariaLabelledby,
      ariaDescribedby,
      controlId,
      invalid,
      openCalendarAriaLabel,
      expandToViewport,
      ...rest
    }: DatePickerProps,
    ref: Ref<DatePickerProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('DatePicker');

    const {
      defaultDisplayedDate,
      displayedDate,
      setDisplayedDate,
      selectedDate,
      onChangeMonthHandler,
      onSelectDateHandler,
    } = useDatePicker({
      value,
      onChange,
    });

    const baseProps = getBaseProps(rest);
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
    const normalizedLocale = normalizeLocale('DatePicker', locale ?? '');

    const internalInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<ButtonProps.Ref>(null);
    useForwardFocus(ref, internalInputRef);

    const rootRef = useRef<HTMLDivElement>(null);
    const dropdownId = useUniqueId('calender');
    const mergedRef = useMergeRefs(rootRef, __internalRootRef);

    useFocusTracker({ rootRef, onBlur, onFocus, viewportId: expandToViewport ? dropdownId : '' });

    const onDropdownCloseHandler = useCallback(() => {
      setDisplayedDate(defaultDisplayedDate);
      setIsDropDownOpen(false);
    }, [defaultDisplayedDate, setDisplayedDate, setIsDropDownOpen]);

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
      const isoDateString = displayToIso(event.detail.value);
      fireNonCancelableEvent(onChange, { value: isoDateString });
    };

    const onInputBlurHandler: InputProps['onBlur'] = () => {
      if (!isDropDownOpen) {
        setDisplayedDate(defaultDisplayedDate);
        setIsDropDownOpen(false);
      }
    };

    const DateInputElement = (
      <div className={styles['date-picker-trigger']}>
        <div className={styles['date-picker-input']}>
          <DateInput
            name={name}
            invalid={invalid}
            controlId={controlId}
            ariaLabelledby={ariaLabelledby}
            ariaDescribedby={ariaDescribedby}
            ariaLabel={ariaLabel}
            ariaRequired={ariaRequired}
            value={isoToDisplay(value)}
            autoComplete={false}
            disableBrowserAutocorrect={true}
            disableAutocompleteOnBlur={isDropDownOpen}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onInputChangeHandler}
            onBlur={onInputBlurHandler}
            placeholder={placeholder}
            ref={internalInputRef}
            autoFocus={autoFocus}
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
              openCalendarAriaLabel(
                value.length === 10 ? getDateLabel(normalizedLocale, memoizedDate('value', value)) : null
              )
            }
            disabled={disabled || readOnly}
            formAction="none"
          />
        </div>
      </div>
    );

    baseProps.className = clsx(baseProps.className, styles.root, styles['date-picker-container']);

    if (readOnly || disabled) {
      return <div {...baseProps}>{DateInputElement}</div>;
    }

    checkControlled('DatePicker', 'value', value, 'onChange', onChange);

    const handleMouseDown = (event: React.MouseEvent) => {
      // prevent currently focused element from losing it
      event.preventDefault();
    };

    return (
      <div {...baseProps} ref={mergedRef} onKeyDown={onWrapperKeyDownHandler}>
        <Dropdown
          stretchWidth={true}
          stretchHeight={true}
          open={isDropDownOpen}
          onDropdownClose={onDropdownCloseHandler}
          onMouseDown={handleMouseDown}
          trigger={DateInputElement}
          expandToViewport={expandToViewport}
          scrollable={false}
          dropdownId={dropdownId}
        >
          {isDropDownOpen && (
            <FocusLock autoFocus={true}>
              <Calendar
                selectedDate={memoizedDate('value', selectedDate)}
                displayedDate={memoizedDate('displayed', displayedDate)}
                locale={normalizedLocale}
                startOfWeek={normalizedStartOfWeek}
                isDateEnabled={isDateEnabled ? isDateEnabled : () => true}
                nextMonthLabel={nextMonthAriaLabel}
                previousMonthLabel={previousMonthAriaLabel}
                todayAriaLabel={todayAriaLabel}
                onChangeMonth={e => {
                  onChangeMonthHandler(e);
                }}
                onSelectDate={e => {
                  onSelectDateHandler(e);
                  buttonRef?.current?.focus();
                  setIsDropDownOpen(false);
                }}
              />
            </FocusLock>
          )}
        </Dropdown>
      </div>
    );
  }
);

applyDisplayName(DatePicker, 'DatePicker');
export default DatePicker;
