// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, TdHTMLAttributes, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  addDays,
  addWeeks,
  getDaysInMonth,
  isAfter,
  isBefore,
  isLastDayOfMonth,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns';
import { getCalendarMonth } from 'mnth';

import { getDateLabel, renderDayName } from '../../../calendar/utils/intl';
import ScreenreaderOnly from '../../../internal/components/screenreader-only/index.js';
import Tooltip from '../../../internal/components/tooltip';
import useHiddenDescription from '../../../internal/hooks/use-hidden-description';
import { useMergeRefs } from '../../../internal/hooks/use-merge-refs';
import { applyDisplayName } from '../../../internal/utils/apply-display-name';
import { formatDate } from '../../../internal/utils/date-time';
import { DateRangePickerProps, DayIndex } from '../../interfaces';

import styles from './styles.css.js';

/**
 * Calendar grid supports two mechanisms of keyboard navigation:
 * - Native screen-reader table navigation (semantic table markup);
 * - Keyboard arrow-keys navigation (a custom key-down handler).
 *
 * The implementation largely follows the w3 example (https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog) and shares the following issues:
 * - (table navigation) Chrome+VO - weekday is announced twice when navigating to the calendar's header;
 * - (table navigation) Safari+VO - "dimmed" state is announced twice;
 * - (table navigation) Firefox/Chrome+NVDA - cannot use table navigation if any cell has a focus;
 * - (keyboard navigation) Firefox+NVDA - every day is announced as "not selected";
 * - (keyboard navigation) Safari/Chrome+VO - weekdays are not announced;
 * - (keyboard navigation) Safari/Chrome+VO - days are not announced as interactive (clickable or selectable);
 * - (keyboard navigation) Safari/Chrome+VO - day announcements are not interruptive and can be missed if navigating fast.
 */

export interface GridProps {
  baseDate: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;

  rangeStartDate: Date | null;
  rangeEndDate: Date | null;

  focusedDate: Date | null;
  focusedDateRef: React.RefObject<HTMLTableCellElement>;

  onSelectDate: (date: Date) => void;
  onGridKeyDownHandler: (e: React.KeyboardEvent<HTMLElement>) => void;
  onFocusedDateChange: React.Dispatch<React.SetStateAction<Date | null>>;

  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction;
  dateDisabledReason: DateRangePickerProps.DateDisabledReasonFunction;

  locale: string;
  startOfWeek: DayIndex;
  todayAriaLabel?: string;
  ariaLabelledby: string;

  className?: string;
}

interface GridCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  disabledReason?: string;
}

