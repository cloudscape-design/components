// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { addMonths, endOfDay, isBefore, startOfDay, startOfMonth, isAfter, isSameMonth } from 'date-fns';
import styles from '../styles.css.js';
import { BaseComponentProps } from '../../internal/base-component';
import { Focusable, RangeCalendarI18nStrings, RangeCalendarValue } from '../interfaces';
import CalendarHeader from './header';
import { Grids, selectFocusedDate } from './grids';
import { TimeInputProps } from '../../time-input/interfaces';
import clsx from 'clsx';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { getDateLabel, renderTimeLabel } from '../../calendar/utils/intl';
import LiveRegion from '../../internal/components/live-region';
import { normalizeLocale, normalizeStartOfWeek } from '../../calendar/utils/locales';
import { joinDateTime, parseDate } from '../../internal/utils/date-time';
import { getBaseDate } from '../../calendar/utils/navigation';
import { useMobile } from '../../internal/hooks/use-mobile/index.js';
import RangeInputs from './range-inputs.js';
import { getFirstFocusable } from '../../internal/components/focus-lock/utils.js';
import { useDateTime } from './use-date-time.js';

export interface DateRangePickerCalendarProps extends BaseComponentProps {
  value: null | RangeCalendarValue;
  onChange: (value: RangeCalendarValue) => void;
  locale?: string;
  startOfWeek?: number;
  isDateEnabled?: (date: Date) => boolean;
  i18nStrings: RangeCalendarI18nStrings;
  dateOnly?: boolean;
  timeInputFormat?: TimeInputProps.Format;
}

export default forwardRef(DateRangePickerCalendar);

