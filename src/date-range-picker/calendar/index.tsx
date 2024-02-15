// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { addMonths, endOfDay, isAfter, isBefore, isSameMonth, startOfDay, startOfMonth } from 'date-fns';
import styles from '../styles.css.js';
import SpaceBetween from '../../space-between/internal';
import { BaseComponentProps } from '../../internal/base-component';
import { DateRangePickerProps, RangeCalendarI18nStrings } from '../interfaces';
import CalendarHeader from './header';
import { Grids } from './grids';
import { TimeInputProps } from '../../time-input/interfaces';
import clsx from 'clsx';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { getDateLabel, renderTimeLabel } from '../../calendar/utils/intl';
import LiveRegion from '../../internal/components/live-region';
import { normalizeLocale, normalizeStartOfWeek } from '../../internal/utils/locale';
import { parseDate, splitDateTime, formatDateTime } from '../../internal/utils/date-time';
import { getBaseDay } from '../../calendar/utils/navigation';
import { useMobile } from '../../internal/hooks/use-mobile/index.js';
import RangeInputs from './range-inputs.js';
import { findDateToFocus, findMonthToDisplay } from './utils';
import { useInternalI18n } from '../../i18n/context.js';

export interface DateRangePickerCalendarProps extends BaseComponentProps {
  value: DateRangePickerProps.PendingAbsoluteValue;
  setValue: React.Dispatch<React.SetStateAction<DateRangePickerProps.PendingAbsoluteValue>>;
  locale?: string;
  startOfWeek?: number;
  isDateEnabled?: (date: Date) => boolean;
  i18nStrings?: RangeCalendarI18nStrings;
  dateOnly?: boolean;
  timeInputFormat?: TimeInputProps.Format;
  customAbsoluteRangeControl: DateRangePickerProps.AbsoluteRangeControl | undefined;
}

