// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { DateRangePickerProps } from './interfaces';
import Calendar, { DayIndex } from './calendar';
import InternalBox from '../box/internal';
import SpaceBetween from '../space-between/index.js';

import styles from './styles.css.js';
import RelativeRangePicker from './relative-range';
import ModeSwitcher from './mode-switcher';
import clsx from 'clsx';
import InternalAlert from '../alert/internal';
import LiveRegion from '../internal/components/live-region';
import { useDateRangePicker } from './use-date-range-picker';

export interface DateRangePickerDropdownProps
  extends Pick<
    Required<DateRangePickerProps>,
    | 'locale'
    | 'isDateEnabled'
    | 'isValidRange'
    | 'value'
    | 'relativeOptions'
    | 'i18nStrings'
    | 'dateOnly'
    | 'timeInputFormat'
    | 'rangeSelectorMode'
  > {
  startOfWeek: DayIndex;
  isSingleGrid: boolean;

  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

export function DateRangePickerEmbedded({
  locale = '',
  startOfWeek,
  isDateEnabled,
  isValidRange,
  value,
  relativeOptions,
  isSingleGrid,
  i18nStrings,
  dateOnly,
  timeInputFormat,
  rangeSelectorMode,
  ariaLabelledby,
  ariaDescribedby,
}: DateRangePickerDropdownProps) {
  const {
    focusVisible,
    focusRefs,
    scrollableContainerRef,
    rangeSelectionMode,
    setRangeSelectionMode,
    selectedAbsoluteRange,
    setSelectedAbsoluteRange,
    selectedRelativeRange,
    setSelectedRelativeRange,
    validationResult,
    setValidationResult,
    VALID_RANGE,
  } = useDateRangePicker({
    value,
    relativeOptions,
    rangeSelectorMode,
    isValidRange,
  });

  return (
    <div
      {...focusVisible}
      ref={scrollableContainerRef}
      className={styles.dropdown}
      tabIndex={0}
      aria-label={i18nStrings.ariaLabel}
      aria-labelledby={ariaLabelledby ?? i18nStrings.ariaLabelledby}
      aria-describedby={ariaDescribedby ?? i18nStrings.ariaDescribedby}
    >
      <div
        className={clsx(styles['dropdown-content'], {
          [styles['one-grid']]: isSingleGrid,
        })}
      >
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
                  onSelectDateRange={setSelectedAbsoluteRange}
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
                  onChange={range => setSelectedRelativeRange(range)}
                  i18nStrings={i18nStrings}
                />
              )}
            </SpaceBetween>

            <InternalBox
              className={styles['validation-section']}
              margin={!validationResult.valid ? { top: 's' } : undefined}
            >
              {!validationResult.valid && (
                <>
                  <InternalAlert type="error">
                    <span className={styles['validation-error']}>{validationResult.errorMessage}</span>
                  </InternalAlert>
                  <LiveRegion>{validationResult.errorMessage}</LiveRegion>
                </>
              )}
            </InternalBox>
          </InternalBox>
        </SpaceBetween>
      </div>
    </div>
  );
}
