// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';
import { DateRangePickerProps, Focusable } from './interfaces';
import { ButtonProps } from '../button/interfaces';
import useFocusVisible from '../internal/hooks/focus-visible';

const VALID_RANGE: DateRangePickerProps.ValidRangeResult = { valid: true };

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

export function useDateRangePicker({
  value,
  relativeOptions,
  rangeSelectorMode,
  isValidRange,
}: UseDateRangePickerProps) {
  const focusVisible = useFocusVisible();
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const applyButtonRef = useRef<ButtonProps.Ref>(null);

  const [rangeSelectionMode, setRangeSelectionMode] = useState<'absolute' | 'relative'>(
    getDefaultMode(value, relativeOptions, rangeSelectorMode!)
  );

  const [selectedAbsoluteRange, setSelectedAbsoluteRange] = useState<DateRangePickerProps.AbsoluteValue | null>(
    value?.type === 'absolute' ? value : null
  );

  const [selectedRelativeRange, setSelectedRelativeRange] = useState<DateRangePickerProps.RelativeValue | null>(
    value?.type === 'relative' ? value : null
  );

  const [applyClicked, setApplyClicked] = useState<boolean>(false);

  const [validationResult, setValidationResult] = useState<
    DateRangePickerProps.ValidRangeResult | DateRangePickerProps.InvalidRangeResult
  >(VALID_RANGE);

  useEffect(() => {
    if (applyClicked) {
      const visibleRange =
        rangeSelectionMode === 'relative' ? selectedRelativeRange : fillMissingTime(selectedAbsoluteRange);

      const newValidationResult = isValidRange(visibleRange);
      setValidationResult(newValidationResult || VALID_RANGE);
    }
  }, [applyClicked, isValidRange, rangeSelectionMode, selectedRelativeRange, selectedAbsoluteRange]);

  const focusRefs = {
    default: useRef<Focusable>(null),
    'absolute-only': useRef<Focusable>(null),
    'relative-only': useRef<Focusable>(null),
  };

  useEffect(() => scrollableContainerRef.current?.focus(), [scrollableContainerRef]);

  return {
    applyButtonRef,
    focusVisible,
    focusRefs,
    scrollableContainerRef,
    rangeSelectionMode,
    setRangeSelectionMode,
    selectedAbsoluteRange,
    setSelectedAbsoluteRange,
    selectedRelativeRange,
    setSelectedRelativeRange,
    applyClicked,
    setApplyClicked,
    validationResult,
    setValidationResult,
    VALID_RANGE,
  };
}

export interface UseDateRangePickerProps {
  value: null | DateRangePickerProps.Value;
  relativeOptions: ReadonlyArray<DateRangePickerProps.RelativeOption>;
  rangeSelectorMode?: DateRangePickerProps.RangeSelectorMode;
  isValidRange: DateRangePickerProps.ValidationFunction;
}
