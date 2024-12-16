// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import InternalDateInput from '../../date-input/internal';
import InternalFormField from '../../form-field/internal';
import { useInternalI18n } from '../../i18n/context.js';
import { BaseComponentProps } from '../../internal/base-component';
import { TimeInputProps } from '../../time-input/interfaces';
import InternalTimeInput from '../../time-input/internal';
import { Granularity, RangeCalendarI18nStrings } from '../interfaces';

import styles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

type I18nStrings = Pick<
  RangeCalendarI18nStrings,
  | 'dateTimeConstraintText'
  | 'startMonthLabel'
  | 'startDateLabel'
  | 'startTimeLabel'
  | 'endMonthLabel'
  | 'endDateLabel'
  | 'endTimeLabel'
>;

interface RangeInputsProps extends BaseComponentProps {
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
  timeInputFormat: TimeInputProps.Format;
  granularity?: Granularity;
}

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
  timeInputFormat,
  granularity = 'day',
}: RangeInputsProps) {
  const i18n = useInternalI18n('date-range-picker');
  const isMonthPicker = granularity === 'month';
  const dateInputPlaceholder = isMonthPicker ? 'YYYY/MM' : 'YYYY/MM/DD';
  const showTimeInput = !dateOnly && !isMonthPicker;

  //todo confirm if other dateTimeConstraint texts needed for i18n

  return (
    <InternalFormField constraintText={i18n('i18nStrings.dateTimeConstraintText', i18nStrings?.dateTimeConstraintText)}>
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
