// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { addMonths, endOfDay, isBefore, startOfDay, startOfMonth, isAfter, isSameMonth } from 'date-fns';
import styles from '../styles.css.js';
import { BaseComponentProps } from '../../internal/base-component';
import { DateRangePickerProps, Focusable } from '../interfaces';
import CalendarHeader from './header';
import { Grids, selectFocusedDate } from './grids';
import moveFocusHandler from '../../calendar/utils/move-focus-handler';
import InternalSpaceBetween from '../../space-between/internal';
import InternalFormField from '../../form-field/internal';
import { InputProps } from '../../input/interfaces';
import InternalDateInput from '../../date-input/internal';
import { TimeInputProps } from '../../time-input/interfaces';
import InternalTimeInput from '../../time-input/internal';
import clsx from 'clsx';
import { getBaseDate } from './get-base-date.js';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { getDateLabel, renderTimeLabel } from '../../calendar/utils/intl';
import LiveRegion from '../../internal/components/live-region';
import { normalizeStartOfWeek } from '../../calendar/utils/locales';
import { formatDate, formatTime, joinDateTime, parseDate } from '../../internal/utils/date-time';

export interface DateChangeHandler {
  (detail: Date): void;
}

export interface MonthChangeHandler {
  (newMonth: Date): void;
}

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface HeaderChangeMonthHandler {
  (isPreviousButtonClick?: boolean): void;
}

export interface CalendarProps extends BaseComponentProps {
  locale: string;
  startOfWeek: number | undefined;
  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction;
  onSelectDateRange: (value: DateRangePickerProps.AbsoluteValue) => void;
  initialStartDate: string | undefined;
  initialEndDate: string | undefined;
  i18nStrings: DateRangePickerProps.I18nStrings;
  dateOnly: boolean;
  timeInputFormat: TimeInputProps.Format;
  isSingleGrid: boolean;
}

export default forwardRef(Calendar);

