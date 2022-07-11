// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { Ref, useCallback, useRef, useState } from 'react';
import { getWeekStartByLocale } from 'weekstart';
import styles from './styles.css.js';
import { DatePickerProps } from './interfaces';
import Calendar, { DayIndex } from './calendar';
import { normalizeLocale } from './calendar/utils/locales';
import { getDateLabel } from './calendar/utils/intl';
import { CalendarTypes } from './calendar/definitions';
import { displayToIso, formatDate, isoToDisplay, memoizedDate } from './calendar/utils/date';
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
import { usePrevious } from '../internal/hooks/use-previous';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import TabTrap from '../internal/components/tab-trap';

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

    const baseProps = getBaseProps(rest);
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
    const [calendarHasFocus, setCalendarHasFocus] = useState<boolean>(false);
    const normalizedLocale = normalizeLocale('DatePicker', locale ?? '');
    const normalizedStartOfWeek = (
      typeof startOfWeek === 'number' ? startOfWeek : getWeekStartByLocale(normalizedLocale)
    ) as DayIndex;

    const defaultSelectedDate = value.length >= 10 ? value : null;
    const [selectedDate, setSelectedDate] = useState<string | null>(defaultSelectedDate);

    const defaultDisplayedDate = value.length >= 10 ? value : formatDate(new Date());
    const [displayedDate, setDisplayedDate] = useState<string>(defaultDisplayedDate);
    const [focusedDate, setFocusedDate] = useState<string | null>(null);

    const internalInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<ButtonProps.Ref>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    useForwardFocus(ref, internalInputRef);

    const rootRef = useRef<HTMLDivElement>(null);
    const dropdownId = useUniqueId('calender');
    const mergedRef = useMergeRefs(rootRef, __internalRootRef);

    useFocusTracker({ rootRef, onBlur, onFocus, viewportId: expandToViewport ? dropdownId : '' });

    const onChangeMonthHandler = (newMonth: Date) => {
      setDisplayedDate(formatDate(newMonth));
      setFocusedDate(null);
    };

    const onSelectDateHandler = ({ date }: CalendarTypes.DateDetail) => {
      const formattedDate = formatDate(date);
      buttonRef.current?.focus();
      setIsDropDownOpen(false);
      setSelectedDate(formattedDate);
      setDisplayedDate(formattedDate);
      setCalendarHasFocus(false);
      setFocusedDate(null);
      fireNonCancelableEvent(onChange, { value: formattedDate });
    };

    const onDateFocusHandler = ({ date }: CalendarTypes.DateDetailNullable) => {
      if (date) {
        const value = formatDate(date);
        setFocusedDate(value);
      }
    };

    const onDropdownCloseHandler = useCallback(() => {
      setDisplayedDate(defaultDisplayedDate);
      setCalendarHasFocus(false);
      setIsDropDownOpen(false);
    }, [defaultDisplayedDate]);

    const onButtonClickHandler = () => {
      if (!isDropDownOpen) {
        setIsDropDownOpen(true);
        setCalendarHasFocus(true);
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
      if (!calendarHasFocus) {
        setDisplayedDate(defaultDisplayedDate);
        setIsDropDownOpen(false);
      }
    };

    const prevValue = usePrevious(value);
    if (prevValue !== value) {
      if (value === '' && selectedDate !== value) {
        setSelectedDate(value);
      }
      // update the displayedDate when inputValue changes in order to
      // display the correct month when the date picker gets open again.
      if (value.length >= 4 && displayedDate !== value) {
        setDisplayedDate(value);
      }
      // set the selected date only when a full date (yyyy-mm-dd) is entered
      if (value.length >= 10 && selectedDate !== value) {
        setSelectedDate(value);
      }
    }

    const focusCurrentDate = () =>
      (calendarRef.current?.querySelector(`.${styles['calendar-day-focusable']}`) as HTMLDivElement)?.focus();

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
            disableAutocompleteOnBlur={calendarHasFocus}
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
                getDateLabel(normalizedLocale, value.length === 10 ? memoizedDate('value', value) : null)
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
            <>
              {calendarHasFocus && <TabTrap focusNextCallback={focusCurrentDate} />}
              <Calendar
                ref={calendarRef}
                selectedDate={memoizedDate('value', selectedDate)}
                focusedDate={memoizedDate('focused', focusedDate)}
                displayedDate={memoizedDate('displayed', displayedDate)}
                locale={normalizedLocale}
                startOfWeek={normalizedStartOfWeek}
                isDateEnabled={isDateEnabled ? isDateEnabled : () => true}
                calendarHasFocus={calendarHasFocus}
                nextMonthLabel={nextMonthAriaLabel}
                previousMonthLabel={previousMonthAriaLabel}
                todayAriaLabel={todayAriaLabel}
                onChangeMonth={onChangeMonthHandler}
                onSelectDate={onSelectDateHandler}
                onFocusDate={onDateFocusHandler}
              />
              {calendarHasFocus && <TabTrap focusNextCallback={() => calendarRef.current?.focus()} />}
            </>
          )}
        </Dropdown>
      </div>
    );
  }
);

applyDisplayName(DatePicker, 'DatePicker');
export default DatePicker;
