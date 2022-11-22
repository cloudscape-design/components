// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from './interfaces';
import { setTimeOffset } from './time-offset';

/**
 * This function fills in a start and end time if they are missing.
 */
export function fillMissingTime(value: DateRangePickerProps.AbsoluteValue | null) {
  if (!value) {
    return value;
  }
  const [startDate, startTime] = value.startDate.split('T');
  const [endDate, endTime] = value.endDate.split('T');
  return {
    ...value,
    startDate: startTime ? value.startDate : `${startDate}T00:00:00`,
    endDate: endTime ? value.endDate : `${endDate}T23:59:59`,
  };
}

export function formatValue(
  value: null | DateRangePickerProps.Value,
  { timeOffset, dateOnly }: { timeOffset: { startDate?: number; endDate?: number }; dateOnly: boolean }
): null | DateRangePickerProps.Value {
  if (!value || value.type === 'relative') {
    return value;
  }
  if (dateOnly) {
    return {
      type: 'absolute',
      startDate: value.startDate.split('T')[0],
      endDate: value.endDate.split('T')[0],
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
