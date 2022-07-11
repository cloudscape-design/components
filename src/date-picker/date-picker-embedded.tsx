// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { DatePickerProps } from './interfaces';
import Calendar from './calendar';
import { memoizedDate } from './calendar/utils/date';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { UseDatePicker } from './use-date-picker';

export { DatePickerProps };

const DatePickerEmbedded = React.forwardRef(
  ({
    locale = '',
    startOfWeek,
    isDateEnabled,
    nextMonthAriaLabel,
    previousMonthAriaLabel,
    todayAriaLabel,
    value,
    ...rest
  }: DatePickerProps) => {
    const {
      normalizedLocale,
      normalizedStartOfWeek,
      displayedDate,
      selectedDate,
      focusedDate,
      calendarHasFocus,
      onChangeMonthHandler,
      onSelectDateHandler,
      onDateFocusHandler,
    } = UseDatePicker({
      locale,
      startOfWeek,
      value,
    });
    const { __internalRootRef } = useBaseComponent('DatePickerEmbedded');

    const baseProps = getBaseProps(rest);

    const rootRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(rootRef, __internalRootRef);

    return (
      <div {...baseProps} ref={mergedRef}>
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
      </div>
    );
  }
);

applyDisplayName(DatePickerEmbedded, 'DatePickerEmbedded');
export default DatePickerEmbedded;
