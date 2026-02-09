// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import InternalDateInput from '../../date-input/internal';
import InternalFormField from '../../form-field/internal';
import { useInternalI18n } from '../../i18n/context.js';
import InternalTimeInput from '../../time-input/internal';
import { RangeInputsProps } from './interfaces';
import { generateI18NFallbackKey, generateI18NKey, provideI18N } from './utils';

import styles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

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
  dateInputFormat,
  granularity,
}: RangeInputsProps) {
  const i18n = useInternalI18n('date-range-picker');
  const isMonthPicker = granularity === 'month';
  const showTimeInput = !dateOnly && !isMonthPicker;
  const isIso = dateInputFormat === 'iso';
  const separator = isIso ? '-' : '/';
  const defaultDateInputPlaceholder = `YYYY${separator}MM${isMonthPicker ? '' : `${separator}DD`}`;
  const datePlaceholder = isIso
    ? i18n('i18nStrings.isoDatePlaceholder', i18nStrings?.isoDatePlaceholder) || defaultDateInputPlaceholder
    : i18n('i18nStrings.slashedDatePlaceholder', i18nStrings?.slashedDatePlaceholder) || defaultDateInputPlaceholder;
  const timePlaceholder = i18n('i18nStrings.timePlaceholder', i18nStrings?.timePlaceholder) || timeInputFormat;
  const i18nProvided = provideI18N(i18nStrings!, isMonthPicker, dateOnly, isIso);
  const i18nKey = generateI18NKey(isMonthPicker, dateOnly, isIso);
  const i18nFallbackKey = generateI18NFallbackKey(isMonthPicker, dateOnly);
  return (
    <InternalFormField constraintText={i18n(i18nKey, i18nProvided) || i18n(i18nFallbackKey, i18nProvided)}>
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
              format={dateInputFormat}
              placeholder={datePlaceholder}
              granularity={granularity}
            />
          </InternalFormField>
          {showTimeInput && (
            <InternalFormField stretch={true} label={i18n('i18nStrings.startTimeLabel', i18nStrings?.startTimeLabel)}>
              <InternalTimeInput
                value={startTime}
                onChange={event => onChangeStartTime(event.detail.value)}
                format={timeInputFormat}
                placeholder={timePlaceholder}
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
              format={dateInputFormat}
              placeholder={datePlaceholder}
              granularity={granularity}
            />
          </InternalFormField>
          {showTimeInput && (
            <InternalFormField label={i18n('i18nStrings.endTimeLabel', i18nStrings?.endTimeLabel)} stretch={true}>
              <InternalTimeInput
                value={endTime}
                onChange={event => onChangeEndTime(event.detail.value)}
                format={timeInputFormat}
                placeholder={timePlaceholder}
                className={testutilStyles['end-time-input']}
              />
            </InternalFormField>
          )}
        </div>
      </div>
    </InternalFormField>
  );
}
