// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import Calendar from './calendar';
import InternalBox from '../box/internal';
import SpaceBetween from '../space-between/index.js';

import RelativeRangePicker from './relative-range';
import ModeSwitcher from './mode-switcher';
import { useDateRangePicker } from './use-date-range-picker';
import { DateRangePickerBaseProps } from './interfaces';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import { DateRangePickerProps, Focusable } from './interfaces';
import { formatValue } from './use-date-range-picker.js';
import { useMobile } from '../internal/hooks/use-mobile';

export interface DateRangePickerEmbeddedProps extends DateRangePickerBaseProps {
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

export function DateRangePickerEmbedded({
  value,
  locale = '',
  startOfWeek,
  isDateEnabled = () => true,
  relativeOptions,
  i18nStrings,
  dateOnly = false,
  timeInputFormat = 'hh:mm:ss',
  rangeSelectorMode = 'default',
  onChange,
  timeOffset,
}: DateRangePickerEmbeddedProps) {
  const {
    fillMissingTime,
    rangeSelectionMode,
    setRangeSelectionMode,
    selectedAbsoluteRange,
    setSelectedAbsoluteRange,
    selectedRelativeRange,
    setSelectedRelativeRange,
  } = useDateRangePicker({
    value,
    relativeOptions,
    rangeSelectorMode,
  });

  const isSingleGrid = useMobile();

  function updateRange(value: DateRangePickerProps.AbsoluteValue | DateRangePickerProps.RelativeValue) {
    const newValue = value.type === 'relative' ? value : fillMissingTime(value);

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
    </SpaceBetween>
  );
}
