// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { CalendarProps } from '../../calendar/interfaces';
import InternalDateInput from '../../date-input/internal';
import InternalFormField from '../../form-field/internal';
import { useInternalI18n } from '../../i18n/context.js';
import { BaseComponentProps } from '../../internal/base-component';
import InternalTimeInput from '../../time-input/internal';
import { DateRangePickerProps, RangeCalendarI18nStrings } from '../interfaces';

import styles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

type I18nStrings = Pick<
  RangeCalendarI18nStrings,
  | 'dateConstraintText'
  | 'isoDateConstraintText'
  | 'slashedDateConstraintText'
  | 'dateTimeConstraintText'
  | 'isoDateTimeConstraintText'
  | 'slashedDateTimeConstraintText'
  | 'monthConstraintText'
  | 'isoMonthConstraintText'
  | 'slashedMonthConstraintText'
  | 'startMonthLabel'
  | 'startDateLabel'
  | 'startTimeLabel'
  | 'endMonthLabel'
  | 'endDateLabel'
  | 'endTimeLabel'
>;

interface RangeInputsProps extends BaseComponentProps, Pick<CalendarProps, 'granularity'> {
  startDate: string;
  onChangeStartDate: (value: string) => void;
  startTime: string;
  onChangeStartTime: (value: string) => void;
  endDate: string;
  onChangeEndDate: (value: string) => void;
  endTime: string;
  onChangeEndTime: (value: string) => void;
  i18nStrings?: I18nStrings;
  dateOnly: boolean;
  absoluteFormat?: DateRangePickerProps.AbsoluteFormat;
  timeInputFormat: DateRangePickerProps.TimeInputFormat;
  dateInputFormat: DateRangePickerProps.DateInputFormat;
}

const generateI18NKey = (isMonthPicker: boolean, isDateOnly: boolean, isIso: boolean, isFallback: boolean) => {
  if (isMonthPicker) {
    if (isFallback) {
      return 'i18nStrings.monthConstraintText';
    }
    return isIso ? 'i18nStrings.isoMonthConstraintText' : 'i18nStrings.slashedMonthConstraintText';
  }
  if (isDateOnly) {
    if (isFallback) {
      return 'i18nStrings.dateConstraintText';
    }
    return isIso ? 'i18nStrings.isoDateConstraintText' : 'i18nStrings.slashedDateConstraintText';
  }
  if (isFallback) {
    return 'i18nStrings.dateTimeConstraintText';
  }

  return isIso ? 'i18nStrings.isoDateTimeConstraintText' : 'i18nStrings.slashedDateTimeConstraintText';
};

const provideI18N = (i18nStrings: I18nStrings, isMonthPicker: boolean, isDateOnly: boolean, isIso: boolean): string => {
  let result;

  if (isMonthPicker) {
    result = isIso ? i18nStrings?.isoMonthConstraintText : i18nStrings?.slashedMonthConstraintText;
    if (!result) {
      result = i18nStrings?.monthConstraintText;
    }
  } else if (isDateOnly) {
    result = isIso ? i18nStrings?.isoDateConstraintText : i18nStrings?.slashedDateConstraintText;
    if (!result) {
      result = i18nStrings?.dateConstraintText;
    }
  }
  if (!result) {
    result = isIso ? i18nStrings?.isoDateTimeConstraintText : i18nStrings?.slashedDateTimeConstraintText;
    if (!result) {
      result = i18nStrings?.dateTimeConstraintText;
    }
  }
  return result || '';
};

export default function RangeInputs({
  startDate,
  onChangeStartDate,
  startTime,
  onChangeStartTime,
  endDate,
  onChangeEndDate,
  endTime,
  onChangeEndTime,
  i18nStrings,
  dateOnly,
  absoluteFormat = 'iso',
  timeInputFormat,
  dateInputFormat,
  granularity = 'day',
}: RangeInputsProps) {
  const i18n = useInternalI18n('date-range-picker');
  const isMonthPicker = granularity === 'month';

  const showTimeInput = !dateOnly && !isMonthPicker;

  const parsedDateInputFormat = dateInputFormat || (absoluteFormat !== 'long-localized' ? absoluteFormat : 'iso');
  const isIso = parsedDateInputFormat === 'iso';
  const separator = isIso ? '-' : '/';
  const dateInputPlaceholder = `YYYY${separator}MM${isMonthPicker ? '' : `${separator}DD`}`;
  const i18nProvided = provideI18N(i18nStrings!, isMonthPicker, dateOnly, isIso);
  const i18nKey = generateI18NKey(isMonthPicker, dateOnly, isIso, !i18nProvided);

  console.log({ i18nKey, i18nProvided, i18n, i18nStrings });

  return (
    <InternalFormField constraintText={i18n(i18nKey, i18nProvided)}>
      <div className={styles['date-and-time-container']}>
        <div className={styles['date-and-time-wrapper']}>
          <InternalFormField
            stretch={true}
            label={i18n(
              isMonthPicker ? 'i18nStrings.startMonthLabel' : 'i18nStrings.startDateLabel',
              isMonthPicker ? i18nStrings?.startMonthLabel : i18nStrings?.startDateLabel
            )}
          >
            <InternalDateInput
              value={startDate}
              className={clsx(testutilStyles['start-date-input'], isMonthPicker && testutilStyles['start-month-input'])}
              onChange={event => onChangeStartDate(event.detail.value)}
              placeholder={dateInputPlaceholder}
              format={parsedDateInputFormat}
              granularity={granularity}
            />
          </InternalFormField>
          {showTimeInput && (
            <InternalFormField stretch={true} label={i18n('i18nStrings.startTimeLabel', i18nStrings?.startTimeLabel)}>
              <InternalTimeInput
                value={startTime}
                onChange={event => onChangeStartTime(event.detail.value)}
                format={timeInputFormat}
                placeholder={timeInputFormat}
                className={testutilStyles['start-time-input']}
              />
            </InternalFormField>
          )}
        </div>

        <div className={styles['date-and-time-wrapper']}>
          <InternalFormField
            stretch={true}
            label={i18n(
              isMonthPicker ? 'i18nStrings.endMonthLabel' : 'i18nStrings.endDateLabel',
              isMonthPicker ? i18nStrings?.endMonthLabel : i18nStrings?.endDateLabel
            )}
          >
            <InternalDateInput
              value={endDate}
              className={clsx(testutilStyles['end-date-input'], isMonthPicker && testutilStyles['end-month-picker'])}
              onChange={event => onChangeEndDate(event.detail.value)}
              placeholder={dateInputPlaceholder}
              format={parsedDateInputFormat}
              granularity={granularity}
            />
          </InternalFormField>
          {showTimeInput && (
            <InternalFormField label={i18n('i18nStrings.endTimeLabel', i18nStrings?.endTimeLabel)} stretch={true}>
              <InternalTimeInput
                value={endTime}
                onChange={event => onChangeEndTime(event.detail.value)}
                format={timeInputFormat}
                placeholder={timeInputFormat}
                className={testutilStyles['end-time-input']}
              />
            </InternalFormField>
          )}
        </div>
      </div>
    </InternalFormField>
  );
}
