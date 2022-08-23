// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { DateRangePickerProps } from './interfaces';
import { setTimeOffset } from './time-offset';
/**
 * This function fills in a start and end time if they are missing.
 */
function fillMissingTime(value: DateRangePickerProps.AbsoluteValue | null) {
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
  { timeOffset, dateOnly }: { timeOffset: number; dateOnly: boolean }
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

function getDefaultMode(
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

export function useDateRangePicker({ value, relativeOptions, rangeSelectorMode }: UseDateRangePickerProps) {
  const [rangeSelectionMode, setRangeSelectionMode] = useState<'absolute' | 'relative'>(
    getDefaultMode(value, relativeOptions, rangeSelectorMode)
  );

  const [selectedAbsoluteRange, setSelectedAbsoluteRange] = useState<DateRangePickerProps.AbsoluteValue | null>(
    value?.type === 'absolute' ? value : null
  );

  const [selectedRelativeRange, setSelectedRelativeRange] = useState<DateRangePickerProps.RelativeValue | null>(
    value?.type === 'relative' ? value : null
  );

  return {
    fillMissingTime,
    rangeSelectionMode,
    setRangeSelectionMode,
    selectedAbsoluteRange,
    setSelectedAbsoluteRange,
    selectedRelativeRange,
    setSelectedRelativeRange,
  };
}

export interface UseDateRangePickerProps {
  value: null | DateRangePickerProps.Value;
  relativeOptions: ReadonlyArray<DateRangePickerProps.RelativeOption>;
  rangeSelectorMode: DateRangePickerProps.RangeSelectorMode;
}