export default function DateRangePickerCalendar({
  value,
  setValue,
  locale = '',
  startOfWeek,
  isDateEnabled = () => true,
  i18nStrings,
  dateOnly = false,
  timeInputFormat = 'hh:mm:ss',
  customAbsoluteRangeControl,
}: DateRangePickerCalendarProps) {
  const isSingleGrid = useMobile();
  const normalizedLocale = normalizeLocale('DateRangePicker', locale);
  const normalizedStartOfWeek = normalizeStartOfWeek(startOfWeek, normalizedLocale);
  const i18n = useInternalI18n('date-range-picker');

  const [announcement, setAnnouncement] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => findMonthToDisplay(value, isSingleGrid));
  const [focusedDate, setFocusedDate] = useState<Date | null>(() => {
    if (value.start.date) {
      const startDate = parseDate(value.start.date);
      if (isSameMonth(startDate, currentMonth)) {
        return startDate;
      }
      if (!isSingleGrid && isSameMonth(startDate, addMonths(currentMonth, -1))) {
        return startDate;
      }
    }
    return findDateToFocus(parseDate(value.start.date), currentMonth, isDateEnabled);
  });

  const updateCurrentMonth = (startDate: string) => {
    if (startDate.length >= 8) {
      const newCurrentMonth = startOfMonth(parseDate(startDate));
      setCurrentMonth(isSingleGrid ? newCurrentMonth : addMonths(newCurrentMonth, 1));
    }
  };

  // recommended to include the start/end time announced with the selection
  // because the user is not aware of the fact that a start/end time is also set as soon as they select a date
  const announceStart = (startDate: Date) => {
    return (
      i18n('i18nStrings.startDateLabel', i18nStrings?.startDateLabel) +
      ', ' +
      getDateLabel(normalizedLocale, startDate) +
      ', ' +
      i18n('i18nStrings.startTimeLabel', i18nStrings?.startTimeLabel) +
      ', ' +
      renderTimeLabel(normalizedLocale, startDate, timeInputFormat) +
      '. '
    );
  };

  const announceEnd = (endDate: Date) => {
    return (
      i18n('i18nStrings.endDateLabel', i18nStrings?.endDateLabel) +
      ', ' +
      getDateLabel(normalizedLocale, endDate) +
      ', ' +
      i18n('i18nStrings.endTimeLabel', i18nStrings?.endTimeLabel) +
      ', ' +
      renderTimeLabel(normalizedLocale, endDate, timeInputFormat) +
      '. '
    );
  };

  const renderSelectedAbsoluteRangeAriaLive = i18n(
    'i18nStrings.renderSelectedAbsoluteRangeAriaLive',
    i18nStrings?.renderSelectedAbsoluteRangeAriaLive,
    format => (startDate, endDate) => format({ startDate, endDate })
  );

  const announceRange = (startDate: Date, endDate: Date) => {
    if (!renderSelectedAbsoluteRangeAriaLive) {
      return `${getDateLabel(normalizedLocale, startDate)} – ${getDateLabel(normalizedLocale, endDate)}`;
    }
    return renderSelectedAbsoluteRangeAriaLive(
      getDateLabel(normalizedLocale, startDate),
      getDateLabel(normalizedLocale, endDate)
    );
  };

  const onSelectDateHandler = (selectedDate: Date) => {
    const { start, end } = value;
    let newStart: Date | undefined = undefined;
    let newEnd: Date | null | undefined = undefined;
    let announcement = '';

    // If both fields are empty, we set the start date
    if (!start.date && !end.date) {
      newStart = startOfDay(selectedDate);
      announcement = announceStart(newStart);
    }
    // If both fields are set, we start new
    else if (start.date && end.date) {
      newStart = startOfDay(selectedDate);
      newEnd = null;
      announcement = announceStart(newStart);
    }
    // If only the END date is empty, we fill it (and swap dates if needed)
    else if (start.date && !end.date) {
      const parsedStartDate = parseDate(start.date);

      if (isBefore(selectedDate, parsedStartDate)) {
        // The user has selected the range backwards, so we swap start and end
        newStart = startOfDay(selectedDate);
        newEnd = endOfDay(parsedStartDate);
        announcement = announceStart(newStart) + announceRange(newStart, newEnd);
      } else {
        newEnd = endOfDay(selectedDate);
        announcement = announceEnd(newEnd) + announceRange(parsedStartDate, newEnd);
      }
    }
    // If only the START date is empty, we fill it (and swap dates if needed)
    else if (!start.date && end.date) {
      const existingEndDate = parseDate(end.date);

      if (isAfter(selectedDate, existingEndDate)) {
        // The user has selected the range backwards, so we swap start and end
        newStart = startOfDay(existingEndDate);
        newEnd = endOfDay(selectedDate);
        announcement = announceEnd(newEnd) + announceRange(newStart, newEnd);
      } else {
        newStart = startOfDay(selectedDate);
        announcement = announceStart(newStart) + announceRange(newStart, existingEndDate);
      }
    }

    const formatValue = (
      date: Date | null | undefined,
      previous: DateRangePickerProps.DateTimeStrings
    ): DateRangePickerProps.DateTimeStrings => {
      if (date === null) {
        // explicitly reset to empty
        return { date: '', time: '' };
      } else if (date === undefined) {
        // keep old value
        return previous;
      }
      return splitDateTime(formatDateTime(date));
    };

    setValue({
      start: formatValue(newStart, value.start),
      end: formatValue(newEnd, value.end),
    });
    setAnnouncement(announcement);
  };

  const onHeaderChangeMonthHandler = (newCurrentMonth: Date) => {
    setCurrentMonth(newCurrentMonth);

    const newBaseDateMonth = isSingleGrid ? newCurrentMonth : addMonths(newCurrentMonth, -1);
    const newBaseDate = getBaseDay(newBaseDateMonth, isDateEnabled);
    setFocusedDate(newBaseDate);
  };

  const onChangeStartDate = (value: string) => {
    setValue((oldValue: DateRangePickerProps.PendingAbsoluteValue) => ({
      ...oldValue,
      start: { ...oldValue.start, date: value },
    }));
    updateCurrentMonth(value);
  };

  const interceptedSetValue: DateRangePickerCalendarProps['setValue'] = newValue => {
    setValue(oldValue => {
      const updated = typeof newValue === 'function' ? newValue(oldValue) : newValue;
      updateCurrentMonth(updated.start.date);
      return updated;
    });
  };

  const headingIdPrefix = useUniqueId('date-range-picker-calendar-heading');
  return (
    <>
      <div
        className={clsx(styles['calendar-container'], {
          [styles['one-grid']]: isSingleGrid,
        })}
      >
        <SpaceBetween size="s">
          <div
            className={clsx(styles.calendar, {
              [styles['one-grid']]: isSingleGrid,
            })}
          >
            <CalendarHeader
              baseDate={currentMonth}
              locale={normalizedLocale}
              onChangeMonth={onHeaderChangeMonthHandler}
              previousMonthLabel={i18nStrings?.previousMonthAriaLabel}
              nextMonthLabel={i18nStrings?.nextMonthAriaLabel}
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
              todayAriaLabel={i18nStrings?.todayAriaLabel}
              selectedStartDate={parseDate(value.start.date, true)}
              selectedEndDate={parseDate(value.end.date, true)}
              headingIdPrefix={headingIdPrefix}
            />
          </div>

          <RangeInputs
            startDate={value.start.date}
            onChangeStartDate={onChangeStartDate}
            startTime={value.start.time}
            onChangeStartTime={value =>
              setValue(oldValue => ({ ...oldValue, start: { ...oldValue.start, time: value } }))
            }
            endDate={value.end.date}
            onChangeEndDate={value => setValue(oldValue => ({ ...oldValue, end: { ...oldValue.end, date: value } }))}
            endTime={value.end.time}
            onChangeEndTime={value => setValue(oldValue => ({ ...oldValue, end: { ...oldValue.end, time: value } }))}
            i18nStrings={i18nStrings}
            dateOnly={dateOnly}
            timeInputFormat={timeInputFormat}
          />
          {customAbsoluteRangeControl && <div>{customAbsoluteRangeControl(value, interceptedSetValue)}</div>}
        </SpaceBetween>
      </div>
      <LiveRegion className={styles['calendar-aria-live']}>{announcement}</LiveRegion>
    </>
  );
}
