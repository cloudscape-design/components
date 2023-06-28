// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styles from '../styles.css.js';
import { BaseComponentProps } from '../../internal/base-component';
import { RangeCalendarI18nStrings } from '../interfaces';
import InternalFormField from '../../form-field/internal';
import InternalDateInput from '../../date-input/internal';
import { TimeInputProps } from '../../time-input/interfaces';
import InternalTimeInput from '../../time-input/internal';
import { useInternalI18n } from '../../internal/i18n/context.js';

type I18nStrings = Pick<
  RangeCalendarI18nStrings,
  'dateTimeConstraintText' | 'startDateLabel' | 'startTimeLabel' | 'endDateLabel' | 'endTimeLabel'
>;

export interface RangeInputsProps extends BaseComponentProps {
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
}: RangeInputsProps) {
  const i18n = useInternalI18n('date-range-picker');

  return (
    <InternalFormField constraintText={i18n('i18nStrings.dateTimeConstraintText', i18nStrings?.dateTimeConstraintText)}>
      <div className={styles['date-and-time-container']}>
        <div className={styles['date-and-time-wrapper']}>
          <InternalFormField label={i18n('i18nStrings.startDateLabel', i18nStrings?.startDateLabel)} stretch={true}>
            <InternalDateInput
              value={startDate}
              className={styles['start-date-input']}
              onChange={event => onChangeStartDate(event.detail.value)}
              placeholder="YYYY/MM/DD"
            />
          </InternalFormField>
          {!dateOnly && (
            <InternalFormField label={i18n('i18nStrings.startTimeLabel', i18nStrings?.startTimeLabel)} stretch={true}>
              <InternalTimeInput
                value={startTime}
                onChange={event => onChangeStartTime(event.detail.value)}
                format={timeInputFormat}
                placeholder={timeInputFormat}
                className={styles['start-time-input']}
              />
            </InternalFormField>
          )}
        </div>

        <div className={styles['date-and-time-wrapper']}>
          <InternalFormField label={i18n('i18nStrings.endDateLabel', i18nStrings?.endDateLabel)} stretch={true}>
            <InternalDateInput
              value={endDate}
              className={styles['end-date-input']}
              onChange={event => onChangeEndDate(event.detail.value)}
              placeholder="YYYY/MM/DD"
            />
          </InternalFormField>
          {!dateOnly && (
            <InternalFormField label={i18n('i18nStrings.endTimeLabel', i18nStrings?.endTimeLabel)} stretch={true}>
              <InternalTimeInput
                value={endTime}
                onChange={event => onChangeEndTime(event.detail.value)}
                format={timeInputFormat}
                placeholder={timeInputFormat}
                className={styles['end-time-input']}
              />
            </InternalFormField>
          )}
        </div>
      </div>
    </InternalFormField>
  );
}