const GridCell = forwardRef((props: GridCellProps, focusedDateRef: React.Ref<HTMLTableCellElement>) => {
  const { disabledReason, ...rest } = props;
  const isDisabledWithReason = !!disabledReason;
  const { targetProps, descriptionEl } = useHiddenDescription(disabledReason);
  const ref = useRef<HTMLTableCellElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <td
      ref={useMergeRefs(focusedDateRef, ref)}
      {...rest}
      {...(isDisabledWithReason ? targetProps : {})}
      onFocus={event => {
        if (rest.onFocus) {
          rest.onFocus(event);
        }

        if (isDisabledWithReason) {
          setShowTooltip(true);
        }
      }}
      onBlur={event => {
        if (rest.onBlur) {
          rest.onBlur(event);
        }

        if (isDisabledWithReason) {
          setShowTooltip(false);
        }
      }}
      onMouseEnter={event => {
        if (rest.onMouseEnter) {
          rest.onMouseEnter(event);
        }

        if (isDisabledWithReason) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={event => {
        if (rest.onMouseLeave) {
          rest.onMouseLeave(event);
        }

        if (isDisabledWithReason) {
          setShowTooltip(false);
        }
      }}
    >
      {props.children}
      {isDisabledWithReason && (
        <>
          {descriptionEl}
          {showTooltip && (
            <Tooltip className={styles['disabled-reason-tooltip']} trackRef={ref} value={disabledReason!} />
          )}
        </>
      )}
    </td>
  );
});

applyDisplayName(GridCell, 'GridCell');

export function Grid({
  baseDate,
  selectedStartDate,
  selectedEndDate,
  rangeStartDate,
  rangeEndDate,
  focusedDate,

  focusedDateRef,

  onSelectDate,
  onGridKeyDownHandler,
  onFocusedDateChange,

  isDateEnabled,
  dateDisabledReason,

  locale,
  startOfWeek,
  todayAriaLabel,
  ariaLabelledby,

  className,
}: GridProps) {
  const baseDateTime = baseDate?.getTime();
  // `baseDateTime` is used as a more stable replacement for baseDate
  const weeks = useMemo<Date[][]>(
    () => getCalendarMonth(baseDate, { firstDayOfWeek: startOfWeek }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseDateTime, startOfWeek]
  );
  const weekdays = weeks[0].map(date => date.getDay());

  return (
    <table role="grid" aria-labelledby={ariaLabelledby} className={clsx(styles.grid, className)}>
      <thead>
        <tr>
          {weekdays.map(dayIndex => (
            <th key={dayIndex} scope="col" className={clsx(styles['grid-cell'], styles['day-header'])}>
              <span aria-hidden="true">{renderDayName(locale, dayIndex, 'short')}</span>
              <ScreenreaderOnly>{renderDayName(locale, dayIndex, 'long')}</ScreenreaderOnly>
            </th>
          ))}
        </tr>
      </thead>
      <tbody onKeyDown={onGridKeyDownHandler}>
        {weeks.map((week, weekIndex) => {
          return (
            <tr key={weekIndex} className={styles.week}>
              {week.map((date, dateIndex) => {
                const isStartDate = !!selectedStartDate && isSameDay(date, selectedStartDate);
                const isEndDate = !!selectedEndDate && isSameDay(date, selectedEndDate);
                const isSelected = isStartDate || isEndDate;
                const isRangeStartDate = !!rangeStartDate && isSameDay(date, rangeStartDate);
                const isRangeEndDate = !!rangeEndDate && isSameDay(date, rangeEndDate);

                const isFocused = !!focusedDate && isSameDay(date, focusedDate) && isSameMonth(date, baseDate);

                const dateIsInRange = isStartDate || isEndDate || isInRange(date, rangeStartDate, rangeEndDate);
                const inRangeStartWeek =
                  rangeStartDate && isInRange(date, rangeStartDate, addDays(addWeeks(rangeStartDate, 1), -1));
                const inRangeEndWeek =
                  rangeEndDate && isInRange(date, rangeEndDate, addDays(addWeeks(rangeEndDate, -1), 1));
                const onlyOneSelected =
                  !!rangeStartDate && !!rangeEndDate
                    ? isSameDay(rangeStartDate, rangeEndDate)
                    : !selectedStartDate || !selectedEndDate;

                const isEnabled = !isDateEnabled || isDateEnabled(date);
                const disabledReason = dateDisabledReason(date);
                const isDisabledWithReason = !isEnabled && !!disabledReason;
                const isFocusable = isFocused && (isEnabled || isDisabledWithReason);

                const baseClasses = {
                  [styles.day]: true,
                  [styles['grid-cell']]: true,
                  [styles['in-first-row']]: weekIndex === 0,
                  [styles['in-first-column']]: dateIndex === 0,
                };

                if (!isSameMonth(date, baseDate)) {
                  return (
                    <td
                      key={`${weekIndex}:${dateIndex}`}
                      ref={isFocused ? focusedDateRef : undefined}
                      className={clsx(baseClasses, {
                        [styles['in-previous-month']]: isBefore(date, baseDate),
                        [styles['last-day-of-month']]: isLastDayOfMonth(date),
                        [styles['in-next-month']]: isAfter(date, baseDate),
                      })}
                    ></td>
                  );
                }

                const handlers: React.HTMLAttributes<HTMLDivElement> = {};
                if (isEnabled) {
                  handlers.onClick = () => onSelectDate(date);
                  handlers.onFocus = () => onFocusedDateChange(date);
                }

                // Can't be focused.
                let tabIndex = undefined;
                if (isFocusable && (isEnabled || isDisabledWithReason)) {
                  // Next focus target.
                  tabIndex = 0;
                } else if (isEnabled || isDisabledWithReason) {
                  // Can be focused programmatically.
                  tabIndex = -1;
                }

                // Screen-reader announcement for the focused day.
                let dayAnnouncement = getDateLabel(locale, date, 'short');
                if (isToday(date)) {
                  dayAnnouncement += '. ' + todayAriaLabel;
                }

                return (
                  <GridCell
                    ref={isFocused ? focusedDateRef : undefined}
                    key={`${weekIndex}:${dateIndex}`}
                    className={clsx(baseClasses, {
                      [styles['in-current-month']]: isSameMonth(date, baseDate),
                      [styles.enabled]: isEnabled,
                      [styles.selected]: isSelected,
                      [styles['start-date']]: isStartDate,
                      [styles['end-date']]: isEndDate,
                      [styles['range-start-date']]: isRangeStartDate,
                      [styles['range-end-date']]: isRangeEndDate,
                      [styles['no-range']]: isSelected && onlyOneSelected,
                      [styles['in-range']]: dateIsInRange,
                      [styles['in-range-border-block-start']]: !!inRangeStartWeek || date.getDate() <= 7,
                      [styles['in-range-border-block-end']]:
                        !!inRangeEndWeek || date.getDate() > getDaysInMonth(date) - 7,
                      [styles['in-range-border-inline-start']]:
                        dateIndex === 0 || date.getDate() === 1 || isRangeStartDate,
                      [styles['in-range-border-inline-end']]:
                        dateIndex === week.length - 1 || isLastDayOfMonth(date) || isRangeEndDate,
                      [styles.today]: isToday(date),
                    })}
                    aria-selected={isEnabled ? isSelected || dateIsInRange : undefined}
                    aria-current={isToday(date) ? 'date' : undefined}
                    data-date={formatDate(date)}
                    aria-disabled={!isEnabled}
                    tabIndex={tabIndex}
                    disabledReason={isDisabledWithReason ? disabledReason : undefined}
                    {...handlers}
                  >
                    <span className={styles['day-inner']} aria-hidden="true">
                      {date.getDate()}
                    </span>
                    <ScreenreaderOnly>{dayAnnouncement}</ScreenreaderOnly>
                  </GridCell>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function isInRange(date: Date, dateOne: Date | null, dateTwo: Date | null) {
  if (!dateOne || !dateTwo || isSameDay(dateOne, dateTwo)) {
    return false;
  }

  const inRange =
    (isAfter(date, dateOne) && isBefore(date, dateTwo)) || (isAfter(date, dateTwo) && isBefore(date, dateOne));

  return inRange || isSameDay(date, dateOne) || isSameDay(date, dateTwo);
}
