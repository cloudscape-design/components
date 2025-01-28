// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
  padDates: 'none' | 'before' | 'after' | 'both';
}

export interface YearGridProps extends GridProps {
  currentMonthAriaLabel?: string;
}

export interface MonthGridProps extends GridProps {
  /**
   * Only expected on the daily calendar view
   */
  startOfWeek?: DayIndex;
  todayAriaLabel?: string;
}

export interface SelectGridProps extends GridBaseProps {
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
  granularity?: DateRangePickerProps.Granularity;
  todayAriaLabel?: string;
  currentMonthAriaLabel?: string;
}
