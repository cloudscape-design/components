// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import Calendar, { DayIndex } from './calendar';
import InternalBox from '../box/internal';
import SpaceBetween from '../space-between/index.js';

import RelativeRangePicker from './relative-range';
import ModeSwitcher from './mode-switcher';
import { useDateRangePicker } from './use-date-range-picker';
import { DateRangePickerBaseProps } from './interfaces';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import InternalAlert from '../alert/internal';
import LiveRegion from '../internal/components/live-region';
import styles from './styles.css.js';
import { VALID_RANGE } from './editor';
import { DateRangePickerProps, Focusable } from './interfaces';

export interface DateRangePickerDropdownProps
  extends Pick<
    Required<DateRangePickerBaseProps>,
    | 'value'
    | 'relativeOptions'
    | 'isDateEnabled'
    | 'locale'
    | 'isValidRange'
    | 'i18nStrings'
    | 'dateOnly'
    | 'rangeSelectorMode'
    | 'timeInputFormat'
    | 'onChange'
    | 'timeOffset'
  > {
  startOfWeek: DayIndex;
  isSingleGrid: boolean;

  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

export function DateRangePickerEmbedded({
  value,
  locale = '',
  startOfWeek,
  isDateEnabled = () => true,
  relativeOptions,
  isSingleGrid,
  i18nStrings,
  dateOnly,
  timeInputFormat,
  rangeSelectorMode,
  onChange,
  timeOffset,
  isValidRange,
}: DateRangePickerDropdownProps) {
  const {
    fillMissingTime,
    rangeSelectionMode,
    setRangeSelectionMode,
    selectedAbsoluteRange,
    setSelectedAbsoluteRange,
    selectedRelativeRange,
    setSelectedRelativeRange,
    validationResult,
    setValidationResult,
    formatValue,
  } = useDateRangePicker({
    value,
    relativeOptions,
    rangeSelectorMode,
  });

  function updateRange(value: DateRangePickerProps.AbsoluteValue | DateRangePickerProps.RelativeValue) {
    const newValue = value.type === 'relative' ? value : fillMissingTime(value);

    if (newValue) {
      const validationResult = isValidRange(newValue);
      setValidationResult(validationResult || VALID_RANGE);
      if (validationResult?.valid === false) {
        setValidationResult(validationResult);
      }
    }

    fireNonCancelableEvent(onChange, { value: formatValue(newValue, { dateOnly, timeOffset }) });
  }

  const focusRefs = {
    default: useRef<Focusable>(null),
    'absolute-only': useRef<Focusable>(null),
    'relative-only': useRef<Focusable>(null),
  };

  return (
    <SpaceBetween size="l">
      <InternalBox padding={{ top: 'm', horizontal: 'l' }}>
        <SpaceBetween direction="vertical" size="s">
          {rangeSelectorMode === 'default' && (
            <ModeSwitcher
              ref={focusRefs.default}
              mode={rangeSelectionMode}
              onChange={(mode: 'absolute' | 'relative') => {
                setRangeSelectionMode(mode);
                setValidationResult(VALID_RANGE);
              }}
              i18nStrings={i18nStrings}
            />
          )}

          {rangeSelectionMode === 'absolute' && (
            <Calendar
              ref={focusRefs['absolute-only']}
              isSingleGrid={isSingleGrid}
              initialEndDate={selectedAbsoluteRange?.endDate}
              initialStartDate={selectedAbsoluteRange?.startDate}
              locale={locale}
              startOfWeek={startOfWeek}
              isDateEnabled={isDateEnabled}
              i18nStrings={i18nStrings}
              onSelectDateRange={range => {
                setSelectedAbsoluteRange(range);
                updateRange(range);
              }}
              dateOnly={dateOnly}
              timeInputFormat={timeInputFormat}
            />
          )}

          {rangeSelectionMode === 'relative' && (
            <RelativeRangePicker
              ref={focusRefs['relative-only']}
              isSingleGrid={isSingleGrid}
              options={relativeOptions}
              dateOnly={dateOnly}
              initialSelection={selectedRelativeRange}
              onChange={range => {
                setSelectedRelativeRange(range);
                updateRange(range);
              }}
              i18nStrings={i18nStrings}
            />
          )}
        </SpaceBetween>
      </InternalBox>

      <InternalBox className={styles['validation-section']} margin={!validationResult.valid ? { top: 's' } : undefined}>
        {!validationResult.valid && (
          <>
            <InternalAlert type="error">
              <span className={styles['validation-error']}>{validationResult.errorMessage}</span>
            </InternalAlert>
            <LiveRegion>{validationResult.errorMessage}</LiveRegion>
          </>
        )}
      </InternalBox>
    </SpaceBetween>
  );
}
