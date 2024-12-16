// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { joinDateTime, splitDateTime } from '../internal/utils/date-time';
import { isIsoDateOnly, isIsoMonthOnly } from '../internal/utils/date-time';
import { normalizeTimeString } from '../internal/utils/date-time/join-date-time';
import { DateRangePickerProps } from './interfaces';
import { setTimeOffset, shiftTimeOffset } from './time-offset';

type NormalizedTimeOffset =
  | {
      startDate: number;
      endDate: number;
    }
  | {
      startDate: undefined;
      endDate: undefined;
    };

function isAbsoluteValue(value: null | DateRangePickerProps.Value): value is DateRangePickerProps.AbsoluteValue {
  return value !== null && value?.type === 'absolute';
}

function isEmptyAbsoluteValue(value: DateRangePickerProps.AbsoluteValue): boolean {
  return value.type === 'absolute' && value.startDate === '' && value.endDate === '';
}

function isDateOrMonthOnly(
  value: DateRangePickerProps.AbsoluteValue,
  checkFn: typeof isIsoDateOnly | typeof isIsoMonthOnly
): boolean {
  return checkFn(value.startDate) && checkFn(value.endDate);
}

export function formatValue(
  value: null | DateRangePickerProps.Value,
  {
    timeOffset,
    monthOnly,
    dateOnly,
  }: {
    timeOffset: NormalizedTimeOffset | null;
    monthOnly: boolean;
    dateOnly: boolean;
  }
): null | DateRangePickerProps.Value {
  if (!isAbsoluteValue(value) || isEmptyAbsoluteValue(value)) {
    return value;
  }

  if (monthOnly || dateOnly) {
    const [startPart, endPart] = [value.startDate, value.endDate].map(date =>
      //strip out time or day+time text from dates
      monthOnly ? date.split('T')[0].split('-').slice(0, 2).join('-') : date.split('T')[0]
    );
    return { type: 'absolute', startDate: startPart, endDate: endPart };
  }

  return setTimeOffset(
    value,
    timeOffset === null
      ? {
          startDate: undefined,
          endDate: undefined,
        }
      : timeOffset
  );
}

export function getDefaultMode(
  value: null | DateRangePickerProps.Value,
  relativeOptions: readonly DateRangePickerProps.RelativeOption[],
  rangeSelectorMode: DateRangePickerProps.RangeSelectorMode
): 'relative' | 'absolute' {
  if (value?.type) {
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
  value: null | DateRangePickerProps.AbsoluteValue,
  hideTime = false
): DateRangePickerProps.PendingAbsoluteValue {
  if (!value) {
    return { start: { date: '', time: '' }, end: { date: '', time: '' } };
  }

  return {
    start: {
      ...splitDateTime(value.startDate),
      ...(hideTime ? { time: '' } : {}),
    },
    end: {
      ...splitDateTime(value.endDate),
      ...(hideTime ? { time: '' } : {}),
    },
  };
}

export function joinAbsoluteValue(
  value: DateRangePickerProps.PendingAbsoluteValue,
  hideTime = false
): DateRangePickerProps.AbsoluteValue {
  const [startTime, endTime] = [value.start.time || '00:00:00', value.end.time || '23:59:59'].map(normalizeTimeString);
  return {
    type: 'absolute',
    startDate: hideTime ? value.start.date : joinDateTime(value.start.date, startTime),
    endDate: hideTime ? value.end.date : joinDateTime(value.end.date, endTime),
  };
}

export function formatInitialValue(
  value: null | DateRangePickerProps.Value,
  dateOnly: boolean,
  monthOnly: boolean,
  normalizedTimeOffset: NormalizedTimeOffset
): DateRangePickerProps.Value | null {
  if (!isAbsoluteValue(value)) {
    return shiftTimeOffset(value, normalizedTimeOffset);
  }
  if (isEmptyAbsoluteValue(value)) {
    return value;
  }
  if (dateOnly || monthOnly) {
    return formatValue(value, { dateOnly, monthOnly, timeOffset: normalizedTimeOffset });
  }
  if (isDateOrMonthOnly(value, isIsoDateOnly) || isDateOrMonthOnly(value, isIsoMonthOnly)) {
    return value;
  }
  return shiftTimeOffset(value, normalizedTimeOffset);
}
