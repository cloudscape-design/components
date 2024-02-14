// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { addMonths, addYears, isSameDay, isSameMonth, isSameYear } from 'date-fns';
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
import { getBaseDay, getBaseMonth } from './utils/navigation';

import { useDateCache } from '../internal/hooks/use-date-cache/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { getDateLabel, renderMonthAndYear } from './utils/intl';
import useCalendarLabels from './use-calendar-labels';
import useCalendarGridContent from './use-calendar-grid-content.js';
import useCalendarGridKeyboardNavigation from './use-calendar-grid-keyboard-navigation.js';

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
  granularity = 'day',
  previousMonthAriaLabel,
  nextMonthAriaLabel,
  todayAriaLabel,
  ...rest
}: CalendarProps & InternalBaseComponentProps) {
  checkControlled('Calendar', 'value', value, 'onChange', onChange);

  const baseProps = getBaseProps(rest);
  const normalizedLocale = normalizeLocale('Calendar', locale);

  const { previousButtonLabel, nextButtonLabel, currentDateLabel } = useCalendarLabels({
    granularity,
    i18nStrings,
    previousMonthAriaLabel,
    nextMonthAriaLabel,
    todayAriaLabel,
  });

  const isMonthPicker = granularity === 'month';

  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const valueDateCache = useDateCache();
  const focusedDateCache = useDateCache();

  // Set displayed date to value if defined or to current date otherwise.
  const parsedValue = value && value.length >= 4 ? parseDate(value) : null;
  const memoizedValue = parsedValue ? valueDateCache(parsedValue) : null;
  const defaultDisplayedDate = memoizedValue ?? new Date();
  const [displayedDate, setDisplayedDate] = useState(defaultDisplayedDate);

  const baseDate = isMonthPicker
    ? getBaseMonth(displayedDate, isDateEnabled)
    : getBaseDay(displayedDate, isDateEnabled);

  const { header, rows } = useCalendarGridContent({ baseDate, granularity, startOfWeek, locale: normalizedLocale });

  const belongsToCurrentPage = (date: Date) => isSamePage(date, baseDate);

  const headingId = useUniqueId('calendar-heading');

  // Update displayed date if value changes.
  useEffect(() => {
    memoizedValue && setDisplayedDate(prev => (prev.getTime() !== memoizedValue.getTime() ? memoizedValue : prev));
  }, [memoizedValue]);

  const isSamePage = isMonthPicker ? isSameYear : isSameMonth;

  const selectFocusedDate = (selected: Date | null, baseDate: Date): Date | null => {
    if (selected && isDateEnabled(selected) && isSamePage(selected, baseDate)) {
      return selected;
    }
    const today = new Date();
    if (isDateEnabled(today) && isSamePage(today, baseDate)) {
      return today;
    }
    if (isDateEnabled(baseDate)) {
      return baseDate;
    }
    return null;
  };

  const focusableDate = focusedDate || selectFocusedDate(memoizedValue, baseDate);

  const onHeaderChangePageHandler = (amount: number) => {
    const movePage = isMonthPicker ? addYears : addMonths;
    const newDate = movePage(baseDate, amount);
    onChangePageHandler(newDate);
  };

  const onChangePageHandler = (newMonth: Date) => {
    setDisplayedDate(newMonth);
    setFocusedDate(null);
  };

  const onGridFocusDateHandler = (date: null | Date) => {
    if (date) {
      setFocusedDate(date ? focusedDateCache(date) : null);
    }
  };

  const onGridSelectDateHandler = (date: Date) => {
    fireNonCancelableEvent(onChange, { value: formatDate(date, granularity) });
    setFocusedDate(null);
  };

  const onGridBlur = (event: React.FocusEvent) => {
    const newFocusTargetIsInGrid = event.relatedTarget && gridWrapperRef.current?.contains(event.relatedTarget as Node);
    if (!newFocusTargetIsInGrid) {
      setFocusedDate(null);
    }
  };

  const onGridKeyDownHandler = useCalendarGridKeyboardNavigation({
    belongsToCurrentPage,
    focusableDate,
    granularity,
    isDateEnabled,
    onChangePage: onChangePageHandler,
    onFocusDate: onGridFocusDateHandler,
    onSelectDate: onGridSelectDateHandler,
  });

  const isActive = (date: Date) => isMonthPicker || isSameMonth(date, baseDate);

  const renderDate = (date: Date) =>
    isMonthPicker ? date.toLocaleString(normalizedLocale, { month: 'short' }) : date.getDate().toString();

  const renderDateAnnouncement = (date: Date, isCurrentDate: boolean) => {
    const formattedDate = isMonthPicker
      ? renderMonthAndYear(normalizedLocale, date)
      : getDateLabel(normalizedLocale, date, 'short');
    if (isCurrentDate && currentDateLabel) {
      return formattedDate + '. ' + currentDateLabel;
    }
    return formattedDate;
  };

  const isSameDate = isMonthPicker ? isSameMonth : isSameDay;

  const headerText = isMonthPicker ? baseDate.getFullYear().toString() : renderMonthAndYear(normalizedLocale, baseDate);

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
            header={header}
            rows={rows}
            isActive={isActive}
            renderDate={renderDate}
            renderDateAnnouncement={renderDateAnnouncement}
            isSameDate={isSameDate}
            onGridKeyDownHandler={onGridKeyDownHandler}
          />
        </div>
      </div>
    </div>
  );
}
