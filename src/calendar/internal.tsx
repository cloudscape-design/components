// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { addMonths, isSameDay, isSameMonth } from 'date-fns';
import styles from './styles.css.js';
import CalendarHeader from './header';
import Grid from './grid';
import { normalizeLocale } from '../internal/utils/locale';
import { formatDate, parseDate } from '../internal/utils/date-time';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import checkControlled from '../internal/hooks/check-controlled/index.js';
import clsx from 'clsx';
import { CalendarProps } from './interfaces.js';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { getBaseDay } from './utils/navigation';
import { useDateCache } from '../internal/hooks/use-date-cache/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import useCalendarLabels from './use-calendar-labels';
import useCalendarGridRows from './grid/use-calendar-grid-rows';
import useCalendarGridKeyboardNavigation from './grid/use-calendar-grid-keyboard-navigation';
import CalendarGridHeader from './grid/calendar-grid-header';

export default function Calendar({
  value,
  locale = '',
  startOfWeek,
  isDateEnabled = () => true,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  onChange,
  __internalRootRef,
  i18nStrings,
  previousMonthAriaLabel,
  nextMonthAriaLabel,
  todayAriaLabel,
  ...rest
}: CalendarProps & InternalBaseComponentProps) {
  checkControlled('Calendar', 'value', value, 'onChange', onChange);

  const baseProps = getBaseProps(rest);
  const normalizedLocale = normalizeLocale('Calendar', locale);

  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const valueDateCache = useDateCache();
  const focusedDateCache = useDateCache();

  // Set displayed date to value if defined or to current date otherwise.
  const parsedValue = value && value.length >= 4 ? parseDate(value) : null;
  const memoizedValue = parsedValue ? valueDateCache(parsedValue) : null;
  const defaultDisplayedDate = memoizedValue ?? new Date();
  const [displayedDate, setDisplayedDate] = useState(defaultDisplayedDate);

  const headingId = useUniqueId('calendar-heading');

  const baseDate = getBaseDay(displayedDate, isDateEnabled);

  const isCurrentPage = (date: Date) => isSameMonth(date, baseDate);

  const { previousButtonLabel, nextButtonLabel, renderDate, renderDateAnnouncement, renderHeaderText } =
    useCalendarLabels({
      i18nStrings,
      locale: normalizedLocale,
      previousMonthAriaLabel,
      nextMonthAriaLabel,
      todayAriaLabel,
    });

  const gridRows = useCalendarGridRows({ baseDate, startOfWeek, locale: normalizedLocale });

  // Update displayed date if value changes.
  useEffect(() => {
    memoizedValue && setDisplayedDate(prev => (prev.getTime() !== memoizedValue.getTime() ? memoizedValue : prev));
  }, [memoizedValue]);

  const selectFocusedDate = (selected: Date | null, baseDate: Date): Date | null => {
    if (selected && isDateEnabled(selected) && isSameMonth(selected, baseDate)) {
      return selected;
    }
    const today = new Date();
    if (isDateEnabled(today) && isSameMonth(today, baseDate)) {
      return today;
    }
    if (isDateEnabled(baseDate)) {
      return baseDate;
    }
    return null;
  };

  const focusableDate = focusedDate || selectFocusedDate(memoizedValue, baseDate);

  const onHeaderChangePageHandler = (amount: number) => {
    const newDate = addMonths(baseDate, amount);
    onChangePageHandler(newDate);
  };

  const onChangePageHandler = (newDate: Date) => {
    setDisplayedDate(newDate);
    setFocusedDate(null);
  };

  const onGridFocusDateHandler = (date: null | Date) => {
    if (date) {
      setFocusedDate(date ? focusedDateCache(date) : null);
    }
  };

  const onGridSelectDateHandler = (date: Date) => {
    fireNonCancelableEvent(onChange, { value: formatDate(date) });
    setFocusedDate(null);
  };

  const onGridBlur = (event: React.FocusEvent) => {
    const newFocusTargetIsInGrid = event.relatedTarget && gridWrapperRef.current?.contains(event.relatedTarget as Node);
    if (!newFocusTargetIsInGrid) {
      setFocusedDate(null);
    }
  };

  const onGridKeyDownHandler = useCalendarGridKeyboardNavigation({
    baseDate,
    focusableDate,
    isDateEnabled,
    onChangePage: onChangePageHandler,
    onFocusDate: onGridFocusDateHandler,
    onSelectDate: onGridSelectDateHandler,
  });

  const headerText = renderHeaderText(baseDate);

  return (
    <div
      ref={__internalRootRef}
      {...baseProps}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      className={clsx(styles.root, styles.calendar, baseProps.className)}
    >
      <div className={styles['calendar-inner']}>
        <CalendarHeader
          formattedDate={headerText}
          onChange={onHeaderChangePageHandler}
          previousLabel={previousButtonLabel}
          nextLabel={nextButtonLabel}
          headingId={headingId}
        />
        <div onBlur={onGridBlur} ref={gridWrapperRef}>
          <Grid
            isDateEnabled={isDateEnabled}
            focusedDate={focusedDate}
            focusableDate={focusableDate}
            onSelectDate={onGridSelectDateHandler}
            onFocusDate={onGridFocusDateHandler}
            onChangePage={onChangePageHandler}
            selectedDate={memoizedValue}
            ariaLabelledby={headingId}
            header={<CalendarGridHeader locale={normalizedLocale} rows={gridRows} />}
            rows={gridRows}
            isCurrentPage={isCurrentPage}
            renderDate={renderDate}
            renderDateAnnouncement={renderDateAnnouncement}
            isSameDate={isSameDay}
            onGridKeyDownHandler={onGridKeyDownHandler}
          />
        </div>
      </div>
    </div>
  );
}
