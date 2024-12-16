// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';
import {
  addMonths,
  addYears,
  endOfDay,
  isAfter,
  isBefore,
  isSameMonth,
  isSameYear,
  startOfDay,
  startOfMonth,
  startOfYear,
} from 'date-fns';

import { getDateLabel, renderTimeLabel } from '../../calendar/utils/intl';
import { getBaseDay } from '../../calendar/utils/navigation-day';
import { getBaseMonth } from '../../calendar/utils/navigation-month';
import { useInternalI18n } from '../../i18n/context.js';
import { BaseComponentProps } from '../../internal/base-component';
import { useMobile } from '../../internal/hooks/use-mobile/index.js';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { formatDate, formatDateTime, parseDate, splitDateTime } from '../../internal/utils/date-time';
import { normalizeLocale, normalizeStartOfWeek } from '../../internal/utils/locale';
import InternalLiveRegion from '../../live-region/internal';
import SpaceBetween from '../../space-between/internal';
import { TimeInputProps } from '../../time-input/interfaces';
import { DateRangePickerProps, Granularity, RangeCalendarI18nStrings } from '../interfaces';
import { Grids } from './grids';
import CalendarHeader from './header';
import RangeInputs from './range-inputs.js';
import { findDateToFocus, findMonthToDisplay, findMonthToFocus, findYearToDisplay } from './utils';

// import { formatValue } from '../utils';
import styles from '../styles.css.js';

export interface DateRangePickerCalendarProps extends BaseComponentProps {
  value: DateRangePickerProps.PendingAbsoluteValue;
  setValue: React.Dispatch<React.SetStateAction<DateRangePickerProps.PendingAbsoluteValue>>;
  locale?: string;
  startOfWeek?: number;
  isDateEnabled?: (date: Date) => boolean;
  dateDisabledReason?: (date: Date) => string;
  i18nStrings?: RangeCalendarI18nStrings;
  dateOnly?: boolean;
  timeInputFormat?: TimeInputProps.Format;
  customAbsoluteRangeControl: DateRangePickerProps.AbsoluteRangeControl | undefined;
  granularity?: Granularity;
}

