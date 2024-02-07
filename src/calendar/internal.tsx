// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { isSameMonth } from 'date-fns';
import styles from './styles.css.js';
import CalendarHeader from './header';
import Grid from './grid';
import { normalizeLocale, normalizeStartOfWeek } from '../internal/utils/locale';
import { formatDate, parseDate } from '../internal/utils/date-time';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import checkControlled from '../internal/hooks/check-controlled/index.js';
import clsx from 'clsx';
import { CalendarProps } from './interfaces.js';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { getBaseDate } from './utils/navigation';
import { useDateCache } from '../internal/hooks/use-date-cache/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { useInternalI18n } from '../i18n/context.js';
import { getCalendarMonth } from 'mnth';
import { renderDayName } from './utils/intl.js';
import ScreenreaderOnly from '../internal/components/screenreader-only/index.js';

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
  granularity,
  ...rest
}: CalendarProps & InternalBaseComponentProps) {
  checkControlled('Calendar', 'value', value, 'onChange', onChange);

  const baseProps = getBaseProps(rest);
  const normalizedLocale = normalizeLocale('Calendar', locale);
  const normalizedStartOfWeek = normalizeStartOfWeek(startOfWeek, normalizedLocale);
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

  const i18n = useInternalI18n('calendar');

  const isMonthPicker = granularity === 'month';

  const previousLabel = isMonthPicker
    ? i18n('previousYearAriaLabel', i18nStrings?.previousYearAriaLabel)
    : i18n('previousMonthAriaLabel', i18nStrings?.previousMonthAriaLabel || rest.previousMonthAriaLabel);

  const nextLabel = isMonthPicker
    ? i18n('nextYearAriaLabel', i18nStrings?.nextYearAriaLabel)
    : i18n('nextMonthAriaLabel', i18nStrings?.nextMonthAriaLabel || rest.nextMonthAriaLabel);

  const currentLabel = isMonthPicker
    ? i18n('currentMonthAriaLabel', i18nStrings?.currentMonthAriaLabel)
    : i18n('todayAriaLabel', i18nStrings?.todayAriaLabel || rest.todayAriaLabel);

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

  const baseDate = getBaseDate(displayedDate, isDateEnabled);
  const focusableDate = focusedDate || selectFocusedDate(memoizedValue, baseDate);

  const onHeaderChangePageHandler = (date: Date) => {
    setDisplayedDate(date);
    setFocusedDate(null);
  };

  const onGridChangeMonthHandler = (newMonth: Date) => {
    setDisplayedDate(newMonth);
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

  const rows = useMemo<Date[][]>(
    () =>
      isMonthPicker
        ? new Array(4).fill(0).map((_, i: number) =>
            new Array(3).fill(0).map((_, j: number) => {
              const d = new Date(baseDate);
              d.setMonth(i * 3 + j);
              return d;
            })
          )
        : getCalendarMonth(baseDate, { firstDayOfWeek: normalizedStartOfWeek }),
    [baseDate, isMonthPicker, normalizedStartOfWeek]
  );

  const header = isMonthPicker ? null : (
    <thead>
      <tr>
        {rows[0]
          .map(date => date.getDay())
          .map(dayIndex => (
            <th
              key={dayIndex}
              scope="col"
              className={clsx(styles['calendar-grid-cell'], styles['calendar-day-header'])}
            >
              <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
              <ScreenreaderOnly>{renderDayName(locale, dayIndex, 'long')}</ScreenreaderOnly>
            </th>
          ))}
      </tr>
    </thead>
  );

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
          baseDate={baseDate}
          locale={normalizedLocale}
          onChange={onHeaderChangePageHandler}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          headingId={headingId}
          granularity={granularity}
        />
        <div onBlur={onGridBlur} ref={gridWrapperRef}>
          <Grid
            locale={normalizedLocale}
            baseDate={baseDate}
            isDateEnabled={isDateEnabled}
            focusedDate={focusedDate}
            focusableDate={focusableDate}
            onSelectDate={onGridSelectDateHandler}
            onFocusDate={onGridFocusDateHandler}
            onChangeMonth={onGridChangeMonthHandler}
            startOfWeek={normalizedStartOfWeek}
            todayAriaLabel={currentLabel}
            selectedDate={memoizedValue}
            ariaLabelledby={headingId}
            granularity={granularity}
            header={header}
            rows={rows}
          />
        </div>
      </div>
    </div>
  );
}
