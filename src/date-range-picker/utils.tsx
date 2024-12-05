// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { joinDateTime, splitDateTime } from '../internal/utils/date-time';
import { normalizeTimeString } from '../internal/utils/date-time/join-date-time';
import { DateRangePickerProps } from './interfaces';
import { setTimeOffset } from './time-offset';

export function formatValue(
  value: null | DateRangePickerProps.Value,
  {
    timeOffset,
    granularity,
    dateOnly,
  }: {
    timeOffset: { startDate?: number; endDate?: number };
    granularity: DateRangePickerProps['granularity'];
    dateOnly: boolean;
  }
): null | DateRangePickerProps.Value {
  if (!value || value.type === 'relative') {
    return value;
  }
  if (granularity === 'month' || dateOnly) {
    return {
      type: 'absolute',
      startDate: dateOnly
        ? value.startDate.split('T')[0]
        : value.startDate.split('T')[0].split('-').slice(0, 2).join('-'),
      endDate: dateOnly ? value.endDate.split('T')[0] : value.endDate.split('T')[0].split('-').slice(0, 2).join('-'),
    };
  }

  return setTimeOffset(value, timeOffset);
}

export function getDefaultMode(
  value: null | DateRangePickerProps.Value,
  relativeOptions: readonly DateRangePickerProps.RelativeOption[],
  rangeSelectorMode: DateRangePickerProps.RangeSelectorMode
) {
  if (value && value.type) {
    return value.type;
  }
  if (rangeSelectorMode === 'relative-only') {
    return 'relative';
  }
  if (rangeSelectorMode === 'absolute-only') {
    return 'absolute';
  }
  return relativeOptions.length > 0 ? 'relative' : 'absolute';
}

export function splitAbsoluteValue(
  value: null | DateRangePickerProps.AbsoluteValue
): DateRangePickerProps.PendingAbsoluteValue {
  if (!value) {
    return {
      start: { date: '', time: '' },
      end: { date: '', time: '' },
    };
  }
  return { start: splitDateTime(value.startDate), end: splitDateTime(value.endDate) };
}

export function joinAbsoluteValue(
  value: DateRangePickerProps.PendingAbsoluteValue
): DateRangePickerProps.AbsoluteValue {
  const startTime = normalizeTimeString(value.start.time || '00:00:00');
  const endTime = normalizeTimeString(value.end.time || '23:59:59');

  return {
    type: 'absolute',
    startDate: joinDateTime(value.start.date, startTime),
    endDate: joinDateTime(value.end.date, endTime),
  };
}