export default function DateRangePickerCalendar({
  value,
  setValue,
  locale = '',
  startOfWeek,
  isDateEnabled = () => true,
  dateDisabledReason = () => '',
  i18nStrings,
  dateOnly = false,
  timeInputFormat = 'hh:mm:ss',
  customAbsoluteRangeControl,
  granularity = 'day',
}: DateRangePickerCalendarProps) {
  const isSingleGrid = useMobile();
  const isMonthPicker = granularity === 'month';
  const hideTime = isMonthPicker || dateOnly;
  const normalizedLocale = normalizeLocale('DateRangePicker', locale);
  const normalizedStartOfWeek = normalizeStartOfWeek(startOfWeek, normalizedLocale);
  const i18n = useInternalI18n('date-range-picker');

  const [announcement, setAnnouncement] = useState('');
  const findPageToDisplay = isMonthPicker ? findYearToDisplay : findMonthToDisplay;
  const isSamePage = isMonthPicker ? isSameYear : isSameMonth;
  const addPage = isMonthPicker ? addYears : addMonths;
  const startOfPage = isMonthPicker ? startOfYear : startOfMonth;
  const findItemToFocus = isMonthPicker ? findMonthToFocus : findDateToFocus;
  const [currentPage, setCurrentPage] = useState(() => findPageToDisplay(value, isSingleGrid));
  const [focusedDate, setFocusedDate] = useState<Date | null>(() => {
    if (value.start.date) {
      const startDate = parseDate(value.start.date);
      if (isSamePage(startDate, currentPage)) {
        return startDate;
      }
      if (!isSingleGrid && isSamePage(startDate, addPage(currentPage, -1))) {
        return startDate;
      }
    }
    return findItemToFocus(parseDate(value.start.date), currentPage, isDateEnabled);
  });

  const updateCurrentPage = (startDate: string) => {
    if ((isMonthPicker && startDate.length >= 4) || startDate.length >= 8) {
      const newCurrentPage = startOfPage(parseDate(startDate));
      setCurrentPage(isSingleGrid ? newCurrentPage : addPage(newCurrentPage, 1));
    }
  };

  // recommended to include the start/end time announced with the selection
  // because the user is not aware of the fact that a start/end time is also set as soon as they select a date
  const announceStart = (startDate: Date) => {
    return `${i18n('i18nStrings.startDateLabel', i18nStrings?.startDateLabel)}, ${getDateLabel(normalizedLocale, startDate)}${
      hideTime
        ? ''
        : `, ${i18n('i18nStrings.startTimeLabel', i18nStrings?.startTimeLabel)}, ${renderTimeLabel(
            normalizedLocale,
            startDate,
            timeInputFormat
          )}`
    }. `;
  };

  const announceEnd = (endDate: Date) => {
    return `${i18n('i18nStrings.endDateLabel', i18nStrings?.endDateLabel)}, ${getDateLabel(normalizedLocale, endDate)}${
      hideTime
        ? ''
        : `, ${i18n('i18nStrings.endTimeLabel', i18nStrings?.endTimeLabel)}, ${renderTimeLabel(
            normalizedLocale,
            endDate,
            timeInputFormat
          )}`
    }. `;
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
      previous: DateRangePickerProps.DateTimeStrings,
      includeTime: boolean
    ): DateRangePickerProps.DateTimeStrings => {
      if (date === null) {
        // explicitly reset to empty
        return { date: '', time: '' };
      } else if (date === undefined) {
        // keep old value
        return previous;
      }
      if (!includeTime) {
        return {
          date: formatDate(date),
          time: '',
        };
      }
      return splitDateTime(formatDateTime(date));
    };

    setValue({
      start: formatValue(newStart, value.start, !hideTime),
      end: formatValue(newEnd, value.end, !hideTime),
    });
    setAnnouncement(announcement);
  };

  const onHeaderChangePageHandler = (amount: number) => {
    const addPageFn = isMonthPicker ? addYears : addMonths;
    const getBaseFn = isMonthPicker ? getBaseMonth : getBaseDay;
    const newBasePage = addPageFn(currentPage, amount);
    setCurrentPage(newBasePage);
    const newBaseDate = getBaseFn(newBasePage, isDateEnabled);
    setFocusedDate(newBaseDate);
  };

  const onChangeStartDate = (value: string) => {
    setValue((oldValue: DateRangePickerProps.PendingAbsoluteValue) => ({
      ...oldValue,
      start: { ...oldValue.start, date: value },
    }));
    updateCurrentPage(value);
  };

  const interceptedSetValue: DateRangePickerCalendarProps['setValue'] = newValue => {
    setValue(oldValue => {
      const updated = typeof newValue === 'function' ? newValue(oldValue) : newValue;
      updateCurrentPage(updated.start.date);
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
              granularity={granularity}
              baseDate={currentPage}
              locale={normalizedLocale}
              onChangePage={onHeaderChangePageHandler}
              previousPageLabel={
                isMonthPicker ? i18nStrings?.previousYearAriaLabel : i18nStrings?.previousMonthAriaLabel
              }
              nextPageLabel={isMonthPicker ? i18nStrings?.nextYearAriaLabel : i18nStrings?.nextMonthAriaLabel}
              isSingleGrid={isSingleGrid}
              headingIdPrefix={headingIdPrefix}
            />

            <Grids
              granularity={granularity}
              isSingleGrid={isSingleGrid}
              locale={normalizedLocale}
              baseDate={currentPage}
              focusedDate={focusedDate}
              onFocusedDateChange={setFocusedDate}
              isDateEnabled={isDateEnabled}
              dateDisabledReason={dateDisabledReason}
              onSelectDate={onSelectDateHandler}
              onPageChange={setCurrentPage}
              startOfWeek={normalizedStartOfWeek}
              todayAriaLabel={i18nStrings?.todayAriaLabel}
              currentMonthAriaLabel={i18nStrings?.currentMonthAriaLabel}
              selectedStartDate={value?.start?.date ? parseDate(value.start.date, !isMonthPicker) : null}
              selectedEndDate={value?.end?.date ? parseDate(value.end.date, !isMonthPicker) : null}
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
            granularity={granularity}
          />
          {customAbsoluteRangeControl && <div>{customAbsoluteRangeControl(value, interceptedSetValue)}</div>}
        </SpaceBetween>
      </div>
      {/* Can't use message here because the contents are checked in tests */}
      <InternalLiveRegion className={styles['calendar-aria-live']} hidden={true} tagName="span">
        {announcement}
      </InternalLiveRegion>
    </>
  );
}
