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
import { normalizeLocale, normalizeStartOfWeek } from '../../internal/utils/locale';
import { formatDate, formatTime, joinDateTime, parseDate } from '../../internal/utils/date-time';
import { getBaseDate } from '../../calendar/utils/navigation';
import { useMobile } from '../../internal/hooks/use-mobile/index.js';
import RangeInputs from './range-inputs.js';

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
        const prevButton = elementRef.current.getElementsByClassName(styles['calendar-prev-month-btn'])[0];
        (prevButton as undefined | HTMLButtonElement)?.focus();
      }
    },
  }));

  const initialStartDate = value?.startDate ?? '';
  const initialEndDate = value?.endDate ?? '';
  const [initialStartDateString = '', initialStartTimeString = ''] = initialStartDate.split('T');
  const [initialEndDateString = '', initialEndTimeString = ''] = initialEndDate.split('T');

  const [startDateString, setStartDateString] = useState(initialStartDateString);
  const [startTimeString, setStartTimeString] = useState(initialStartTimeString);

  const [endDateString, setEndDateString] = useState(initialEndDateString);
  const [endTimeString, setEndTimeString] = useState(initialEndTimeString);

  const selectedStartDate = parseDate(startDateString, true);
  const selectedEndDate = parseDate(endDateString, true);

  const [announcement, setAnnouncement] = useState('');

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (startDateString) {
      const startDate = parseDate(startDateString);
      if (isSingleGrid) {
        return startOfMonth(startDate);
      }
      return startOfMonth(addMonths(startDate, 1));
    }
    if (endDateString) {
      return startOfMonth(parseDate(endDateString));
    }
    return startOfMonth(Date.now());
  });

  const [focusedDate, setFocusedDate] = useState<Date | null>(() => {
    if (selectedStartDate) {
      if (isSameMonth(selectedStartDate, currentMonth)) {
        return selectedStartDate;
      }
      if (!isSingleGrid && isSameMonth(selectedStartDate, addMonths(currentMonth, -1))) {
        return selectedStartDate;
      }
    }
    return selectFocusedDate(selectedStartDate, currentMonth, isDateEnabled);
  });

  // This effect "synchronizes" the local state update back up to the parent component.
  useEffect(() => {
    const startDate = joinDateTime(startDateString, startTimeString);
    const endDate = joinDateTime(endDateString, endTimeString);

    if (startDate !== initialStartDate || endDate !== initialEndDate) {
      onChange({ startDate, endDate });
    }
  }, [startDateString, startTimeString, endDateString, endTimeString, onChange, initialStartDate, initialEndDate]);

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
    if (!startDateString && !endDateString) {
      const startDate = startOfDay(selectedDate);
      setStartDateString(formatDate(startDate));
      setStartTimeString(formatTime(startDate));
      setAnnouncement(announceStart(startDate));
      return;
    }

    // If both fields are set, we start new
    if (startDateString && endDateString) {
      const startDate = startOfDay(selectedDate);
      setStartDateString(formatDate(startDate));
      setStartTimeString(formatTime(startDate));

      setEndDateString('');
      setEndTimeString('');
      setAnnouncement(announceStart(startDate));
      return;
    }

    // If only the END date is empty, we fill it (and swap dates if needed)
    if (startDateString && !endDateString) {
      const parsedStartDate = parseDate(startDateString);

      if (isBefore(selectedDate, parsedStartDate)) {
        // The user has selected the range backwards, so we swap start and end

        const startDate = startOfDay(selectedDate);
        const endDate = endOfDay(parsedStartDate);

        setStartDateString(formatDate(startDate));
        setStartTimeString(formatTime(startDate));

        setEndDateString(formatDate(endDate));
        setEndTimeString(formatTime(endDate));
        setAnnouncement(announceStart(startDate) + announceRange(startDate, endDate));
      } else {
        const endDate = endOfDay(selectedDate);
        setEndDateString(formatDate(endDate));
        setEndTimeString(formatTime(endDate));
        setAnnouncement(announceEnd(endDate) + announceRange(parsedStartDate, endDate));
      }
      return;
    }

    // If only the START date is empty, we fill it (and swap dates if needed)
    if (!startDateString && endDateString) {
      const existingEndDate = parseDate(endDateString);

      if (isAfter(selectedDate, existingEndDate)) {
        // The user has selected the range backwards, so we swap start and end

        const startDate = startOfDay(existingEndDate);
        const endDate = endOfDay(selectedDate);

        setStartDateString(formatDate(startDate));
        setStartTimeString(formatTime(startDate));

        setEndDateString(formatDate(endDate));
        setEndTimeString(formatTime(endDate));
        setAnnouncement(announceEnd(endDate) + announceRange(startDate, endDate));
      } else {
        const startDate = startOfDay(selectedDate);
        setStartDateString(formatDate(startDate));
        setStartTimeString(formatTime(startDate));
        setAnnouncement(announceStart(startDate) + announceRange(startDate, existingEndDate));
      }
      return;
    }
    // All possible conditions are covered above
  };

  const onHeaderChangeMonthHandler = (isPrevious?: boolean) => {
    const newCurrentMonth = addMonths(currentMonth, isPrevious ? -1 : 1);
    setCurrentMonth(newCurrentMonth);

    const newBaseDateMonth = isSingleGrid ? newCurrentMonth : addMonths(newCurrentMonth, -1);
    const newBaseDate = getBaseDate(newBaseDateMonth, isDateEnabled);
    setFocusedDate(newBaseDate);
  };

  const onChangeStartDate = (value: string) => {
    setStartDateString(value);

    if (value.length >= 8) {
      const newCurrentMonth = startOfMonth(parseDate(value));
      setCurrentMonth(isSingleGrid ? newCurrentMonth : addMonths(newCurrentMonth, 1));
    }
  };

  const onChangeEndDate = (value: string) => {
    setEndDateString(value);
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
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            headingIdPrefix={headingIdPrefix}
          />
        </div>

        <RangeInputs
          startDate={startDateString}
          onChangeStartDate={onChangeStartDate}
          startTime={startTimeString}
          onChangeStartTime={setStartTimeString}
          endDate={endDateString}
          onChangeEndDate={onChangeEndDate}
          endTime={endTimeString}
          onChangeEndTime={setEndTimeString}
          i18nStrings={i18nStrings}
          dateOnly={dateOnly}
          timeInputFormat={timeInputFormat}
        />
      </div>
      <LiveRegion className={styles['calendar-aria-live']}>{announcement}</LiveRegion>
    </>
  );
}
