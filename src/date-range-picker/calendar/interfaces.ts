// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../../internal/base-component';
import { SomeRequired } from '../../internal/types';
import { DateRangePickerProps } from '../interfaces';

export type RangeCalendarI18nStrings = Pick<
  DateRangePickerProps.I18nStrings,
  | 'todayAriaLabel'
  | 'nextMonthAriaLabel'
  | 'previousMonthAriaLabel'
  | 'currentMonthAriaLabel'
  | 'nextYearAriaLabel'
  | 'previousYearAriaLabel'
  | 'startMonthLabel'
  | 'startDateLabel'
  | 'startTimeLabel'
  | 'endMonthLabel'
  | 'endDateLabel'
  | 'endTimeLabel'
  | 'dateConstraintText'
  | 'isoDateConstraintText'
  | 'slashedDateConstraintText'
  | 'dateTimeConstraintText'
  | 'isoDateTimeConstraintText'
  | 'slashedDateTimeConstraintText'
  | 'monthConstraintText'
  | 'isoMonthConstraintText'
  | 'slashedMonthConstraintText'
  | 'renderSelectedAbsoluteRangeAriaLive'
>;

export interface DateRangePickerCalendarProps
  extends BaseComponentProps,
    SomeRequired<
      Pick<
        DateRangePickerProps,
        | 'granularity'
        | 'locale'
        | 'startOfWeek'
        | 'timeInputFormat'
        | 'dateInputFormat'
        | 'i18nStrings'
        | 'dateOnly'
        | 'absoluteFormat'
        | 'customAbsoluteRangeControl'
        | 'isDateEnabled'
        | 'dateDisabledReason'
      >,
      'absoluteFormat' | 'timeInputFormat'
    > {
  value: DateRangePickerProps.PendingAbsoluteValue;
  setValue: React.Dispatch<React.SetStateAction<DateRangePickerProps.PendingAbsoluteValue>>;
  i18nStrings?: RangeCalendarI18nStrings;
}

export interface RangeInputsProps
  extends BaseComponentProps,
    SomeRequired<
      Pick<DateRangePickerProps, 'granularity' | 'dateOnly' | 'timeInputFormat' | 'dateInputFormat'>,
      'dateOnly' | 'timeInputFormat' | 'granularity'
    > {
  startDate: string;
  onChangeStartDate: (value: string) => void;
  startTime: string;
  onChangeStartTime: (value: string) => void;
  endDate: string;
  onChangeEndDate: (value: string) => void;
  endTime: string;
  onChangeEndTime: (value: string) => void;
  i18nStrings?: RangeCalendarI18nStrings;
}