function DateRangePickerCalendar(
  {
    value,
    onChange,
    locale = '',
    startOfWeek,
    isDateEnabled = () => true,
    i18nStrings,
    dateOnly = false,
    timeInputFormat = 'hh:mm:ss',
  }: DateRangePickerCalendarProps,
  ref: React.Ref<Focusable>
) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isSingleGrid = useMobile();

  const normalizedLocale = normalizeLocale('DateRangePicker', locale);
  const normalizedStartOfWeek = normalizeStartOfWeek(startOfWeek, normalizedLocale);

  useImperativeHandle(ref, () => ({
    focus() {
      if (elementRef.current) {
        getFirstFocusable(elementRef.current).focus();
      }
    },
  }));

  const initialStartDate = value?.startDate ?? '';
  const initialEndDate = value?.endDate ?? '';
  const [initialStartDateString = '', initialStartTimeString = ''] = initialStartDate.split('T');
  const [initialEndDateString = '', initialEndTimeString = ''] = initialEndDate.split('T');

  const rangeStart = useDateTime(initialStartDateString, initialStartTimeString);
  const rangeEnd = useDateTime(initialEndDateString, initialEndTimeString);

  const [announcement, setAnnouncement] = useState('');

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (rangeStart.dateString) {
      const startDate = parseDate(rangeStart.dateString);
      if (isSingleGrid) {
        return startOfMonth(startDate);
      }
      return startOfMonth(addMonths(startDate, 1));
    }
    if (rangeEnd.dateString) {
      return startOfMonth(parseDate(rangeEnd.dateString));
    }
    return startOfMonth(Date.now());
  });

  const [focusedDate, setFocusedDate] = useState<Date | null>(() => {
    if (rangeStart.date) {
      if (isSameMonth(rangeStart.date, currentMonth)) {
        return rangeStart.date;
      }
      if (!isSingleGrid && isSameMonth(rangeStart.date, addMonths(currentMonth, -1))) {
        return rangeStart.date;
      }
    }
    return selectFocusedDate(rangeStart.date, currentMonth, isDateEnabled);
  });

  // This effect "synchronizes" the local state update back up to the parent component.
  useEffect(() => {
    const startDate = joinDateTime(rangeStart.dateString, rangeStart.timeString);
    const endDate = joinDateTime(rangeEnd.dateString, rangeEnd.timeString);

    if (startDate !== initialStartDate || endDate !== initialEndDate) {
      onChange({ startDate, endDate });
    }
  }, [
    rangeStart.dateString,
    rangeStart.timeString,
    rangeEnd.dateString,
    rangeEnd.timeString,
    initialStartDate,
    initialEndDate,
    onChange,
  ]);

  const onSelectDateHandler = (selectedDate: Date) => {
    // recommended to include the start/end time announced with the selection
    // because the user is not aware of the fact that a start/end time is also set as soon as they select a date
    const announceStart = (startDate: Date) => {
      return (
        i18nStrings.startDateLabel +
        ', ' +
        getDateLabel(normalizedLocale, startDate) +
        ', ' +
        i18nStrings.startTimeLabel +
        ', ' +
        renderTimeLabel(normalizedLocale, startDate, timeInputFormat) +
        '. '
      );
    };

    const announceEnd = (endDate: Date) => {
      return (
        i18nStrings.endDateLabel +
        ', ' +
        getDateLabel(normalizedLocale, endDate) +
        ', ' +
        i18nStrings.endTimeLabel +
        ', ' +
        renderTimeLabel(normalizedLocale, endDate, timeInputFormat) +
        '. '
      );
    };

    const announceRange = (startDate: Date, endDate: Date) => {
      if (!i18nStrings.renderSelectedAbsoluteRangeAriaLive) {
        return `${getDateLabel(normalizedLocale, startDate)} – ${getDateLabel(normalizedLocale, endDate)}`;
      }
      return i18nStrings.renderSelectedAbsoluteRangeAriaLive(
        getDateLabel(normalizedLocale, startDate),
        getDateLabel(normalizedLocale, endDate)
      );
    };

    // If both fields are empty, we set the start date
    if (!rangeStart.dateString && !rangeEnd.dateString) {
      const startDate = startOfDay(selectedDate);
      rangeStart.setDate(startDate);
      setAnnouncement(announceStart(startDate));
      return;
    }

    // If both fields are set, we start new
    if (rangeStart.dateString && rangeEnd.dateString) {
      const startDate = startOfDay(selectedDate);
      rangeStart.setDate(startDate);
      rangeEnd.setDate(null);
      setAnnouncement(announceStart(startDate));
      return;
    }

    // If only the END date is empty, we fill it (and swap dates if needed)
    if (rangeStart.dateString && !rangeEnd.dateString) {
      const parsedStartDate = parseDate(rangeStart.dateString);

      if (isBefore(selectedDate, parsedStartDate)) {
        // The user has selected the range backwards, so we swap start and end

        const startDate = startOfDay(selectedDate);
        const endDate = endOfDay(parsedStartDate);

        rangeStart.setDate(startDate);
        rangeEnd.setDate(endDate);
        setAnnouncement(announceStart(startDate) + announceRange(startDate, endDate));
      } else {
        const endDate = endOfDay(selectedDate);
        rangeEnd.setDate(endDate);
        setAnnouncement(announceEnd(endDate) + announceRange(parsedStartDate, endDate));
      }
      return;
    }

    // If only the START date is empty, we fill it (and swap dates if needed)
    if (!rangeStart.dateString && rangeEnd.dateString) {
      const existingEndDate = parseDate(rangeEnd.dateString);

      if (isAfter(selectedDate, existingEndDate)) {
        // The user has selected the range backwards, so we swap start and end

        const startDate = startOfDay(existingEndDate);
        const endDate = endOfDay(selectedDate);

        rangeStart.setDate(startDate);
        rangeEnd.setDate(endDate);
        setAnnouncement(announceEnd(endDate) + announceRange(startDate, endDate));
      } else {
        const startDate = startOfDay(selectedDate);
        rangeStart.setDate(startDate);
        setAnnouncement(announceStart(startDate) + announceRange(startDate, existingEndDate));
      }
      return;
    }
    // All possible conditions are covered above
  };

  const onHeaderChangeMonthHandler = (newCurrentMonth: Date) => {
    setCurrentMonth(newCurrentMonth);

    const newBaseDateMonth = isSingleGrid ? newCurrentMonth : addMonths(newCurrentMonth, -1);
    const newBaseDate = getBaseDate(newBaseDateMonth, isDateEnabled);
    setFocusedDate(newBaseDate);
  };

  const onChangeStartDate = (value: string) => {
    rangeStart.setDateString(value);

    if (value.length >= 8) {
      const newCurrentMonth = startOfMonth(parseDate(value));
      setCurrentMonth(isSingleGrid ? newCurrentMonth : addMonths(newCurrentMonth, 1));
    }
  };

  const onChangeEndDate = (value: string) => {
    rangeEnd.setDateString(value);
  };

  const headingIdPrefix = useUniqueId('date-range-picker-calendar-heading');
  return (
    <>
      <div
        className={clsx(styles['calendar-container'], {
          [styles['one-grid']]: isSingleGrid,
        })}
      >
        <div
          ref={elementRef}
          className={clsx(styles.calendar, {
            [styles['one-grid']]: isSingleGrid,
          })}
        >
          <CalendarHeader
            baseDate={currentMonth}
            locale={normalizedLocale}
            onChangeMonth={onHeaderChangeMonthHandler}
            previousMonthLabel={i18nStrings.previousMonthAriaLabel}
            nextMonthLabel={i18nStrings.nextMonthAriaLabel}
            isSingleGrid={isSingleGrid}
            headingIdPrefix={headingIdPrefix}
          />

          <Grids
            isSingleGrid={isSingleGrid}
            locale={normalizedLocale}
            baseDate={currentMonth}
            focusedDate={focusedDate}
            onFocusedDateChange={setFocusedDate}
            isDateEnabled={isDateEnabled}
            onSelectDate={onSelectDateHandler}
            onChangeMonth={setCurrentMonth}
            startOfWeek={normalizedStartOfWeek}
            todayAriaLabel={i18nStrings.todayAriaLabel}
            selectedStartDate={rangeStart.date}
            selectedEndDate={rangeEnd.date}
            headingIdPrefix={headingIdPrefix}
          />
        </div>

        <RangeInputs
          startDate={rangeStart.dateString}
          onChangeStartDate={onChangeStartDate}
          startTime={rangeStart.timeString}
          onChangeStartTime={rangeStart.setTimeString}
          endDate={rangeEnd.dateString}
          onChangeEndDate={onChangeEndDate}
          endTime={rangeEnd.timeString}
          onChangeEndTime={rangeEnd.setTimeString}
          i18nStrings={i18nStrings}
          dateOnly={dateOnly}
          timeInputFormat={timeInputFormat}
        />
      </div>
      <LiveRegion className={styles['calendar-aria-live']}>{announcement}</LiveRegion>
    </>
  );
}