function Calendar(
  {
    locale,
    startOfWeek,
    isDateEnabled,
    onSelectDateRange,
    initialEndDate = '',
    initialStartDate = '',
    i18nStrings,
    dateOnly,
    isSingleGrid,
    timeInputFormat,
  }: CalendarProps,
  ref: React.Ref<Focusable>
) {
  const elementRef = useRef<HTMLDivElement>(null);

  const normalizedStartOfWeek = normalizeStartOfWeek(startOfWeek, locale);

  useImperativeHandle(ref, () => ({
    focus() {
      if (elementRef.current) {
        const prevButton = elementRef.current.getElementsByClassName(styles['calendar-prev-month-btn'])[0];
        (prevButton as undefined | HTMLButtonElement)?.focus();
      }
    },
  }));

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

  useEffect(() => {
    // This effect "synchronizes" the local state update back up to the overall DateRangePicker component

    const startDate = joinDateTime(startDateString, startTimeString);
    const endDate = joinDateTime(endDateString, endTimeString);

    if (startDate !== initialStartDate || endDate !== initialEndDate) {
      onSelectDateRange({
        startDate,
        endDate,
        type: 'absolute',
      });
    }
  }, [
    startDateString,
    startTimeString,
    endDateString,
    endTimeString,
    onSelectDateRange,
    initialStartDate,
    initialEndDate,
  ]);

  const onSelectDateHandler = (selectedDate: Date) => {
    // recommended to include the start/end time announced with the selection
    // because the user is not aware of the fact that a start/end time is also set as soon as they select a date
    const announceStart = (startDate: Date) => {
      return (
        i18nStrings.startDateLabel +
        ', ' +
        getDateLabel(locale, startDate) +
        ', ' +
        i18nStrings.startTimeLabel +
        ', ' +
        renderTimeLabel(locale, startDate, timeInputFormat) +
        '. '
      );
    };

    const announceEnd = (endDate: Date) => {
      return (
        i18nStrings.endDateLabel +
        ', ' +
        getDateLabel(locale, endDate) +
        ', ' +
        i18nStrings.endTimeLabel +
        ', ' +
        renderTimeLabel(locale, endDate, timeInputFormat) +
        '. '
      );
    };

    const announceRange = (startDate: Date, endDate: Date) => {
      if (!i18nStrings.renderSelectedAbsoluteRangeAriaLive) {
        return `${getDateLabel(locale, startDate)} – ${getDateLabel(locale, endDate)}`;
      }
      return i18nStrings.renderSelectedAbsoluteRangeAriaLive(
        getDateLabel(locale, startDate),
        getDateLabel(locale, endDate)
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

  const onHeaderChangeMonthHandler: HeaderChangeMonthHandler = isPrevious => {
    const newCurrentMonth = addMonths(currentMonth, isPrevious ? -1 : 1);
    setCurrentMonth(newCurrentMonth);

    const newBaseDateMonth = isSingleGrid ? newCurrentMonth : addMonths(newCurrentMonth, -1);
    const newBaseDate = getBaseDate(newBaseDateMonth, 1, isDateEnabled);
    setFocusedDate(newBaseDate);
  };

  const onChangeStartDate: InputProps['onChange'] = e => {
    setStartDateString(e.detail.value);

    if (e.detail.value.length >= 8) {
      const newCurrentMonth = startOfMonth(parseDate(e.detail.value));
      setCurrentMonth(isSingleGrid ? newCurrentMonth : addMonths(newCurrentMonth, 1));
    }
  };

  const onChangeEndDate: InputProps['onChange'] = e => {
    setEndDateString(e.detail.value);
  };

  let constrainttextId = useUniqueId('awsui-area-date-range-picker');
  constrainttextId = i18nStrings.dateTimeConstraintText ? constrainttextId : '';

  return (
    <>
      <InternalSpaceBetween size="m">
        <div
          className={clsx(styles.calendar, {
            [styles['one-grid']]: isSingleGrid,
          })}
          role="application"
          ref={elementRef}
        >
          <CalendarHeader
            baseDate={currentMonth}
            locale={locale}
            onChangeMonth={onHeaderChangeMonthHandler}
            previousMonthLabel={i18nStrings.previousMonthAriaLabel}
            nextMonthLabel={i18nStrings.nextMonthAriaLabel}
            isSingleGrid={isSingleGrid}
          />

          <Grids
            isSingleGrid={isSingleGrid}
            locale={locale}
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
            handleFocusMove={moveFocusHandler}
          />
        </div>
        <InternalSpaceBetween direction="vertical" size="xxs">
          <InternalSpaceBetween size="xs" direction={isSingleGrid ? 'vertical' : 'horizontal'}>
            <div className={clsx(styles['date-and-time-wrapper'], { [styles['date-only']]: dateOnly })}>
              <InternalFormField label={i18nStrings.startDateLabel} stretch={true}>
                <InternalDateInput
                  value={startDateString}
                  className={styles['start-date-input']}
                  onChange={onChangeStartDate}
                  placeholder="YYYY/MM/DD"
                  ariaDescribedby={constrainttextId}
                />
              </InternalFormField>
              {!dateOnly && (
                <InternalFormField label={i18nStrings.startTimeLabel} stretch={true}>
                  <InternalTimeInput
                    value={startTimeString}
                    onChange={e => setStartTimeString(e.detail.value)}
                    format={timeInputFormat}
                    placeholder={timeInputFormat}
                    className={styles['start-time-input']}
                    ariaDescribedby={constrainttextId}
                  />
                </InternalFormField>
              )}
            </div>

            <div className={clsx(styles['date-and-time-wrapper'], { [styles['date-only']]: dateOnly })}>
              <InternalFormField label={i18nStrings.endDateLabel} stretch={true}>
                <InternalDateInput
                  value={endDateString}
                  className={styles['end-date-input']}
                  onChange={onChangeEndDate}
                  placeholder="YYYY/MM/DD"
                  ariaDescribedby={constrainttextId}
                />
              </InternalFormField>
              {!dateOnly && (
                <InternalFormField label={i18nStrings.endTimeLabel} stretch={true}>
                  <InternalTimeInput
                    value={endTimeString}
                    onChange={e => setEndTimeString(e.detail.value)}
                    format={timeInputFormat}
                    placeholder={timeInputFormat}
                    className={styles['end-time-input']}
                    ariaDescribedby={constrainttextId}
                  />
                </InternalFormField>
              )}
            </div>
          </InternalSpaceBetween>
          {i18nStrings.dateTimeConstraintText && (
            <div className={styles['date-and-time-constrainttext']} id={constrainttextId}>
              {i18nStrings.dateTimeConstraintText}
            </div>
          )}
        </InternalSpaceBetween>
      </InternalSpaceBetween>
      <LiveRegion>
        <span className={styles['calendar-aria-live']}>{announcement}</span>
      </LiveRegion>
    </>
  );
}
