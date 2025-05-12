// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CalendarProps } from '../../../calendar/interfaces';
import { DateRangePickerProps, DayIndex } from '../../interfaces';

export interface GridBaseProps {
  baseDate: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  focusedDate: Date | null;

  onFocusedDateChange: React.Dispatch<React.SetStateAction<Date | null>>;
  onSelectDate: (date: Date) => void;
  isDateEnabled: DateRangePickerProps.IsDateEnabledFunction;
  dateDisabledReason: DateRangePickerProps.DateDisabledReasonFunction;

  locale: string;
}

export interface GridProps extends GridBaseProps {
  rangeStartDate: Date | null;
  rangeEndDate: Date | null;
  focusedDateRef: React.RefObject<HTMLTableCellElement>;

  onGridKeyDownHandler: (e: React.KeyboardEvent<HTMLElement>) => void;

  ariaLabelledby: string;
  className?: string;

  /**
   * Used to only add the dates of previous and next months outside the month pages
   */
  padDates: 'before' | 'after';
  currentMonthAriaLabel?: string;
  startOfWeek?: DayIndex;
  todayAriaLabel?: string;
  granularity: CalendarProps.Granularity;
}

export interface SelectGridProps extends GridBaseProps, Pick<CalendarProps, 'granularity'> {
  /**
   * changes the page/view of the calendar. Doing so will change to another month or year
   * @param date
   * @returns
   */
  onPageChange: (date: Date) => void;

  isSingleGrid: boolean;

  headingIdPrefix: string;
  /**
   * not needed for grids with a month granularity
   */
  startOfWeek?: DayIndex;
  todayAriaLabel?: string;
  currentMonthAriaLabel?: string;
}
